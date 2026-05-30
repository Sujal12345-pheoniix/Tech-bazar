"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";
import { formatPrice, calculateShipping, SHIPPING_THRESHOLD } from "@/lib/utils";
import { useState } from "react";
import { validateCoupon } from "@/actions/order";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getItemCount, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const discount = couponDiscount;
  const total = subtotal + shipping - discount;
  const itemCount = getItemCount();

  const freeShippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);
  const neededForFreeShipping = SHIPPING_THRESHOLD - subtotal;

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
          >
            <div className="flex-1 flex flex-col h-full bg-[#09090D] border-l border-white/8 shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-blue-400" />
                  <h2 className="font-display font-black text-white text-lg uppercase tracking-wider">
                    Your Cart <span className="text-gray-500 font-mono text-sm ml-1">({itemCount})</span>
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 rounded-full glass hover:text-red-400 transition-colors cursor-pointer"
                  aria-label="Close cart"
                  id="cart-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              {items.length > 0 && (
                <div className="px-6 py-4.5 bg-white/[0.01] border-b border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Truck className="w-4 h-4 text-blue-400" />
                      <span>
                        {freeShippingProgress >= 100
                          ? "Qualified for Free Shipping!"
                          : `Add ${formatPrice(neededForFreeShipping)} more for Free Shipping`}
                      </span>
                    </div>
                    <span className="font-bold text-white">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShippingProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full transition-all",
                        freeShippingProgress >= 100
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                          : "bg-gradient-to-r from-blue-500 to-violet-500"
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 no-scrollbar">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg font-display uppercase tracking-wider">Empty Bag</p>
                      <p className="text-gray-400 text-sm mt-1">There are no hardware keys indexed in your session.</p>
                    </div>
                    <Link
                      href="/products"
                      onClick={closeCart}
                      className="mt-4 px-6 py-3 rounded-full btn-premium-primary text-xs font-bold"
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 p-4 glass rounded-3xl border border-white/5 items-center relative overflow-hidden group hover:border-white/10"
                      >
                        <Link href={`/products/${item.slug}`} onClick={closeCart} className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.slug}`} onClick={closeCart}>
                            <p className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                              {item.name}
                            </p>
                          </Link>
                          {item.variantName && (
                            <p className="text-[10px] font-mono text-gray-500 uppercase mt-0.5 tracking-wider">{item.variantName}</p>
                          )}
                          <p className="text-white font-bold text-sm mt-2">
                            {formatPrice(item.price * item.quantity)}
                          </p>

                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/8 rounded-xl px-2 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-5 text-center text-xs font-mono font-bold text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, Math.min(item.quantity + 1, item.stock), item.variantId)}
                                className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="p-1.5 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors ml-auto cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer Block */}
              {items.length > 0 && (
                <div className="border-t border-white/5 px-6 py-5 bg-white/[0.01] space-y-4">
                  {/* Coupon Validation Input */}
                  {!couponCode ? (
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-white/[0.02] border border-white/8 rounded-2xl px-3.5 py-2">
                        <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="PROMO_CODE"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          className="flex-1 bg-transparent text-xs font-mono text-white placeholder-gray-500 outline-none uppercase"
                          id="cart-coupon-input"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-300 hover:text-white text-xs font-semibold rounded-2xl transition-colors disabled:opacity-50 cursor-pointer"
                        id="cart-apply-coupon-btn"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 bg-green-500/10 border border-green-500/25 rounded-2xl text-xs font-mono text-green-400">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" />
                        <span>CODE: {couponCode} ACTIVE</span>
                      </div>
                      <button onClick={removeCoupon} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Price calculations details */}
                  <div className="space-y-2 text-xs font-mono text-gray-400">
                    <div className="flex justify-between">
                      <span>SUBTOTAL</span>
                      <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>DISCOUNT</span>
                        <span className="font-bold">−{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>SHIPPING</span>
                      <span className={shipping === 0 ? "text-green-400 font-bold" : "text-white font-bold"}>
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between font-semibold text-white text-sm pt-3 border-t border-white/5 font-display uppercase tracking-wider">
                      <span>TOTAL</span>
                      <span className="text-base font-black font-display">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Buy trigger redirects */}
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 w-full py-4 btn-premium-primary text-sm font-semibold cursor-pointer active:scale-98"
                    id="cart-checkout-btn"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={closeCart}
                    className="w-full text-center text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
                    id="cart-continue-btn"
                  >
                    Close Drawer
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
