import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.accountId)
      return new NextResponse("Account ID is required", { status: 400 });

    const tipologiaEvento = await prismadb.tipologiaEvento.create({
      data: {
        name,
      },
    });

    return NextResponse.json(tipologiaEvento);
  } catch (error) {
    console.log("[TIPOLOGIA EVENTO POST]", error);
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

    const tipologiaEvento = await prismadb.tipologiaEvento.findMany();

    return NextResponse.json(tipologiaEvento);
  } catch (error) {
    console.log("[TIPOLOGIA EVENTO GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
