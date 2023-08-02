import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, userAccountId: string } }) {
    try {

        const orders = await prismadb.order.findMany({
            where: {
                userAccounts: {
                    every: {
                        id: params.userAccountId
                    }
                },
                codice: {
                    not: "",
                }
            },
            include: {
                discoteca: true,
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