import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(
    req: Request,
    { params }: { params: { discotecaId: string } }
) {
    const { userAccountId, listaId } =
        await req.json();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    const lista = await prismadb.lista.findUnique({
        where: {
            id: listaId
        }
    })
    const orderBiglietto = await prismadb.orderBiglietto.create({
        data: {
            prezzo: lista?.prezzoBiglietto!,
            data: lista?.dataLimite!,
            listaId,
        }
    })

    line_items.push({
        quantity: 1,
        price_data: {
            currency: "EUR",
            product_data: {
                name: "Biglietto",
            },
            unit_amount_decimal: (Math.floor(orderBiglietto.prezzo * 100).toFixed(2))
        }
    })


    const totale = (orderBiglietto.prezzo * 4.5) / 100;
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


    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/liste?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/liste?canceled=1`,
        metadata: {
            orderBigliettoId: orderBiglietto.id,
            userAccountId,
            listaId,
        },
    });

    return NextResponse.json(
        { url: session.url },
        {
            headers: corsHeaders,
        }
    );
}
