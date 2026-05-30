"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const STORY_STEPS = [
  {
    num: "01",
    title: "Structural GaN III Engineering",
    tag: "Energy Transformed",
    desc: "We replaced legacy silicon with high-frequency Gallium Nitride. The result is charging hubs that are 60% smaller, run 20°C cooler, and deliver split-second 120W power splits between multiple premium devices.",
    stat: "60% Smaller",
    color: "#00F2FF",
    glow: "rgba(0, 242, 255, 0.15)"
  },
  {
    num: "02",
    title: "Recycled Aerospace Alloys",
    tag: "Physical Sustainability",
    desc: "Our materials are sourced from Grade 5 aerospace-grade titanium and 100% recycled aluminum shells. Every bumper, frame, and buckle undergoes structural CNC anodization for lightweight durability.",
    stat: "Grade 5 Titanium",
    color: "#7C3AED",
    glow: "rgba(124, 58, 237, 0.15)"
  },
  {
    num: "03",
    title: "Acoustic Translucency",
    tag: "Visible Performance",
    desc: "Drawing inspiration from Nothing's visual honesty, our audio casings showcase custom 11.6mm diaphragm drivers, gold-plated wiring runs, and dual-chamber noise isolating physics in clear sight.",
    stat: "11.6mm Drivers",
    color: "#FF007A",
    glow: "rgba(255, 0, 122, 0.15)"
  },
  {
    num: "04",
    title: "Qi2 Resonance Docking",
    tag: "Inductive Precision",
    desc: "Our MagSafe compatible induction rings feature 18 N52 neodymium magnets, providing perfectly aligned charging with zero thermal dissipation. Safe, lightning fast, and structurally secure.",
    stat: "18 N52 Magnets",
    color: "#0052FF",
    glow: "rgba(0, 82, 255, 0.15)"
  }
];

export default function WhyUsTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="relative py-32 bg-dark-base overflow-hidden border-t border-white/5">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 linear-grid opacity-10 pointer-events-none" />
      <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-violet-600/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-cyan-600/3 blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <span className="text-sm font-semibold tracking-widest text-violet-400 uppercase block mb-4">
            Our Purpose
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black text-white leading-none uppercase tracking-tight">
            Why We Exist: <br />
            <span className="gradient-text font-black">Engineering the Future</span>
          </h2>
          <p className="text-gray-400 text-lg mt-6 max-w-xl">
            We reject the disposable accessory mindset. Tech-Baazar exists to craft high-end hardware interfaces that bridge style, structural science, and seamless digital interaction.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 -translate-x-[1px]">
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="w-full h-full bg-gradient-to-b from-blue-500 via-violet-500 to-pink-500 origin-top"
            />
          </div>

          {/* Steps */}
          <div className="space-y-24 md:space-y-36">
            {STORY_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.num} className="relative flex flex-col md:flex-row items-start md:justify-between group">
                  
                  {/* Timeline indicator node */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full glass border-2 -translate-x-[11px] top-1 z-20 flex items-center justify-center transition-colors group-hover:bg-white/10" style={{ borderColor: step.color }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: step.color }} />
                  </div>

                  {/* Left Column (Content or Empty/Offset) */}
                  <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? "md:text-right" : "md:order-last"}`}>
                    <span className="text-xs uppercase font-mono tracking-widest font-bold" style={{ color: step.color }}>
                      {step.tag}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-white mt-1 mb-4 tracking-tight leading-none uppercase">
                      {step.num} / {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg md:ml-auto md:mr-0">
                      {step.desc}
                    </p>
                  </div>

                  {/* Right Column (Visual Telemetry Card) */}
                  <div className={`w-full md:w-[45%] pl-12 md:pl-0 mt-6 md:mt-0 ${isEven ? "md:order-last" : ""}`}>
                    <div
                      className="glass rounded-3xl border border-white/5 p-6 hover:border-white/15 transition-all duration-300 relative overflow-hidden group/card"
                      style={{
                        boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
                      }}
                    >
                      {/* Accent back-glow */}
                      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover/card:opacity-20 transition-opacity" style={{ backgroundColor: step.color }} />
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                          Material Telemetry System
                        </span>
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                      </div>

                      <div className="text-3xl font-display font-black text-white tracking-tight">
                        {step.stat}
                      </div>

                      <div className="mt-4 text-xs font-mono text-gray-500 flex justify-between">
                        <span>SYS_RESONANCE: ACTIVE</span>
                        <span>ERR_RATE: 0.00%</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
