import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const body = await req.json();
    const { username, password, imageUrl } = body;

    if (!username) {
      return new NextResponse("Username is required", { status: 400 });
    }
    if (!password) {
      return new NextResponse("Password is required", { status: 400 });
    }

    if (!params.accountId)
      return new NextResponse("Account ID is required", { status: 400 });

    if (!imageUrl) {
      return new NextResponse("ImageUrl is required", { status: 400 });
    }
    const admin = await prismadb.accounts.update({
      where: {
        id: params.accountId,
      },
      data: {
        username,
        password,
        imageUrl,
      },
    });

    return NextResponse.json(admin);
  } catch (error) {
    return new NextResponse("Internal Error [ACCOUNT PATCH]", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  if (!params.accountId)
    return new NextResponse("Account ID is required", { status: 400 });

  try {
    const admin = await prismadb.accounts.delete({
      where: {
        id: params.accountId,
      },
    });

    return NextResponse.json(admin);
  } catch (error) {
    return new NextResponse("Internal Error [ACCOUNT DELETEs]", {
      status: 500,
    });
  }
}
