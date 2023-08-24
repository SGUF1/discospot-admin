import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Data, Order, Prodotto } from "@prisma/client";
import getGlobalHours from "@/actions/getGlobalHours";

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
  const { tavolo, prodotti, data, numeroPersone, codiceTavolo, userAccountId } =
    await req.json();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const prod: ProdottoConQuantity[] = prodotti;
  const date = new Date(data)
  var order: Order | null;
  var calendarioOrdine : Data | null
  if (tavolo && prodotti && data && numeroPersone) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "EUR",
        product_data: {
          name: tavolo.numeroTavolo,
        },
        unit_amount_decimal: Math.floor(
          (Number(tavolo.prezzo) / Number(numeroPersone)) *
          100
        ).toFixed(2),
      },
    });

    prod.forEach((product) => {
      const unitAmount = Math.floor(product.prodotto.prezzo / numeroPersone * 100);

      line_items.push({
        quantity: product.quantita,
        price_data: {
          currency: "EUR",
          product_data: {
            name: product.prodotto.nome,
          },
          unit_amount_decimal: unitAmount.toFixed(2),
        },
      });
    });
    var totale = prod.reduce((total, orderItem) => {
      return (
        total + (orderItem.prodotto.prezzo * orderItem.quantita) / numeroPersone
      );
    }, Number(Number(tavolo.prezzo) / numeroPersone));

    totale = (totale * 5.2) / 100 + 0.68;
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "EUR",
        product_data: {
          name: "Commissioni",
        },
        unit_amount_decimal: Math.floor(totale * 100).toFixed(2),
      },
    });

    const orderItemsData = prod.map((product) => ({
      prodotto: {
        create: {
          descrizione: product.prodotto.descrizione,
          nome: product.prodotto.nome,
          limite: product.prodotto.limite,
          imageUrl: product.prodotto.imageUrl,
          prezzo: product.prodotto.prezzo,
          portataId: product.prodotto.portataId,
          itemProduct: true
          
        },
      },
      quantity: product.quantita,
      portata: {
        connect: {
          id: product.prodotto.portataId,
        },
      },
    }));

    const dataAttuale = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + getGlobalHours, new Date().getMinutes())
    const lastIndex = line_items.length - 1;
    const prezzoTotale = line_items
      .slice(0, lastIndex)
      .reduce((total, item) => total + Number(item.price_data?.unit_amount_decimal), 0) / 100;

    order = await prismadb.order.create({
      data: {
        discotecaId: params.discotecaId,
        isPaid: false,
        createdAt: dataAttuale.toISOString(),
        orderDate: data,
        numeroPersone,
        prezzoTotale,
        tavoloId: tavolo?.id,
        taxPrezzo: Number(line_items[lastIndex].price_data?.unit_amount_decimal) / 100,
        statoId: "8d356af8-dc09-42f1-86da-90c64c20638b",
        orderItems: {
          create: orderItemsData,
        },
      },
    });

    // calendarioOrdine = await prismadb.data.create({
    //   data: {
    //     data: order.orderDate,
    //     stato: {
    //       connect: {
    //         id: "9a3d047f-350d-4fb5-9dfa-45f5869f705f",
    //       },
    //     },
    //     tavolo: {
    //       connect: {
    //         id: tavolo?.id
    //       }
    //     },

    //   }
    // })
  }

  if (codiceTavolo) {
    order = await prismadb.order.findUnique({
      where: {
        codice: codiceTavolo
      },
      include: {
        orderItems: true,
        tavolo: true
      }
    })
  }
  if (!order!) {
    return new NextResponse("Errore nel trovare l'ordine", { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/${params.discotecaId}?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/${params.discotecaId}?canceled=1`,
    metadata: {
      orderId: order!.id,
      userAccountId,
      codiceTavolo,
      // calendarioOrdineId: calendarioOrdine!.id
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
