"use client";

import { useState, useTransition } from "react";
import { useCartStore } from "@/store/cartStore";
import { createCheckoutSession } from "@/actions/order";
import { formatPrice, calculateShipping, calculateTax } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { Shield, Lock, ArrowRight, Tag, Truck, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, getSubtotal, couponCode, couponDiscount, clearCart } = useCartStore();
  const [isPending, startTransition] = useTransition();

  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const total = subtotal + shipping + tax - couponDiscount;

  const handleCheckout = () => {
    if (items.length === 0) return;
    startTransition(async () => {
      try {
        const result = await createCheckoutSession({
          items: items.map((i) => ({
            productId: i.productId, name: i.name, image: i.image,
            price: i.price, quantity: i.quantity, variantId: i.variantId,
          })),
          couponCode: couponCode || undefined,
        });

        if (result?.error) {
          toast.error(result.error);
          return;
        }
        if (result?.url) {
          window.location.href = result.url;
        }
      } catch {
        toast.error("Failed to create checkout session. Please try again.");
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
          <Link href="/products" className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors" id="checkout-shop-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass rounded-2xl border border-white/8 p-6">
              <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                Order Summary ({items.length} item{items.length > 1 ? "s" : ""})
              </h2>
              <div className="space-y-4 divide-y divide-white/5">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 pt-4 first:pt-0">
                    <img src={item.image || "/placeholder.jpg"} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-white/5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white line-clamp-2">{item.name}</p>
                      {item.variantName && <p className="text-xs text-gray-500 mt-0.5">{item.variantName}</p>}
                      <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-white flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="glass rounded-2xl border border-white/8 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Secure Payment</p>
                  <p className="text-sm text-gray-400">Powered by Stripe — your info is encrypted</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                You&apos;ll be redirected to Stripe&apos;s secure checkout to complete your payment.
                We accept all major credit/debit cards and UPI. Your card details are never stored on our servers.
              </p>

              {/* Trust badges */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                {["Visa", "Mastercard", "UPI", "RuPay"].map((method) => (
                  <span key={method} className="px-2.5 py-1 bg-white/5 rounded-md text-xs text-gray-400 border border-white/8">{method}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl border border-white/8 p-6 lg:sticky lg:top-24">
              <h2 className="font-display font-semibold text-white mb-5">Price Details</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>GST (18%)</span>
                  <span className="text-white">{formatPrice(tax)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Coupon ({couponCode})</span>
                    <span>−{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg text-white pt-3 border-t border-white/5">
                  <span>Total</span>
                  <span className="gradient-text">{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-blue-400 mt-3">
                  Add {formatPrice(499 - subtotal)} more for FREE delivery!
                </p>
              )}

              <motion.button
                onClick={handleCheckout}
                disabled={isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-all shadow-glow-sm hover:shadow-glow-md text-lg"
                id="checkout-pay-btn"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Redirecting to Stripe...
                  </div>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Pay {formatPrice(total)}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By completing your purchase you agree to our{" "}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
