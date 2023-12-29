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

export async function POST(req: Request, { params }: { params: { discotecaId: string } }) {
    try {
        const { userAccountId, listaId, firstName, lastName, gender } = await req.json();

        if (!userAccountId || !listaId || !firstName || !lastName || !gender) {
            throw new Error("Missing required fields");
        }

        const lista = await prismadb.lista.findUnique({
            where: { id: listaId }
        });

        if (!lista) {
            throw new Error("Lista not found");
        }

        const orderBiglietto = await prismadb.orderBiglietto.create({
            data: {
                prezzo: gender === 'm' ? lista.prezzoBiglietto : lista.prezzoDonna!,
                data: lista.dataLimite,
                listaId,
                completeName: `${firstName} ${lastName}`,
                gender
            },
            include: { lista: { include: { discoteca: true } } }
        });

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            quantity: 1,
            price_data: {
                currency: "EUR",
                product_data: { name: "Biglietto" },
                unit_amount_decimal: Math.floor(orderBiglietto.prezzo * 100).toFixed(2)
            }
        }];

        const totale = orderBiglietto.prezzo * orderBiglietto.lista.discoteca.ticketCommission / 100 + 0.60;
        line_items.push({
            quantity: 1,
            price_data: {
                currency: 'EUR',
                product_data: { name: 'Commissioni' },
                unit_amount_decimal: Math.floor(totale * 100).toFixed(2)
            },
        });

        const account = await prismadb.userAccount.findUnique({ where: { id: userAccountId } });
        if (account) {
            await prismadb.userAccount.update({
                where: { id: userAccountId },
                data: { name: firstName, surname: lastName, gender }
            });
        }

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            phone_number_collection: { enabled: true },
            success_url: `${process.env.FRONTEND_STORE_URL}/liste?success=1`,
            cancel_url: `${process.env.FRONTEND_STORE_URL}/liste?canceled=1`,
            metadata: { orderBigliettoId: orderBiglietto.id, userAccountId, listaId, gender }
        });

        return NextResponse.json({ url: session.url }, { headers: corsHeaders });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500, headers: corsHeaders });
    }
}