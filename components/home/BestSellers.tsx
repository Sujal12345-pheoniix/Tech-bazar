"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Info, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import Link from "next/link";

const BEST_SELLER = {
  id: "best-case",
  productId: "best-case-id",
  name: "Halo MagSafe Armor Case",
  category: "Phone Cases",
  price: 2499,
  slug: "iphone-15-pro-magsafe-case-midnight-black",
  image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format",
  hotspots: [
    {
      id: "camera",
      x: "32%",
      y: "22%",
      title: "Precision Camera Ring",
      desc: "1.5mm raised aerospace aluminum alloy bezel protecting your iPhone camera lenses from flat surface abrasion."
    },
    {
      id: "magsafe",
      x: "50%",
      y: "50%",
      title: "N52 Neodymium Ring",
      desc: "An array of 18 hyper-dense N52 magnets delivering 1.2kg of magnetic pull force for instant MagSafe accessories alignment."
    },
    {
      id: "corners",
      x: "72%",
      y: "85%",
      title: "Impact-Dampening Corners",
      desc: "MIL-STD-810G certified corner pockets containing structural air-cushions to deflect 98% of drop shocks."
    }
  ]
};

export default function BestSellers() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>("magsafe");
  const addItem = useCartStore((s) => s.addItem);

  const handleBuyNow = () => {
    addItem({
      id: BEST_SELLER.id,
      productId: BEST_SELLER.productId,
      name: BEST_SELLER.name,
      price: BEST_SELLER.price,
      image: BEST_SELLER.image,
      slug: BEST_SELLER.slug,
      stock: 50
    });
    toast.success(`${BEST_SELLER.name} added to cart!`);
  };

  const activeData = BEST_SELLER.hotspots.find((h) => h.id === activeHotspot);

  return (
    <section className="py-32 relative bg-dark-base border-t border-white/5 overflow-hidden">
      {/* Huge subtle typography in background */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none pointer-events-none text-center leading-none text-[15vw] font-black text-white/[0.01] uppercase font-display">
        Flagship
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Visual Highlight and Hotspots */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-4xl bg-gradient-to-b from-white/[0.02] to-transparent p-6 border border-white/5 flex items-center justify-center overflow-hidden">
              
              {/* Dynamic spotlight */}
              <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />
              
              <img
                src={BEST_SELLER.image}
                alt={BEST_SELLER.name}
                className="w-[85%] h-[85%] object-cover rounded-3xl drop-shadow-[0_40px_100px_rgba(0,0,0,0.75)] hover:scale-105 transition-transform duration-700"
              />

              {/* Hotspot buttons */}
              {BEST_SELLER.hotspots.map((hs) => (
                <button
                  key={hs.id}
                  onClick={() => setActiveHotspot(hs.id)}
                  className="absolute z-30 group flex items-center justify-center"
                  style={{ top: hs.y, left: hs.x }}
                  id={`hotspot-btn-${hs.id}`}
                >
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-blue-500/20 animate-ping opacity-75" />
                  <span className={`relative flex h-5 w-5 rounded-full items-center justify-center border text-[10px] font-bold transition-all ${activeHotspot === hs.id ? "bg-blue-500 text-white border-blue-400 scale-110" : "bg-black/80 text-gray-400 border-white/10 hover:text-white hover:border-white/30"}`}>
                    <Plus className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Apple-level narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div>
              <span className="text-sm font-semibold tracking-widest text-blue-400 uppercase block mb-4">
                Flagship Showcase
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-black text-white leading-none uppercase tracking-tight">
                {BEST_SELLER.name}
              </h2>
              <p className="text-gray-400 text-base mt-4 leading-relaxed">
                Meticulously designed for the iPhone 15 Pro. We refined every detail, from bumper thickness to laser-etched alignment markers, creating an armor case that does not hide your phone, but amplifies it.
              </p>
            </div>

            {/* Hotspot Specification Card */}
            <div className="h-52">
              <AnimatePresence mode="wait">
                {activeData && (
                  <motion.div
                    key={activeData.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass-premium p-6 rounded-3xl border border-white/10 relative overflow-hidden"
                  >
                    {/* Tiny neon dot */}
                    <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    
                    <h3 className="text-lg font-display font-bold text-white mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-400" />
                      {activeData.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {activeData.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price and Purchase actions */}
            <div className="flex items-center justify-between border-t border-white/5 pt-8">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-widest block">Investment</span>
                <span className="text-3xl font-display font-black text-white">₹{BEST_SELLER.price}</span>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/products/${BEST_SELLER.slug}`}
                  className="px-6 py-4 rounded-full btn-premium-secondary text-sm font-semibold flex items-center justify-center"
                >
                  View Details
                </Link>
                <button
                  onClick={handleBuyNow}
                  className="px-8 py-4 rounded-full btn-premium-primary text-sm font-semibold gap-2 flex items-center"
                  id="bestseller-buy-btn"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Quick Buy
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
