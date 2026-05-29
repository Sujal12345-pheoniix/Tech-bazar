"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { calculateShipping, calculateTax, generateOrderNumber } from "@/lib/utils";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      image: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
      variantId: z.string().optional(),
    })
  ),
  couponCode: z.string().optional(),
});

export async function createCheckoutSession(data: z.infer<typeof checkoutSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in to checkout" };

  const parsed = checkoutSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid checkout data" };

  const { items, couponCode } = parsed.data;

  // Validate coupon
  let discountAmount = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: couponCode,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        OR: [{ usageLimit: null }, { usedCount: { lt: prisma.coupon.fields.usageLimit } }],
      },
    });
    if (coupon) {
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
        discountAmount =
          coupon.type === "PERCENTAGE"
            ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount ?? Infinity)
            : coupon.value;
      }
    }
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        images: [item.image].filter(Boolean),
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    metadata: {
      userId: session.user.id,
      cartItems: JSON.stringify(items.slice(0, 10)), // Stripe metadata limit
      couponCode: couponCode ?? "",
    },
    customer_email: session.user.email ?? undefined,
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
    allow_promotion_codes: false,
    ...(discountAmount > 0 && {
      discounts: [{
        coupon: await stripe.coupons.create({
          amount_off: Math.round(discountAmount * 100),
          currency: "inr",
          name: couponCode,
        }).then((c) => c.id),
      }],
    }),
  });

  return { url: stripeSession.url };
}

export async function getUserOrders(userId?: string) {
  const session = await auth();
  const id = userId ?? session?.user?.id;
  if (!id) return [];

  return prisma.order.findMany({
    where: { userId: id },
    include: {
      items: {
        include: {
          product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        },
      },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.order.findFirst({
    where: { orderNumber, userId: session.user.id },
    include: {
      items: {
        include: {
          product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        },
      },
      address: true,
      user: { select: { name: true, email: true } },
    },
  });
}

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findFirst({
    where: {
      code: { equals: code, mode: "insensitive" },
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  if (!coupon) return { error: "Invalid or expired coupon code" };
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return { error: `Minimum order value of ₹${coupon.minOrderValue} required` };
  }

  const discount =
    coupon.type === "PERCENTAGE"
      ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount ?? Infinity)
      : Math.min(coupon.value, subtotal);

  return {
    success: true,
    discount: Math.round(discount),
    message: `${coupon.type === "PERCENTAGE" ? coupon.value + "%" : "₹" + coupon.value} off applied!`,
    couponId: coupon.id,
  };
}
