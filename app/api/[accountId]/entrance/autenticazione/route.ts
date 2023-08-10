import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { discotecaId: string } }
) {
    const { username, password } =
        await req.json();

    const account = await prismadb.accounts.findFirst({
        where: {
            password: {
                equals: password
            },
            AND: {
                username: {
                    equals: username
                }
            }
        }
    })
    if (account)
        return NextResponse.json(
            { accesso: true, url: process.env.DISCOXSPOT_ENTRANCE + `/${account?.discotecaId!}/${account.id}` },
            {
                headers: corsHeaders,
            }
        );
    else return NextResponse.json(
        { accesso: false },
        {
            headers: corsHeaders,
        }
    );
}
