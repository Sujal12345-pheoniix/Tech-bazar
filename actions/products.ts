"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";

const productFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().optional(),
  inStock: z.boolean().optional(),
  sortBy: z.enum(["newest", "price_asc", "price_desc", "best_selling", "trending", "rating"]).optional(),
  page: z.number().default(1),
  limit: z.number().default(12),
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;

export async function getProducts(filters: ProductFilters = { page: 1, limit: 12 }) {
  const parsed = productFiltersSchema.parse(filters);
  const { query, category, brand, minPrice, maxPrice, minRating, inStock, sortBy, page, limit } = parsed;

  const where = {
    isActive: true,
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
        { brand: { contains: query, mode: "insensitive" as const } },
        { tags: { hasSome: [query] } },
      ],
    }),
    ...(category && { category: { slug: category } }),
    ...(brand && { brand: { equals: brand, mode: "insensitive" as const } }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? { price: { ...(minPrice !== undefined && { gte: minPrice }), ...(maxPrice !== undefined && { lte: maxPrice }) } }
      : {}),
    ...(minRating !== undefined && { rating: { gte: minRating } }),
    ...(inStock && { inventory: { quantity: { gt: 0 } } }),
  };

  const orderBy = (() => {
    switch (sortBy) {
      case "price_asc": return { price: "asc" as const };
      case "price_desc": return { price: "desc" as const };
      case "best_selling": return { soldCount: "desc" as const };
      case "trending": return { viewCount: "desc" as const };
      case "rating": return { rating: "desc" as const };
      default: return { createdAt: "desc" as const };
    }
  })();

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        inventory: { select: { quantity: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit), page };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
      inventory: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (product) {
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return product;
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true, slug: true } },
      inventory: { select: { quantity: true } },
    },
    orderBy: { soldCount: "desc" },
    take: 8,
  });
}

export async function getTrendingProducts() {
  return prisma.product.findMany({
    where: { isTrending: true, isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true, slug: true } },
      inventory: { select: { quantity: true } },
    },
    orderBy: { viewCount: "desc" },
    take: 8,
  });
}

export async function getNewArrivals() {
  return prisma.product.findMany({
    where: { isNewArrival: true, isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true, slug: true } },
      inventory: { select: { quantity: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
      isActive: true,
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true, slug: true } },
      inventory: { select: { quantity: true } },
    },
    take: 6,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
}

export async function searchProducts(query: string) {
  if (!query.trim()) return [];
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    take: 8,
  });
}

export async function getBrands() {
  const products = await prisma.product.findMany({
    where: { isActive: true, brand: { not: null } },
    select: { brand: true },
    distinct: ["brand"],
  });
  return products.map((p) => p.brand).filter(Boolean) as string[];
}
