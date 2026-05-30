"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Gamepad2, Briefcase, Compass, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const SETUPS = [
  {
    id: "workstation",
    name: "Minimal Workstation",
    icon: Monitor,
    img: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format",
    tagline: "Focused Productivity",
    desc: "A clean developer setup engineered to minimize friction. Clear, structured spacing with magnetic power grids.",
    featuredItems: [
      { name: "MagSafe 3-in-1 Charging Stand", price: 7499, slug: "magsafe-3-in-1-charging-stand-midnight" },
      { name: "Peak Design Everyday Case", price: 5999, slug: "peak-design-everyday-case-magsafe" }
    ]
  },
  {
    id: "gaming",
    name: "Battle Station",
    icon: Gamepad2,
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format",
    tagline: "Immersive Performance",
    desc: "Dominate every lobby. Active device cooling and low-latency mechanical triggers calibrated for split-second wins.",
    featuredItems: [
      { name: "Razer Kishi V2 Pro Controller", price: 12999, slug: "razer-kishi-v2-pro-android" },
      { name: "Phone Cooling Semiconductor Fan", price: 2499, slug: "phone-cooling-fan-semiconductor" }
    ]
  },
  {
    id: "desk",
    name: "Creative Desk",
    icon: Briefcase,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format",
    tagline: "Sound and Vision",
    desc: "A warm, analog-meets-digital sanctuary. High-fidelity acoustic earbuds and protective armor tailored for creators.",
    featuredItems: [
      { name: "Nothing Ear (2) TWS Earbuds", price: 8999, slug: "nothing-ear-2-true-wireless-earbuds" },
      { name: "GaN 120W Triple Port Charger", price: 3499, slug: "gan-120w-triple-port-charger" }
    ]
  },
  {
    id: "travel",
    name: "Nomad Carry",
    icon: Compass,
    img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format",
    tagline: "Endless Utility",
    desc: "Power that wanders with you. Multi-device powerhouses and reinforced braided cables ready for global transit.",
    featuredItems: [
      { name: "Anker 733 Power Bank 65W", price: 4499, slug: "anker-733-power-bank-65w-10000mah" },
      { name: "Anker 240W USB-C Cable", price: 1499, slug: "anker-240w-usbc-cable-1m" }
    ]
  }
];

export default function LifestyleShowcase() {
  const [activeSetup, setActiveSetup] = useState("workstation");

  const current = SETUPS.find((s) => s.id === activeSetup) ?? SETUPS[0];
  const IconComponent = current.icon;

  return (
    <section className="py-32 relative bg-dark-base border-t border-white/5 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-sm font-semibold tracking-widest text-cyan-400 uppercase block mb-4">
              Visual Environments
            </span>
            <h2 className="text-4xl sm:text-6xl font-display font-black text-white leading-none uppercase tracking-tight">
              Lifestyle Showcase
            </h2>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 bg-white/5 rounded-[20px] p-1.5 border border-white/5">
            {SETUPS.map((setup) => {
              const TabIcon = setup.icon;
              const isActive = setup.id === activeSetup;
              return (
                <button
                  key={setup.id}
                  onClick={() => setActiveSetup(setup.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-white/10 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)] border border-white/5" : "text-gray-400 hover:text-white"}`}
                  id={`lifestyle-tab-${setup.id}`}
                >
                  <TabIcon className="w-4 h-4" />
                  {setup.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Big Setup Photo */}
          <div className="lg:col-span-7 rounded-[40px] overflow-hidden border border-white/5 relative h-96 lg:h-[500px]">
            <img
              src={current.img}
              alt={current.name}
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
            {/* Overlay description */}
            <div className="absolute bottom-8 left-8 right-8">
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Featured Space
              </span>
              <h3 className="text-3xl font-display font-black text-white mt-1 uppercase tracking-tight">
                {current.name}
              </h3>
            </div>
          </div>

          {/* Right Column: Interactive Details */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            
            {/* Description box */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-cyan-400">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{current.tagline}</h4>
                  <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Environmental Profile</p>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                {current.desc}
              </p>
            </div>

            {/* Featured Hardware Items */}
            <div className="mt-12 space-y-4">
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
                Featured Hardware
              </h5>

              <div className="space-y-3">
                {current.featuredItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all group"
                  >
                    <div>
                      <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors text-sm sm:text-base">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-500 block mt-0.5">₹{item.price.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:border-white/30 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
