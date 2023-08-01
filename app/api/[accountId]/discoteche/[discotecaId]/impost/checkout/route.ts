import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Order, Prodotto } from "@prisma/client";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

interface ProdottoConQuantity {
  prodotto: Prodotto;
  quantita: number;
}

export async function POST(
  req: Request,
  { params }: { params: { discotecaId: string } }
) {
  const { tavolo, prodotti, data, numeroPersone, codiceTavolo } =
    await req.json();

  if (!tavolo || !prodotti || !data || !numeroPersone) {
    return new NextResponse(
      "Tavolo, Prodotti, Date, and Numero Persone are required",
      { status: 400 }
    );
  }
  const prod: ProdottoConQuantity[] = prodotti;

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  line_items.push({
    quantity: 1,
    price_data: {
      currency: "EUR",
      product_data: {
        name: tavolo.numeroTavolo,
      },
      unit_amount_decimal: (
        (Number(tavolo.prezzo) / Number(numeroPersone)) *
        100
      ).toPrecision(2),
    },
  });

  prod.forEach((product) => {
    line_items.push({
      quantity: product.quantita,
      price_data: {
        currency: "EUR",
        product_data: {
          name: product.prodotto.nome,
        },
        unit_amount_decimal: (
          (product.prodotto.prezzo / numeroPersone) *
          100
        ).toFixed(2),
      },
    });
  });
  var totale = prod.reduce((total, orderItem) => {
    return (
      total + (orderItem.prodotto.prezzo * orderItem.quantita) / numeroPersone
    );
  }, Number(Number(tavolo.prezzo) / numeroPersone));

  totale = (totale * 4.5) / 100;
  line_items.push({
    quantity: 1,
    price_data: {
      currency: "EUR",
      product_data: {
        name: "Commissioni DiscoXSpot",
      },
      unit_amount_decimal: (totale * 100).toPrecision(2),
    },
  });

  const orderItemsData = prod.map((product) => ({
    prodotto: {
      connect: {
        id: product.prodotto?.id,
      },
    },
    quantity: product.quantita,
    portata: {
      connect: {
        id: product.prodotto.portataId,
      },
    },
  }));

   const order = await prismadb.order.create({
      data: {
        discotecaId: params.discotecaId,
        isPaid: false,
        proprietario: codiceTavolo ? false : true,
        orderDate: (new Date(data).getTime()).toString(),
        numeroPersone,
        tavoloId: tavolo?.id,
        statoId: "8d356af8-dc09-42f1-86da-90c64c20638b",
        orderItems: {
          create: orderItemsData,
        },
        codice: codiceTavolo ?? "",
      },
    });
  


  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/${params.discotecaId}?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/${params.discotecaId}?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
