import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { accountId: string, discotecaId: string, adminId: string } }) {
    try {

        const accounts = await prismadb.accounts.findUnique({
            where: {
                id: params.adminId
            },
            include: {
                discoteca: true,
            }
        });

        return NextResponse.json(accounts);
    } catch (error) {
        console.log("[ORDER GET]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
    }
}