"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Download } from "lucide-react";
import confetti from "canvas-confetti";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((s) => s.clearCart);
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current) {
      clearCart();
      cleared.current = true;
    }

    // Confetti celebration
    const timer = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#0052FF", "#7C3AED", "#06B6D4", "#fff"],
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
          <div className="relative w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-4xl font-display font-black text-white mb-3">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-400 mb-2 text-lg">
            Thank you for shopping with MobileHub
          </p>
          <p className="text-gray-500 text-sm mb-8">
            We&apos;ll send you a confirmation email shortly with tracking details.
          </p>

          {/* Steps */}
          <div className="glass rounded-2xl border border-white/8 p-6 mb-8 text-left">
            <h3 className="font-semibold text-white mb-4 text-sm">What happens next?</h3>
            {[
              { icon: "✅", title: "Order Confirmed", desc: "Your payment has been processed" },
              { icon: "📦", title: "Preparing Package", desc: "We're picking and packing your items" },
              { icon: "🚚", title: "Out for Delivery", desc: "Usually within 24-48 hours" },
              { icon: "🏠", title: "Delivered!", desc: "Enjoy your premium accessories" },
            ].map((step, i) => (
              <div key={step.title} className="flex gap-3 mb-3 last:mb-0">
                <span className="text-lg flex-shrink-0">{step.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="text-xs text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="flex-1 flex items-center justify-center gap-2 py-3 glass border border-white/10 hover:border-white/20 text-white rounded-xl transition-all"
              id="success-dashboard-btn"
            >
              <Package className="w-4 h-4" />
              Track Order
            </Link>
            <Link
              href="/products"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white rounded-xl transition-all"
              id="success-shop-btn"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
