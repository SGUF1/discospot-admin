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
  try {
    const { userId,  } = await req.json();

    const userAccounts = await prismadb.userAccount.findUnique({
      where: {
        id: userId,
      },
    });

    if (userAccounts) {
      return new NextResponse("Account already exist")
    }

    const userAccount = await prismadb.userAccount.create({
      data: {
        id: userId,
      },
    });
  } catch (error) { }

}

export async function GET(req: Request) {
  try {
    const userAccounts = await prismadb.userAccount.findMany({
      include: {
        discoteche: true
      }
    }
    )
    return NextResponse.json(userAccounts)
  } catch (error) {

  }
}