"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(10, "Review must be at least 10 characters"),
});

export async function submitReview(data: z.infer<typeof reviewSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in to write a review" };

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Check if user already reviewed
  const existing = await prisma.review.findFirst({
    where: { userId: session.user.id, productId: parsed.data.productId },
  });
  if (existing) return { error: "You've already reviewed this product" };

  const review = await prisma.review.create({
    data: { ...parsed.data, userId: session.user.id },
    include: { user: { select: { name: true, image: true } } },
  });

  // Update product rating
  const stats = await prisma.review.aggregate({
    where: { productId: parsed.data.productId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: parsed.data.productId },
    data: {
      rating: Math.round((stats._avg.rating ?? 0) * 10) / 10,
      reviewCount: stats._count,
    },
  });

  revalidatePath(`/products/${parsed.data.productId}`);
  return { success: true, review };
}

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
}
