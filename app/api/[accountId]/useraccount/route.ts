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

export async function POST(req: Request) {
  const { userId } = await req.json();

  const userAccounts = await prismadb.userAccount.findUnique({
    where: {
      id: userId,
    },
  });

  if(userAccounts)
    return new NextResponse("Account already exists", {status: 400})

    const userAccount = await prismadb.userAccount.create({
        data: {
            id: userId
        }
    })
    
}
