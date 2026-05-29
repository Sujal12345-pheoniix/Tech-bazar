"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.number().min(0),
  comparePrice: z.number().optional(),
  brand: z.string().optional(),
  categoryId: z.string(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  specifications: z.record(z.string(), z.string()).optional(),
  images: z.array(z.object({ url: z.string(), altText: z.string().optional(), isPrimary: z.boolean().default(false) })).optional(),
  stock: z.number().default(0),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createProduct(data: z.infer<typeof productSchema>) {
  await requireAdmin();
  const parsed = productSchema.parse(data);
  const slug = slugify(parsed.name);

  const { images, stock, ...rawFields } = parsed;

  const product = await prisma.product.create({
    data: {
      ...rawFields,
      slug,
      tags: rawFields.tags ?? [],
      images: images
        ? { create: images.map((img, i) => ({ ...img, sortOrder: i })) }
        : undefined,
      inventory: { create: { quantity: stock } },
    },
    include: { images: true, inventory: true },
  });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true, product };
}

export async function updateProduct(id: string, data: Partial<z.infer<typeof productSchema>>) {
  await requireAdmin();

  const { images, stock, ...rawFields } = data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...rawFields,
      ...(rawFields.name && { slug: slugify(rawFields.name) }),
      ...(stock !== undefined && {
        inventory: { upsert: { create: { quantity: stock }, update: { quantity: stock } } },
      }),
      ...(images && {
        images: {
          deleteMany: {},
          create: images.map((img, i) => ({ ...img, sortOrder: i })),
        },
      }),
    },
  });

  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/admin/products");
  return { success: true, product };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function getAdminStats() {
  await requireAdmin();

  const [totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders, topProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { soldCount: "desc" },
      take: 5,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalUsers,
    totalProducts,
    recentOrders,
    topProducts,
  };
}

export async function getAdminProducts(page = 1, limit = 20) {
  await requireAdmin();
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true } },
        inventory: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count(),
  ]);
  return { products, total, pages: Math.ceil(total / limit) };
}

export async function getAdminOrders(page = 1, limit = 20) {
  await requireAdmin();
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count(),
  ]);
  return { orders, total, pages: Math.ceil(total / limit) };
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as never },
    include: { user: true },
  });

  // Notify user
  await prisma.notification.create({
    data: {
      userId: order.userId,
      type: status === "SHIPPED" ? "ORDER_SHIPPED" : status === "DELIVERED" ? "ORDER_DELIVERED" : "ORDER_PLACED",
      title: `Order ${status.charAt(0) + status.slice(1).toLowerCase()}`,
      message: `Your order #${order.orderNumber} has been ${status.toLowerCase()}.`,
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function createCoupon(data: {
  code: string;
  description?: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  expiresAt?: Date;
}) {
  await requireAdmin();
  const coupon = await prisma.coupon.create({ data });
  revalidatePath("/admin/coupons");
  return { success: true, coupon };
}

export async function getAdminUsers(page = 1, limit = 20) {
  await requireAdmin();
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);
  return { users, total, pages: Math.ceil(total / limit) };
}

export async function getRevenueChartData() {
  await requireAdmin();
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return { year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleDateString("en-IN", { month: "short" }) };
  });

  const orderData = await prisma.order.groupBy({
    by: ["createdAt"],
    _sum: { total: true },
    _count: true,
    where: {
      createdAt: { gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
  });

  return last12Months.map(({ year, month, label }) => {
    const monthOrders = orderData.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
    return {
      month: label,
      revenue: monthOrders.reduce((sum, o) => sum + (o._sum.total ?? 0), 0),
      orders: monthOrders.reduce((sum, o) => sum + o._count, 0),
    };
  });
}
