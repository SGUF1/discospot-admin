import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const body = await req.json();
    const { nome, isVisible } = body;

    if (!nome) {
      return new NextResponse("Nome is required", { status: 400 });
    }

    const menu = await prismadb.menu.create({
      data: {
        nome,
        isVisible,
        discotecaId: params.discotecaId
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU POST]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string; discotecaId: string } }
) {
  try {
    const menu = await prismadb.menu.findMany({
      where: {
        discotecaId: params.discotecaId,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
