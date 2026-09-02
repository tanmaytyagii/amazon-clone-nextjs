import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validators";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Sign in before checkout." }, { status: 401 });
  }

  const payload = checkoutSchema.parse(await request.json());
  const productIds = payload.items.map((item) => item.productId);

  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  const catalogProducts =
    dbProducts.length > 0
      ? dbProducts
      : (
          await Promise.all(payload.items.map((item) => getProductById(item.productId)))
        ).filter((product): product is NonNullable<typeof product> => Boolean(product));

  const orderItems = payload.items.map((item) => {
    const product = catalogProducts.find((entry) => entry.id === item.productId);

    if (!product) {
      throw new Error("Product no longer exists.");
    }

    return {
      product,
      quantity: item.quantity
    };
  });

  const subtotal = orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      subtotal,
      shipping,
      tax,
      total,
      shippingFullName: payload.address.fullName,
      shippingPhone: payload.address.phone,
      shippingLine1: payload.address.line1,
      shippingLine2: payload.address.line2,
      shippingCity: payload.address.city,
      shippingState: payload.address.state,
      shippingPincode: payload.address.pincode,
      items: {
        create: orderItems.map(({ product, quantity }) => ({
          productId: product.id,
          title: product.title,
          image: product.images[0],
          price: product.price,
          quantity
        }))
      }
    }
  });

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: session.user.email ?? undefined,
    line_items: orderItems.map(({ product, quantity }) => ({
      quantity,
      price_data: {
        currency: "inr",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.title,
          images: [product.images[0]]
        }
      }
    })),
    success_url: absoluteUrl(`/checkout/success?orderId=${order.id}`),
    cancel_url: absoluteUrl("/cart"),
    metadata: {
      orderId: order.id,
      userId: session.user.id
    }
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeCheckoutSession: checkout.id }
  });

  return NextResponse.json({ url: checkout.url, orderId: order.id });
}
