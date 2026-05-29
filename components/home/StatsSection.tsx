"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Award, Users, ShoppingBag, ShieldCheck } from "lucide-react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  glow: string;
}

const STATS: StatItem[] = [
  {
    value: 50,
    suffix: "K+",
    label: "Trusted Customers",
    description: "Digital lifestyle enthusiasts",
    icon: <Users className="w-5 h-5 text-blue-400" />,
    glow: "rgba(0, 82, 255, 0.15)"
  },
  {
    value: 100,
    suffix: "K+",
    label: "Products Sold",
    description: "Premium accessories shipped",
    icon: <ShoppingBag className="w-5 h-5 text-violet-400" />,
    glow: "rgba(124, 58, 237, 0.15)"
  },
  {
    value: 4.9,
    suffix: "★",
    label: "Average Rating",
    description: "Verified five-star reviews",
    icon: <Award className="w-5 h-5 text-amber-400" />,
    glow: "rgba(245, 158, 11, 0.15)"
  },
  {
    value: 99.8,
    suffix: "%",
    label: "Delivery Success",
    description: "Insured same-day dispatch",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    glow: "rgba(16, 185, 129, 0.15)"
  }
];

function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const isFloat = value % 1 !== 0;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [started, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value % 1 !== 0 ? count.toFixed(1) : count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-dark-base border-t border-white/5">
      {/* Background Grids */}
      <div className="absolute inset-0 linear-grid opacity-20" />
      
      {/* Dynamic light gradient boundaries */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="glass border border-white/8 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
              style={{
                boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
              }}
            >
              {/* Inner ambient glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 180px at 50% 50%, ${stat.glow}, transparent 80%)`,
                }}
              />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/25 transition-all duration-300">
                  {stat.icon}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover:text-blue-400 transition-colors">
                  Telemetry Active
                </span>
              </div>

              <div className="relative z-10">
                <div className="text-4xl sm:text-5xl font-display font-black text-white mb-1 tracking-tight">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <h3 className="font-semibold text-gray-200 text-base mb-1">{stat.label}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
