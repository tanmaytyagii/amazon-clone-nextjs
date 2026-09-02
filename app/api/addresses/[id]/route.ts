import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validators";

async function requireOwnedAddress(userId: string, id: string) {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== userId) return null;
  return address;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await requireOwnedAddress(session.user.id, id);

  if (!existing) {
    return NextResponse.json({ message: "Address not found." }, { status: 404 });
  }

  const payload = addressSchema.partial().parse(await request.json());

  if (payload.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const address = await prisma.address.update({ where: { id }, data: payload });

  return NextResponse.json({ address });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await requireOwnedAddress(session.user.id, id);

  if (!existing) {
    return NextResponse.json({ message: "Address not found." }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });

  if (existing.isDefault) {
    const next = await prisma.address.findFirst({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }

  return NextResponse.json({ ok: true });
}
