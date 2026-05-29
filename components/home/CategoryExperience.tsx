"use client";

import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

const categories = [
  { id: "cases", title: "Phone Cases", desc: "Armor for your device.", icon: "📱", bg: "linear-gradient(135deg,#0ea5e9, #7c3aed)" },
  { id: "chargers", title: "Chargers", desc: "Power without limits.", icon: "⚡", bg: "linear-gradient(135deg,#06b6d4,#0052ff)" },
  { id: "earbuds", title: "Earbuds", desc: "Sound engineered.", icon: "🎧", bg: "linear-gradient(135deg,#7c3aed,#ff6bcb)" },
  { id: "gaming", title: "Gaming", desc: "Play to win.", icon: "🎮", bg: "linear-gradient(135deg,#ff6a88,#ffb86b)" },
  { id: "wearables", title: "Smart Wearables", desc: "Wear the future.", icon: "⌚", bg: "linear-gradient(135deg,#00f2ff,#7c3aed)" },
  { id: "power", title: "Power Banks", desc: "Lasts longer.", icon: "🔋", bg: "linear-gradient(135deg,#ffd86b,#ff6b6b)" },
];

export default function CategoryExperience() {
  return (
    <section className="py-20">
      <div className="container px-4 sm:px-6 lg:px-8"> 
        <div className="mb-8 text-center">
          <p className="text-sm text-blue-400 font-semibold uppercase tracking-widest">Departments</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">Enter the TECH-BAAZAR Pavilion</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl border border-white/6 glass p-6 h-40 flex items-center"
              style={{ background: `${c.bg}` }}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-white/8 flex items-center justify-center text-2xl shadow-glow">
                  <span>{c.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-display font-semibold text-lg">{c.title}</h3>
                  <p className="text-gray-200 text-sm mt-1">{c.desc}</p>
                </div>
                <div className="flex-shrink-0 w-28 sm:w-auto">
                  <MagneticButton href={`/products?category=${c.id}`} className="btn-premium-secondary px-4 py-2 text-sm w-full sm:w-auto" data-cursor="interactive">
                    Explore
                  </MagneticButton>
                </div>
              </div>
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ background: c.bg }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
