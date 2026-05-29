"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Phone Cases",
    slug: "phone-cases",
    description: "Premium protection for every device",
    gradient: "from-blue-600 to-blue-800",
    glow: "blue",
    icon: "📱",
    count: "200+ products",
  },
  {
    name: "Chargers",
    slug: "chargers",
    description: "Fast charge. Every time.",
    gradient: "from-yellow-500 to-orange-600",
    glow: "orange",
    icon: "⚡",
    count: "80+ products",
  },
  {
    name: "Audio",
    slug: "audio",
    description: "Immersive sound experience",
    gradient: "from-violet-600 to-purple-800",
    glow: "purple",
    icon: "🎧",
    count: "120+ products",
  },
  {
    name: "Power Banks",
    slug: "power-banks",
    description: "Never run out of power",
    gradient: "from-green-500 to-teal-600",
    glow: "green",
    icon: "🔋",
    count: "60+ products",
  },
  {
    name: "Smartwatches",
    slug: "smartwatches",
    description: "Your life on your wrist",
    gradient: "from-rose-500 to-pink-700",
    glow: "pink",
    icon: "⌚",
    count: "40+ products",
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Level up your mobile gaming",
    gradient: "from-red-500 to-rose-700",
    glow: "red",
    icon: "🎮",
    count: "90+ products",
  },
  {
    name: "Data Cables",
    slug: "cables",
    description: "Connect. Transfer. Charge.",
    gradient: "from-cyan-500 to-blue-600",
    glow: "cyan",
    icon: "🔌",
    count: "100+ products",
  },
  {
    name: "MagSafe",
    slug: "magsafe",
    description: "Magnetic perfection",
    gradient: "from-indigo-500 to-violet-700",
    glow: "indigo",
    icon: "🧲",
    count: "50+ products",
  },
];

const glowColors: Record<string, string> = {
  blue: "rgba(59, 130, 246, 0.3)",
  orange: "rgba(249, 115, 22, 0.3)",
  purple: "rgba(139, 92, 246, 0.3)",
  green: "rgba(34, 197, 94, 0.3)",
  pink: "rgba(236, 72, 153, 0.3)",
  red: "rgba(239, 68, 68, 0.3)",
  cyan: "rgba(6, 182, 212, 0.3)",
  indigo: "rgba(99, 102, 241, 0.3)",
};

export function CategorySection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Browse by Category
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-display font-bold text-white mb-4"
          >
            Shop by{" "}
            <span className="gradient-text">Category</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Explore our curated collection of premium mobile accessories
          </motion.p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                id={`category-${cat.slug}`}
                className="group relative block rounded-2xl overflow-hidden glass border border-white/8 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                style={{
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px ${glowColors[cat.glow]}, 0 0 0 1px rgba(255,255,255,0.1)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                <div className="relative p-5 sm:p-6">
                  {/* Icon */}
                  <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 block`}>
                    {cat.icon}
                  </div>

                  <h3 className="font-display font-bold text-white text-base sm:text-lg mb-1 group-hover:gradient-text transition-all">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 leading-snug">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{cat.count}</span>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
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
