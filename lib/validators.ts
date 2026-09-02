import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const productSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  brand: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(12),
  images: z.array(z.string().url()).min(1),
  price: z.number().positive(),
  mrp: z.number().positive(),
  discount: z.number().min(0).max(95),
  stock: z.number().int().min(0),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  tags: z.array(z.string()).default([]),
  isPrime: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20)
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(120),
  comment: z.string().min(10).max(2000)
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  line1: z.string().min(4),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  isDefault: z.boolean().optional()
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  address: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(8),
    line1: z.string().min(4),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(4)
  })
});
