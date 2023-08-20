import getGlobalHours from "@/actions/getGlobalHours";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, userAccountId: string } }) {
    try {

        const orderBiglietti = await prismadb.orderBiglietto.findMany({
            where: {
                userAccount: {
                    id: params.userAccountId
                },
                data: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 26, 0),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth() + 10, new Date().getDate(), new Date().getHours() + getGlobalHours, 0)
                },
                codice: {
                    not: "",
                },
                lista: {
                    discoteca: {
                        visibile: true
                    }
                }
            },
            orderBy: {
                data: 'asc'
            },
            include: {
                lista: {
                    include: {
                        discoteca: {
                            include: {
                                provincia: true,

                            }
                        }
                    }
                },
            },
        });
        return NextResponse.json(orderBiglietti);
    } catch (error) {
        console.log("[ORDERS BIGLIETTI GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}