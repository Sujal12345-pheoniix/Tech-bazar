"use client";

import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { useState, useRef } from "react";

const products = [
  { id: "p1", name: "Aurora Wireless Earbuds", price: "₹4,999", color: "#7C3AED", img: "/showcase/earbuds.jpg" },
  { id: "p2", name: "Flux Fast Charger", price: "₹2,499", color: "#00C2FF", img: "/showcase/charger.jpg" },
  { id: "p3", name: "Halo Premium Case", price: "₹1,299", color: "#0052FF", img: "/showcase/case.jpg" },
];

function TiltCard({ product }: { product: (typeof products)[0] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) - rect.width / 2;
    const y = (e.clientY - rect.top) - rect.height / 2;
    const rx = (y / rect.height) * -6;
    const ry = (x / rect.width) * 8;
    ref.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    ref.current.style.transition = "transform 0.12s ease-out";
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "none";
    ref.current.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="tilt-card glass rounded-3xl p-6 w-64 sm:w-72 h-80 sm:h-96 flex flex-col justify-between border border-white/6 overflow-hidden"
      >
        <div className="relative h-48 sm:h-56 flex items-center justify-center">
          <div className="absolute inset-0 rounded-xl" style={{ background: `linear-gradient(135deg, ${product.color}10, transparent)` }} />
          <img src={product.img} alt={product.name} className="w-[70%] h-[70%] sm:w-[70%] sm:h-[70%] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]" />
        </div>
        <div>
          <h3 className="text-white font-display text-lg font-semibold">{product.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-gray-300 font-medium">{product.price}</span>
            <MagneticButton className="btn-premium-primary px-4 py-2 text-sm" aria-label={`Buy ${product.name}`}>
              Quick Buy
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Reflection / glow */}
      <div className="absolute -bottom-6 left-6 right-6 h-12 rounded-xl blur-3xl opacity-30" style={{ background: `linear-gradient(90deg, ${product.color}, transparent)` }} />
    </div>
  );
}

export default function Showcase() {
  return (
    <section className="py-20 relative">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm text-blue-400 font-semibold uppercase tracking-widest">Featured</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">Curated Picks — Crafted For You</h2>
        </div>

        <div className="flex items-start justify-center gap-8 sm:gap-6">
          {/* On small screens allow horizontal scrolling with touch snapping */}
          <div className="w-full flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-2 px-2 sm:px-0">
            {products.map((p) => (
              <div key={p.id} className="shrink-0 sm:shrink text-left">
                <TiltCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
