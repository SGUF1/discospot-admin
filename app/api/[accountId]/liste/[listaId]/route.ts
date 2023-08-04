import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, listaId: string } }) {
    try {

        const lista = await prismadb.lista.findUnique({
            where: {
              id: params.listaId   
            },
            include: {
                discoteca: true,
                informazioni: {
                    orderBy: {
                        numeroInformazione: 'asc'
                    }
                },
            }
        });

        return NextResponse.json(lista);
    } catch (error) {
        console.log("[ORDER GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}