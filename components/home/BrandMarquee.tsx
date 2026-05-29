"use client";

import { motion } from "framer-motion";

const BRANDS = [
  { name: "Apple", logo: "🍎" },
  { name: "Samsung", logo: "📱" },
  { name: "OnePlus", logo: "⊕" },
  { name: "Nothing", logo: "⊙" },
  { name: "Xiaomi", logo: "Mi" },
  { name: "Realme", logo: "Re" },
  { name: "Anker", logo: "⚡" },
  { name: "UGREEN", logo: "🟢" },
  { name: "Baseus", logo: "◉" },
  { name: "Google", logo: "G" },
  { name: "Sony", logo: "🎵" },
  { name: "JBL", logo: "🔊" },
];

// Duplicate for seamless loop
const BRANDS_DOUBLED = [...BRANDS, ...BRANDS];

export function BrandMarquee() {
  return (
    <section className="py-16 overflow-hidden border-t border-b border-white/5">
      <div className="mb-8 text-center">
        <p className="text-gray-500 text-sm uppercase tracking-widest">Compatible with top brands</p>
      </div>

      {/* Row 1 - left */}
      <div className="relative">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {BRANDS_DOUBLED.map((brand, i) => (
            <div
              key={`row1-${i}`}
              className="flex items-center gap-3 px-6 py-3 glass rounded-xl border border-white/5 hover:border-white/15 transition-colors cursor-default flex-shrink-0"
            >
              <span className="text-xl">{brand.logo}</span>
              <span className="text-gray-300 font-semibold text-sm">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - right (reversed) */}
      <div className="relative mt-4">
        <div className="flex gap-8 animate-marquee whitespace-nowrap" style={{ animationDirection: "reverse", animationDuration: "25s" }}>
          {[...BRANDS_DOUBLED].reverse().map((brand, i) => (
            <div
              key={`row2-${i}`}
              className="flex items-center gap-3 px-6 py-3 glass rounded-xl border border-white/5 hover:border-white/15 transition-colors cursor-default flex-shrink-0"
            >
              <span className="text-xl">{brand.logo}</span>
              <span className="text-gray-300 font-semibold text-sm">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
