import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body = await req.json();
    const { nome } = body;

    if (!nome) {
      return new NextResponse("Nome is required", { status: 400 });
    }

    if (!params.accountId)
      return new NextResponse("Account ID is required", { status: 400 });

    const stato = await prismadb.stato.create({
      data: {
        nome,
      },
    });

    return NextResponse.json(stato);
  } catch (error) {
    console.log("[STATO POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    if (!params.accountId)
      return new NextResponse("Account ID is required", { status: 400 });

    const stato = await prismadb.stato.findMany();

    return NextResponse.json(stato);
  } catch (error) {
    console.log("[STATO GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
