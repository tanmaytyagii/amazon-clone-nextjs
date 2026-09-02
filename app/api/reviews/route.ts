import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ message: "productId is required." }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ reviews });
}

async function recomputeProductRating(productId: string) {
  const aggregate = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true }
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count.rating
    }
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Sign in to write a review." }, { status: 401 });
  }

  const payload = reviewSchema.parse(await request.json());

  const product = await prisma.product.findUnique({ where: { id: payload.productId }, select: { id: true } });
  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  const verifiedPurchase = Boolean(
    await prisma.orderItem.findFirst({
      where: {
        productId: payload.productId,
        order: { userId: session.user.id, paymentStatus: "PAID" }
      }
    })
  );

  const existing = await prisma.review.findFirst({
    where: { productId: payload.productId, userId: session.user.id }
  });

  const review = existing
    ? await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating: payload.rating,
          title: payload.title,
          comment: payload.comment,
          verifiedPurchase
        },
        include: { user: { select: { name: true, image: true } } }
      })
    : await prisma.review.create({
        data: {
          productId: payload.productId,
          userId: session.user.id,
          rating: payload.rating,
          title: payload.title,
          comment: payload.comment,
          verifiedPurchase
        },
        include: { user: { select: { name: true, image: true } } }
      });

  await recomputeProductRating(payload.productId);

  return NextResponse.json({ review }, { status: existing ? 200 : 201 });
}
