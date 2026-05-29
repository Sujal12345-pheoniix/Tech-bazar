"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { formatPrice, calculateShipping, SHIPPING_THRESHOLD } from "@/lib/utils";
import { useState } from "react";
import { validateCoupon } from "@/actions/order";
import { toast } from "sonner";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getItemCount, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const discount = couponDiscount;
  const total = subtotal + shipping - discount;
  const itemCount = getItemCount();

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const result = await validateCoupon(couponInput, subtotal);
      if (result.error) {
        toast.error(result.error);
      } else {
        applyCoupon(couponInput, result.discount ?? 0);
        toast.success(result.message);
        setCouponInput("");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
          >
            <div className="flex-1 flex flex-col h-full glass border-l border-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-blue-400" />
                  <h2 className="font-display font-semibold text-lg text-white">
                    Cart <span className="text-gray-400 font-normal text-base">({itemCount})</span>
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  id="cart-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-blue-400/50" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Your cart is empty</p>
                      <p className="text-gray-400 text-sm">Add some amazing products!</p>
                    </div>
                    <Link
                      href="/products"
                      onClick={closeCart}
                      className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-colors"
                      id="cart-shop-btn"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.variantId}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 bg-white/3 rounded-2xl border border-white/5"
                      >
                        <Link href={`/products/${item.slug}`} onClick={closeCart}>
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover bg-white/5"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.slug}`} onClick={closeCart}>
                            <p className="text-sm font-medium text-white line-clamp-2 hover:text-blue-400 transition-colors">
                              {item.name}
                            </p>
                          </Link>
                          {item.variantName && (
                            <p className="text-xs text-gray-500 mt-0.5">{item.variantName}</p>
                          )}
                          <p className="text-blue-400 font-semibold text-sm mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, Math.min(item.quantity + 1, item.stock), item.variantId)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="p-1.5 rounded-full hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-white/5 px-6 py-4 space-y-4">
                  {/* Coupon */}
                  {!couponCode ? (
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                        <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                          id="cart-coupon-input"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                        id="cart-apply-coupon-btn"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Tag className="w-4 h-4" />
                        <span>{couponCode} applied!</span>
                      </div>
                      <button onClick={removeCoupon} className="text-gray-400 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Price Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount</span>
                        <span>−{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-green-400" : ""}>
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-gray-500">
                        Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free shipping
                      </p>
                    )}
                    <div className="flex justify-between font-semibold text-white text-base pt-2 border-t border-white/5">
                      <span>Total</span>
                      <span className="gradient-text">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-semibold rounded-2xl transition-all shadow-glow-sm hover:shadow-glow-md"
                    id="cart-checkout-btn"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
                    id="cart-continue-btn"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
