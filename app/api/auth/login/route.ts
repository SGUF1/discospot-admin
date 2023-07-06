import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { username, password } = body;

    const account = await prismadb.accounts.findFirst({
      where: {
        username: {
          equals: username
        },
        AND: {
          password,
        },
      },
    });

    if (!account) return new NextResponse("Errore", { status: 401 });

    return NextResponse.json(account);
  } catch (error) {
    return new NextResponse("errore", { status: 500 });
  }
}
