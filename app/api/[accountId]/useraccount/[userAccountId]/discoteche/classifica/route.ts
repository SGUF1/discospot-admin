import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, userAccountId: string } }) {
    try {

        const discoteche = await prismadb.discoteca.findMany({
            where: {
                visibile: true
            },
            orderBy: {
                like: 'desc'
            },
            include: {
                sale: true,
                provincia: true,
                userAccounts: true
            }
        });
        return NextResponse.json(discoteche);
    } catch (error) {
        console.log("[DISCOTECHE LIKES GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}