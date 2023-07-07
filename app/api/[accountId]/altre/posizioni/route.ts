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

    const posizione = await prismadb.posizione.create({
      data: {
        nome,
      },
    });

    return NextResponse.json(posizione);
  } catch (error) {
    console.log("[POSIZIONE POST]", error);
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

    const posizione = await prismadb.posizione.findMany();

    return NextResponse.json(posizione);
  } catch (error) {
    console.log("[POSIZIONE GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
