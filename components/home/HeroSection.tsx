"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Shield, Truck, Star, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const HERO_WORDS = ["Experience", "Lifestyle", "Performance", "Future"];

export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % HERO_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-base">
      {/* Neural Grid Background */}
      <div className="absolute inset-0 neural-grid opacity-40" />

      {/* Static Premium Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none bg-gradient-radial from-blue-500/40 to-transparent" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none bg-gradient-radial from-violet-500/40 to-transparent" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full opacity-8 blur-2xl pointer-events-none bg-gradient-radial from-cyan-500/30 to-transparent" />

      {/* 3D Canvas */}
      <HeroScene />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass rounded-full border border-blue-500/20 text-sm"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-300">50,000+ happy customers across India</span>
          <Zap className="w-3.5 h-3.5 text-blue-400" />
        </motion.div>

        {/* Main Heading */}
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight leading-none"
          >
            <span className="text-white block mb-2">Upgrade Your</span>
            <span className="text-white block mb-2">Mobile</span>
            <span className="block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -40, rotateX: 90 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="gradient-text inline-block"
                >
                  {HERO_WORDS[currentWord]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          India&apos;s most premium mobile accessories store. Curated for those who demand
          the best — from MagSafe to gaming, earbuds to smartwatches.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/products"
            id="hero-shop-btn"
            className="group btn-premium-primary px-8 py-4 text-lg gap-2 cursor-pointer"
          >
            Shop Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products?featured=true"
            id="hero-featured-btn"
            className="btn-premium-secondary px-8 py-4 text-lg cursor-pointer"
          >
            View Featured
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
        >
          {[
            { icon: Shield, text: "2 Year Warranty" },
            { icon: Truck, text: "Free Delivery ₹499+" },
            { icon: Star, text: "4.9★ Rating" },
            { icon: Zap, text: "Same Day Dispatch" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-blue-400" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs">Scroll to explore</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
