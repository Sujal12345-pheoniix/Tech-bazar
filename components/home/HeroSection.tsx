"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, X, Shield, Truck, Star, ChevronDown, Zap } from "lucide-react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-base pt-20">
        {/* Neural Grid Background */}
        <div className="absolute inset-0 neural-grid opacity-30" />

        {/* Ambient Gradient Lighting */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none bg-gradient-radial from-blue-500/40 to-transparent" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none bg-gradient-radial from-violet-500/40 to-transparent" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full opacity-10 blur-2xl pointer-events-none bg-gradient-radial from-cyan-500/30 to-transparent" />

        {/* 3D Interactive Scene */}
        <HeroScene />

        {/* Floating Particles Overlay */}
        <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.1, 0.6, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass rounded-full border border-blue-500/20 text-sm cursor-spotlight-card"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            <span className="text-gray-300 font-medium">The Future of Mobile Accessories.</span>
            <Zap className="w-3.5 h-3.5 text-blue-400" />
          </motion.div>

          {/* Main Heading with cinematic text reveal */}
          <div className="mb-6 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight leading-none text-white uppercase"
            >
              Upgrade Your <br />
              <span className="gradient-text font-black">Digital Lifestyle</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            Premium mobile accessories designed for performance, style, and the future.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/products"
              id="hero-shop-btn"
              className="group btn-premium-primary px-8 py-4 text-lg gap-2 cursor-pointer w-full sm:w-auto"
            >
              Explore Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => setIsVideoOpen(true)}
              id="hero-watch-btn"
              className="group btn-premium-secondary px-8 py-4 text-lg gap-2 cursor-pointer w-full sm:w-auto flex items-center justify-center"
            >
              <Play className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              Watch Experience
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
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
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Cinematic Video Lightbox Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 md:p-8"
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full glass text-white hover:text-red-400 transition-colors z-[110]"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden glass border border-white/10 shadow-[0_0_80px_rgba(0,82,255,0.3)]"
            >
              <iframe
                className="w-full h-full object-cover"
                src="https://www.youtube.com/embed/5a1nB3pvewY?autoplay=1"
                title="Nothing Phone Product Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
