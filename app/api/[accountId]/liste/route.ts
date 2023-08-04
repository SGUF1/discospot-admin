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
                }
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