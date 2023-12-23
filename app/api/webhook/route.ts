import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Order } from "@prisma/client";
export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }
  const session = event.data.object as Stripe.Checkout.Session;
  function generateUniqueCode() {
    const codeLength = 12;
    const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }


  async function checkCodeUniqueness(code: any) {
    const existingOrder = await prismadb.order.findFirst({
      where: {
        codice: code
      }
    });

    return existingOrder === null;
  }
  async function generateUniqueOrderCode() {
    let code;
    do {
      code = await generateUniqueCode();
    } while (!(await checkCodeUniqueness(code)));

    return code;
  }
  if (session?.metadata?.orderId) {


    const code = await generateUniqueOrderCode()
    if (event.type === "checkout.session.completed") {
      var order: Order | null
      if (!session?.metadata?.codiceTavolo) {
        order = await prismadb.order.update({
          where: {
            id: session?.metadata?.orderId,
          },
          data: {
            isPaid: true,
            numeroPersonePagato: 1,
            codice: code,
            stato: {
              connect: {
                id: "471ce627-12af-44fc-bbcb-95f83c1827cf"
              }
            },
            phone: session?.customer_details?.phone || "",
            userAccounts: {
              connect: {
                id: session?.metadata?.userAccountId
              }
            }
          },
          include: {
            orderItems: true,
            tavolo: true
          },
        });
      } else {
        order = await prismadb.order.findUnique({
          where: {
            codice: session?.metadata?.codiceTavolo
          },
        })
        if (order) {
          order = await prismadb.order.update({
            where: {
              codice: session?.metadata?.codiceTavolo
            },
            data: {
              prezzoTotale: order.prezzoTotale * order.numeroPersonePagato,
              numeroPersonePagato: order.numeroPersonePagato + 1,
              userAccounts: {
                connect: {
                  id: session?.metadata?.userAccountId
                }
              }
            }
          })
        }
      }

      //   const tavoloId = order!.tavoloId
      //   const tavolo = await prismadb.tavolo.findUnique({
      //     where: {
      //       id: tavoloId
      //     }
      //   })

      //   if (tavolo) {
      //     const date = await prismadb.data.create({
      //       data: {
      //         data: order!.orderDate,
      //         tavoloId: tavoloId,
      //         statoId: "085bfc1d-a351-4976-9f0f-53aa08ea2da6"
      //       }
      //     })
      //   }
    }
  } else if (session?.metadata?.orderBigliettoId) {
    const code = await generateUniqueOrderCode()

    if (event.type === "checkout.session.completed") {
      const lista = await prismadb.lista.findUnique({
        where: {
          id: session?.metadata?.listaId
        }
      });

      const updatedLista = await prismadb.lista.update({
        where: {
          id: lista!.id
        },
        data: {
          bigliettiRimanenti: lista!.bigliettiRimanenti! - 1
        }
      });

      const orderBiglietto = await prismadb.orderBiglietto.update({
        where: {
          id: session?.metadata?.orderBigliettoId
        },
        data: {
          isPaid: true,
          userAccount: {
            connect: {
              id: session?.metadata?.userAccountId
            }
          },
          gender: session?.metadata?.gender,
          codice: code,
          phone: session?.customer_details?.phone || "",
          lista: {
            connect: {
              id: updatedLista.id
            }
          }
        }
      });
    }
  }

  return new NextResponse(null, { status: 200 });

}