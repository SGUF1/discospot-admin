import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; menuId: string };
  }
) {
  try {
    const body = await req.json();
    const { nome, isVisible } = body;

    if (!nome) {
      return new NextResponse("Nome is required", { status: 400 });
    }


    const menu = await prismadb.menu.update({
      where: {
        id: params.menuId,
      },
      data: {
        nome,
        isVisible,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; menuId: string };
  }
) {
  try {
    const menu = await prismadb.menu.delete({
      where: {
        id: params.menuId,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU DELETE]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { accountId: string; discotecaId: string; menuId: string };
  }
) {
  try {
    const menu = await prismadb.menu.findUnique({
      where: {
        id: params.menuId,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
