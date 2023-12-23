import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, discotecaId: string, adminId: string, bigliettoId: string } }) {
    try {

        const orderBiglietto = await prismadb.orderBiglietto.findUnique({
            where: {
                codice: params.bigliettoId,
                // @ts-ignore
                AND: {
                    lista: {
                        discotecaId: params.discotecaId
                    }

                }
            },
            include: {
                lista: {
                    include: {
                        discoteca: true
                    }
                },
                userAccount: true,
            }
        });

        return NextResponse.json(orderBiglietto);
    } catch (error) {
        console.log("[ORDER TAVOLO GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { codice } = await req.json()
        const orderBiglietto = await prismadb.orderBiglietto.update({
            where: {
                codice
            },
            data: {
                confermato: true
            }
        })
        return NextResponse.json(orderBiglietto)
    } catch (error) {
        console.log(error)
    }
}