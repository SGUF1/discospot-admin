import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string; provinciaId: string } }
) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.accountId)
      return new NextResponse("Account Id is required", { status: 400 });

    const provincia = await prismadb.provincia.update({
      where: {
        id: params.provinciaId
      },
      data: {
        name,
      },
    });

    return NextResponse.json(provincia);
  } catch (error) {
    console.log("[PROVINCIA PATCH]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: {accountId: string, provinciaId: string } }
) {
      try {

        const provincia = await prismadb.provincia.delete({
            where: {
                id: params.provinciaId
            }
        });

        return NextResponse.json(provincia);
      } catch (error) {
        console.log("[PROVINCIA DELETE]", error);
        return new NextResponse("Internal Error" + error, { status: 500 });
      }
}

export async function GET(req: Request, {params}: {params: {accountId: string, provinciaId: string}}){
    try {

      const provincia = await prismadb.provincia.findUnique({
        where: {
          id: params.provinciaId,
        },
      });

      return NextResponse.json(provincia);
    } catch (error) {
      console.log("[PROVINCIA GET]", error);
      return new NextResponse("Internal Error" + error, { status: 500 });
    }
}