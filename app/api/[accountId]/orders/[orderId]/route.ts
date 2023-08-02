import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, orderId: string } }) {
    try {

        const order = await prismadb.order.findUnique({
            where: {
                codice: params.orderId
            },
            include: {
                discoteca: true,
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}