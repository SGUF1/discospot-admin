import getGlobalHours from "@/actions/getGlobalHours";
import prismadb from "@/lib/prismadb";
import { id } from "date-fns/locale";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, userAccountId: string } }) {
    try {
        const orders = await prismadb.order.findMany({
            where: {
                userAccounts: {
                    some: {
                        id: params.userAccountId
                    }
                },
                orderDate: {
                    lt: new Date(new Date().getFullYear(), new Date().getMonth() + 12, new Date().getDate(), new Date().getHours() + getGlobalHours, 0)
                },
                discoteca: {
                    visibile: true
                },
                codice: {
                    not: "",
                }
            },
            orderBy: {
                orderDate: 'asc'
            },
            include: {
                discoteca: {
                    include: {
                        provincia: true
                    }
                },
                tavolo: true,
                stato: true,
            }
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.log("[ORDERS GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}