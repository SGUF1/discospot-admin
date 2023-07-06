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

    const provincia = await prismadb.provincia.create({
      data: {
        name,
      },
    });

    return NextResponse.json(provincia);
  } catch (error) {
    console.log("[PROVINCIA POST]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const province = await prismadb.provincia.findMany({});

    return NextResponse.json(province);
  } catch (error) {
    console.log("[PROVINCIA GET]", error);
    return new NextResponse("Internal Error" + error, { status: 500 });
  }
}
