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
            id: "23ebdf17-5b36-4945-b149-058e9194ece1"
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
          statoId: "23ebdf17-5b36-4945-b149-058e9194ece1"
        }
      })
    }
  }
  return new NextResponse(null, { status: 200 });

}
