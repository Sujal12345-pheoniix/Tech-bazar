"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Users, ShoppingBag, ShieldCheck, Star, Truck, MessageSquare } from "lucide-react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  glow: string;
}

const STATS: StatItem[] = [
  {
    value: 50000,
    suffix: "+",
    label: "Customers",
    desc: "Digital lifestyle enthusiasts",
    icon: <Users className="w-5 h-5 text-blue-400" />,
    glow: "rgba(0, 82, 255, 0.15)"
  },
  {
    value: 100000,
    suffix: "+",
    label: "Orders Delivered",
    desc: "Premium accessories shipped",
    icon: <ShoppingBag className="w-5 h-5 text-violet-400" />,
    glow: "rgba(124, 58, 237, 0.15)"
  },
  {
    value: 4.9,
    suffix: " ★",
    label: "Star Rating",
    desc: "Verified reviews on hardware",
    icon: <Star className="w-5 h-5 text-amber-400 fill-current" />,
    glow: "rgba(245, 158, 11, 0.15)"
  }
];

function AnimatedCounter({ value, suffix, duration = 1800 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.2 }
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
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-dark-base border-t border-white/5">
      {/* Telemetry panel layout background */}
      <div className="absolute inset-0 linear-grid opacity-15" />
      <div className="absolute inset-0 panel-grid-lines opacity-10" />

      {/* Decorative neon light borders */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-20">
          <span className="text-xs uppercase font-mono tracking-widest text-blue-400 font-bold block mb-4">
            Network Operations Center
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-white leading-none uppercase tracking-tight">
            Customer Trust Telemetry
          </h2>
        </div>

        {/* Counter cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-premium border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-white/12 transition-all duration-300"
            >
              {/* Inner radar sweep glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 240px at 50% 50%, ${stat.glow}, transparent 80%)`,
                }}
              />

              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">
                  TELEMETRY_STAT: OK
                </span>
              </div>

              <div>
                <h3 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </h3>
                <h4 className="text-base font-semibold text-gray-300 mb-1 font-display uppercase tracking-wider">{stat.label}</h4>
                <p className="text-gray-400 text-xs">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra trust elements: shipping & support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {[
            {
              icon: <Truck className="w-6 h-6 text-cyan-400" />,
              title: "Same Day Dispatch",
              desc: "Orders finalized before 3:00 PM are instantly routed and handed to our logistics partners. Free delivery on orders exceeding ₹499.",
              tag: "LOGISTICS_SPEED: HIGH"
            },
            {
              icon: <MessageSquare className="w-6 h-6 text-violet-400" />,
              title: "Premium 24/7 Support",
              desc: "Reach our technical customer engineers anytime. Real human experts assisting you with specifications, billing, or claims.",
              tag: "SUPPORT_REPLY: INSTANT"
            }
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
              className="glass border border-white/5 rounded-3xl p-6 flex gap-4 items-start relative overflow-hidden group hover:border-white/10"
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center flex-shrink-0 text-white">
                {feat.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="text-lg font-bold text-white leading-none">{feat.title}</h4>
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-white/5 rounded text-gray-500">{feat.tag}</span>
                </div>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
