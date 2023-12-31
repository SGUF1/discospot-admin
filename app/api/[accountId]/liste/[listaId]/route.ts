import getGlobalHours from "@/actions/getGlobalHours";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, listaId: string } }) {
    try {

        const lista = await prismadb.lista.findUnique({
            where: {
              id: params.listaId,  
                dataLimite: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() - 15, 0),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth() + 10, new Date().getDate(), new Date().getHours() + getGlobalHours, 0)
                }
            },
            
            include: {
                discoteca: true,
                informazioni: {
                    orderBy: {
                        numeroInformazione: 'asc',
                        
                    },
                    include: {
                        tipoInformazione: true,
                    },
                    
                },
            }
        });

        return NextResponse.json(lista);
    } catch (error) {
        console.log("[ORDER GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}