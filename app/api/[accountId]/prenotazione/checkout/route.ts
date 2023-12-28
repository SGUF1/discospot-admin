import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Order, OrderItem, Prodotto } from "@prisma/client";
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
    const { codiceTavolo, userAccountId } =
        await req.json();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    const order = await prismadb.order.findUnique({
        where: {
            codice: codiceTavolo
        },
        include: {
            orderItems: {
                include: {
                    prodotto: true,
                }
            },
            tavolo: true,
            discoteca: true
        }
    })

    const prod: ProdottoConQuantity[] = order!.orderItems.map((orderItem) => ({
        prodotto: orderItem.prodotto,
        quantita: orderItem.quantity,
    }));
    line_items.push({
        quantity: 1,
        price_data: {
            currency: "EUR",
            product_data: {
                name: order!.tavolo.numeroTavolo,
            },
            unit_amount_decimal: order?.tavolo.prezzoPerPosto ? Math.floor(
                (Number(order!.tavolo.prezzo)) *
                100
            ).toFixed(2) : Math.floor(
                (Number(order!.tavolo.prezzo) / Number(order!.numeroPersone)) *
                100
            ).toFixed(2),
        },
    });

    prod.forEach((product) => {
        const unitAmount = Math.floor(product.prodotto.prezzo / order!.numeroPersone * 100);

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
    var totale = 0
    
    if (order?.tavolo.prezzoPerPosto) {
        totale = prod.reduce((total, orderItem) => {
            return (
                total + (orderItem.prodotto.prezzo * orderItem.quantita) / order!.numeroPersone
            );
        }, Number(order!.tavolo.prezzo));
    } else (
        totale = prod.reduce((total, orderItem) => {
            return (
                total + (orderItem.prodotto.prezzo * orderItem.quantita) / order!.numeroPersone
            );
        }, Number(Number(order!.tavolo.prezzo) / order!.numeroPersone))
    )

    totale = (totale * order?.discoteca.tableCommission!) / 100;
    
    line_items.push({
        quantity: 1,
        price_data: {
            currency: "EUR",
            product_data: {
                name: "Commissioni discoXspot",
            },
            unit_amount_decimal: Math.floor(order?.taxPrezzo! *100).toFixed(2),
        },
    });


    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/prenotati?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/prenotati?canceled=1`,
        metadata: {
            orderId: order!.id,
            userAccountId,
            codiceTavolo,
        },
    });

    return NextResponse.json(
        { url: session.url },
        {
            headers: corsHeaders,
        }
    );
}
