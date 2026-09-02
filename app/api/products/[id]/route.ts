import { NextResponse } from "next/server";

import { logDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { getProductById } from "@/lib/products";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, image: true } } }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    logDbFallback("api/products/[id]");
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(product);
  }
}
