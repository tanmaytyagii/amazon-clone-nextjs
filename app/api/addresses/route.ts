import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validators";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ addresses: [] });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });

  return NextResponse.json({ addresses });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Sign in to save an address." }, { status: 401 });
  }

  const payload = addressSchema.parse(await request.json());
  const existingCount = await prisma.address.count({ where: { userId: session.user.id } });
  const makeDefault = payload.isDefault || existingCount === 0;

  if (makeDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: { ...payload, isDefault: makeDefault, userId: session.user.id }
  });

  return NextResponse.json({ address }, { status: 201 });
}
