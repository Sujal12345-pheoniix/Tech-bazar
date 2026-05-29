"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Zap, Headphones, ShieldAlert, Cpu, Heart, Activity } from "lucide-react";
import React from "react";

const CATEGORIES = [
  {
    name: "Phone Cases",
    slug: "phone-cases",
    description: "Military-grade protection meets liquid glass design.",
    gradient: "from-blue-600/20 to-cyan-500/10",
    glow: "rgba(59, 130, 246, 0.4)",
    icon: <Smartphone className="w-10 h-10 text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />,
    count: "200+ Cases",
    gridClass: "md:col-span-2 md:row-span-1",
    visual: (
      <div className="absolute right-6 bottom-0 w-44 h-28 bg-gradient-to-t from-blue-500/20 to-transparent rounded-t-2xl border-t border-x border-blue-500/30 overflow-hidden flex items-end justify-center pointer-events-none">
        <div className="w-28 h-20 bg-dark-200 rounded-t-xl border-t border-x border-blue-400/40 p-2 flex flex-col gap-1.5">
          <div className="w-full h-1.5 bg-blue-500/20 rounded-full" />
          <div className="w-4/5 h-1.5 bg-blue-500/10 rounded-full" />
        </div>
      </div>
    )
  },
  {
    name: "Chargers",
    slug: "chargers",
    description: "Next-gen GaN speed.",
    gradient: "from-amber-600/20 to-orange-500/10",
    glow: "rgba(245, 158, 11, 0.4)",
    icon: <Zap className="w-10 h-10 text-amber-400 group-hover:scale-120 group-hover:translate-y-[-2px] transition-transform duration-300" />,
    count: "80+ chargers",
    gridClass: "md:col-span-1",
    visual: null
  },
  {
    name: "Earbuds",
    slug: "audio",
    description: "Studio acoustics in a pocket form factor.",
    gradient: "from-violet-600/20 to-purple-500/10",
    glow: "rgba(139, 92, 246, 0.4)",
    icon: <Headphones className="w-10 h-10 text-violet-400 group-hover:scale-110 transition-transform duration-300" />,
    count: "120+ Audios",
    gridClass: "md:col-span-1",
    visual: null
  },
  {
    name: "Gaming Gear",
    slug: "gaming",
    description: "Pro mobile controllers & triggers.",
    gradient: "from-red-600/20 to-rose-500/10",
    glow: "rgba(239, 68, 68, 0.4)",
    icon: <Cpu className="w-10 h-10 text-red-400 group-hover:rotate-12 transition-transform duration-300" />,
    count: "90+ items",
    gridClass: "md:col-span-1",
    visual: null
  },
  {
    name: "Wearables",
    slug: "smartwatches",
    description: "Futuristic smartwatches engineered for biometrics, sync, and notifications.",
    gradient: "from-pink-600/20 to-rose-500/10",
    glow: "rgba(236, 72, 153, 0.4)",
    icon: <Activity className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform duration-300" />,
    count: "40+ Watches",
    gridClass: "md:col-span-2",
    visual: (
      <div className="absolute right-8 bottom-0 w-32 h-24 bg-gradient-to-t from-pink-500/25 to-transparent rounded-t-full border-t border-pink-500/30 overflow-hidden flex items-end justify-center pointer-events-none">
        <div className="w-16 h-16 bg-dark-100 rounded-full border border-pink-400/40 flex items-center justify-center">
          <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
        </div>
      </div>
    )
  },
  {
    name: "Power Banks",
    slug: "power-banks",
    description: "MagSafe juice packs.",
    gradient: "from-emerald-600/20 to-teal-500/10",
    glow: "rgba(16, 185, 129, 0.4)",
    icon: <ShieldAlert className="w-10 h-10 text-emerald-400 group-hover:rotate-[-6deg] transition-transform duration-300" />,
    count: "60+ batteries",
    gridClass: "md:col-span-1",
    visual: null
  }
];

export function CategorySection() {
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className="py-32 relative bg-dark-base border-y border-white/5 overflow-hidden">
      {/* Visual background rings */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-3xl" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Showroom Departments
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-display font-black text-white mb-4 uppercase"
          >
            Shop by <span className="gradient-text font-black">Category</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Step into our specialized tech zones. Each department is curated with the highest-grade premium gear.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className={cat.gridClass}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                id={`category-${cat.slug}`}
                className="group relative block rounded-3xl overflow-hidden glass border border-white/8 hover:border-white/20 transition-all duration-500 hover:scale-[1.01] cursor-spotlight-card border-glow-premium p-8 h-full min-h-[220px] flex flex-col justify-between"
                onMouseMove={handleMouseMove}
                style={{
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px ${cat.glow}, 0 0 0 1px rgba(255,255,255,0.05)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Background color glow matching layout */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                {/* Animated graphic visual for large cards */}
                {cat.visual}

                {/* Card Top */}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300 mb-6">
                    {cat.icon}
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="relative z-10 mt-4">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1.5 block">
                    {cat.count}
                  </span>
                  <h3 className="font-display font-black text-white text-2xl group-hover:text-blue-300 transition-colors uppercase flex items-center gap-2">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-sm max-w-sm mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 group-hover:text-white transition-colors mt-6 pt-4 border-t border-white/5">
                    Enter Showroom <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
