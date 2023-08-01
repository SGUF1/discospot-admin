import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

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
  if (event.type === "checkout.session.completed") {

    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        stato: {
          connect: {
            id: "471ce627-12af-44fc-bbcb-95f83c1827cf"
          }
        },
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
        tavolo: true
      },
    });
    const tavoloId = order.proprietario ? order.tavoloId : ""
    const tavolo = await prismadb.tavolo.findUnique({
      where: {
        id: tavoloId
      }
    })

    if (tavolo) {
      const date = await prismadb.data.create({
        data: {
          data: order.orderDate,
          tavoloId: tavoloId,
          statoId: "9a3d047f-350d-4fb5-9dfa-45f5869f705f"
        }
      })
    }
  }
  return new NextResponse(null, { status: 200 });

}
