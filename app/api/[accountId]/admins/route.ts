import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body = await req.json();
    const { username, password, superior } = body;

    if (!username) {
      return new NextResponse("Username is required", { status: 400 });
    }
    if (!password) {
      return new NextResponse("Password is required", { status: 400 });
    }

    if (!params.accountId)
      return new NextResponse("Account Id is required", { status: 400 });

    const admin = await prismadb.accounts.create({
      data: {
        username,
        password,
        superior,
      },
    });

    return NextResponse.json(admin);
  } catch (error) {
    console.log("[ADMIN POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
