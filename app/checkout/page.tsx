"use client";

import { useState, useTransition } from "react";
import { useCartStore } from "@/store/cartStore";
import { createCheckoutSession } from "@/actions/order";
import { formatPrice, calculateShipping, calculateTax } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { Shield, Lock, ArrowRight, ArrowLeft, Tag, Truck, ShoppingBag, MapPin, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "address", label: "Shipping Info" },
  { id: "review", label: "Review Order" },
  { id: "payment", label: "Secure Payment" }
];

export default function CheckoutPage() {
  const { items, getSubtotal, couponCode, couponDiscount } = useCartStore();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState<"address" | "review" | "payment">("address");

  // Shipping Address State
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const total = subtotal + shipping + tax - couponDiscount;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      toast.error("Please complete all shipping address fields.");
      return;
    }
    setActiveStep("review");
  };

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
      <div className="min-h-screen bg-[#08080C] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute inset-0 linear-grid opacity-10" />
        <div className="relative z-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">Checkout is Empty</h2>
            <p className="text-gray-400 text-sm mt-1">There are no hardware keys indexed in your checkout session.</p>
          </div>
          <Link
            href="/products"
            className="px-6 py-3 rounded-full btn-premium-primary text-xs font-bold inline-block"
            id="checkout-shop-btn"
          >
            Explore Hardware Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080C] py-20 relative overflow-hidden">
      <div className="noise-overlay" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest block mb-4">
            Security Protocol Check
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            Checkout Console
          </h1>
        </div>

        {/* Custom Progress Indicators */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-2 sm:gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-2">
            {STEPS.map((step, i) => {
              const isActive = step.id === activeStep;
              const isPassed =
                (activeStep === "review" && step.id === "address") ||
                (activeStep === "payment" && (step.id === "address" || step.id === "review"));
              
              return (
                <div key={step.id} className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all",
                      isActive
                        ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(0,82,255,0.25)] border border-blue-400"
                        : isPassed
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-white/5 text-gray-500 border border-white/5"
                    )}>
                      {i + 1}
                    </span>
                    <span className={cn(
                      "text-xs font-semibold uppercase tracking-wider hidden sm:inline",
                      isActive ? "text-white" : isPassed ? "text-emerald-400" : "text-gray-500"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-6 h-px bg-white/5 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Stepper Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Address */}
              {activeStep === "address" && (
                <motion.div
                  key="address-step"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="glass-premium rounded-[32px] border border-white/5 p-8 shadow-2xl space-y-6"
                >
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <h2 className="font-display font-black text-white text-lg uppercase tracking-wider">
                      Shipping Destination
                    </h2>
                  </div>

                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5">Recipient Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.01] border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5">Contact Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit number"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.01] border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5">Street Address</label>
                      <input
                        type="text"
                        required
                        placeholder="House, apartment, street layout"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="w-full px-4 py-3 bg-white/[0.01] border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5">City</label>
                        <input
                          type="text"
                          required
                          placeholder="City name"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.01] border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5">State</label>
                        <input
                          type="text"
                          required
                          placeholder="State"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.01] border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5">Pincode</label>
                        <input
                          type="text"
                          required
                          placeholder="6-digit code"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.01] border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 btn-premium-primary text-xs font-bold uppercase tracking-widest gap-2 flex items-center justify-center mt-6 cursor-pointer"
                    >
                      Save & Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Review Order */}
              {activeStep === "review" && (
                <motion.div
                  key="review-step"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="glass-premium rounded-[32px] border border-white/5 p-8 shadow-2xl space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-blue-400" />
                      <h2 className="font-display font-black text-white text-lg uppercase tracking-wider">
                        Review Hardware Keys
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveStep("address")}
                      className="text-xs font-mono font-bold text-gray-500 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Edit Shipping
                    </button>
                  </div>

                  {/* List of items */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 items-center p-3 glass rounded-2xl border border-white/5">
                        <img
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-white/5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          {item.variantName && <p className="text-[10px] font-mono text-gray-500 mt-0.5 uppercase tracking-wide">{item.variantName}</p>}
                          <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Destination summary box */}
                  <div className="p-5 glass rounded-2xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Selected Destination</p>
                    <p className="text-sm text-white font-semibold">{address.name} — {address.phone}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {address.street}, {address.city}, {address.state} — {address.pincode}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveStep("payment")}
                    className="w-full py-4 btn-premium-primary text-xs font-bold uppercase tracking-widest gap-2 flex items-center justify-center cursor-pointer"
                  >
                    Confirm & Proceed <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 3: Secure Payment Gateway */}
              {activeStep === "payment" && (
                <motion.div
                  key="payment-step"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="glass-premium rounded-[32px] border border-white/5 p-8 shadow-2xl space-y-6"
                >
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <Lock className="w-5 h-5 text-blue-400" />
                    <h2 className="font-display font-black text-white text-lg uppercase tracking-wider">
                      Secure Payment Node
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                      <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white text-sm">Stripe Cryptographic Protocol</p>
                        <p className="text-xs text-gray-400 mt-0.5">Your payment is fully encrypted and sandboxed by Stripe security standards.</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      Clicking the trigger below routes your checkout payload to Stripe. You will be redirected back to Tech-Baazar once confirmation checks are successful.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    {["Visa", "Mastercard", "UPI", "RuPay"].map((item) => (
                      <span key={item} className="px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-lg text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">{item}</span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveStep("review")}
                      className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-mono font-bold text-gray-300 hover:text-white uppercase tracking-widest border border-white/5 cursor-pointer"
                    >
                      Back
                    </button>
                    
                    <button
                      onClick={handleCheckout}
                      disabled={isPending}
                      className="flex-1 py-4 btn-premium-primary text-xs font-bold uppercase tracking-widest gap-2 flex items-center justify-center cursor-pointer active:scale-98"
                      id="checkout-pay-btn"
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Redirecting...
                        </div>
                      ) : (
                        <>Pay {formatPrice(total)} <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Pricing Summary Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="glass-premium rounded-[32px] border border-white/5 p-8 shadow-2xl space-y-6">
              <h3 className="font-display font-black text-white text-lg uppercase tracking-wider border-b border-white/5 pb-4">
                Price Registry
              </h3>

              <div className="space-y-3 text-xs font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>ITEMS TOTAL</span>
                  <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING LOGISTICS</span>
                  <span className={cn("font-bold", shipping === 0 ? "text-green-400" : "text-white")}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18% TAX)</span>
                  <span className="text-white font-bold">{formatPrice(tax)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>COUPON DISCOUNT</span>
                    <span className="font-bold">−{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-white text-base font-bold pt-4 border-t border-white/5 font-display uppercase tracking-wider">
                  <span>TOTAL COST</span>
                  <span className="text-lg font-black font-display">{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="flex items-center gap-2 bg-blue-500/5 border border-blue-500/15 rounded-xl px-3 py-2.5 text-[10px] font-mono text-blue-400">
                  <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Add {formatPrice(499 - subtotal)} more for FREE shipping</span>
                </div>
              )}

              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                By finalising purchase you validate your connection nodes to our standard{" "}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300 font-semibold underline">Terms of Service</Link>.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
