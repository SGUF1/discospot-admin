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

  function generateUniqueCode() {
    const codeLength = 8;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
  const session = event.data.object as Stripe.Checkout.Session;

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

    const tavoloId = order!.proprietario ? order!.tavoloId : ""
    const tavolo = await prismadb.tavolo.findUnique({
      where: {
        id: tavoloId
      }
    })

    if (tavolo) {
      const date = await prismadb.data.create({
        data: {
          data: order!.orderDate,
          tavoloId: tavoloId,
          statoId: "085bfc1d-a351-4976-9f0f-53aa08ea2da6"
        }
      })
    }
  }


  return new NextResponse(null, { status: 200 });

}
