import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, discotecaId: string, adminId: string, orderTavoloId: string } }) {
    try {

        const orderTavolo = await prismadb.order.findUnique({
            where: {
                codice: params.orderTavoloId,
                // @ts-ignore
                AND: {
                    tavolo: {
                        sala: {
                            discotecaId: params.discotecaId
                        }
                    }
                }
            },
            include: {
                tavolo: true,
                discoteca: true
            }
        });

        return NextResponse.json(orderTavolo);
    } catch (error) {
        console.log("[ORDER TAVOLO GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { codice } = await req.json()
        const orderTavolo = await prismadb.order.update({
            where: {
                codice
            },
            data: {
                numeroPersonePagato: {
                    decrement: 1
                }
            }
        })
        return NextResponse.json(orderTavolo)
    } catch (error) {
        console.log(error)
    }
}