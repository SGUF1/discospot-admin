import getGlobalHours from "@/actions/getGlobalHours";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, } }) {
    try {

        const liste = await prismadb.lista.findMany({
            where: {
                discoteca: {
                    visibile: true
                },
                bigliettiRimanenti: {
                    not: 0
                },
                dataLimite: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() - 24, 0),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth() + 10, new Date().getDate(), new Date().getHours() + getGlobalHours, 0)
                }
            },
            orderBy: {
                priority: 'desc'
            },
            include: {
                discoteca: true,
            },
        });

        return NextResponse.json(liste);
    } catch (error) {
        console.log("[ORDER GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}