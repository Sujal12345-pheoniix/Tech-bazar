import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const cartItemsRaw = session.metadata?.cartItems;

    if (!userId || !cartItemsRaw) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const cartItems = JSON.parse(cartItemsRaw);

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber: generateOrderNumber(),
        status: "CONFIRMED",
        subtotal: (session.amount_subtotal ?? 0) / 100,
        tax: 0,
        shippingCost: 0,
        total: (session.amount_total ?? 0) / 100,
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string,
        items: {
          create: cartItems.map((item: { productId: string; name: string; image: string; price: number; quantity: number; variantId?: string }) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            variantId: item.variantId || undefined,
          })),
        },
      },
    });

    // Update sold count
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { soldCount: { increment: item.quantity } },
      });
    }

    // Send notification
    await prisma.notification.create({
      data: {
        userId,
        type: "ORDER_PLACED",
        title: "Order Confirmed! 🎉",
        message: `Your order #${order.orderNumber} has been confirmed. We're preparing it for you!`,
      },
    });
  }

  return NextResponse.json({ received: true });
}
