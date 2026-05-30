"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050508] flex flex-col items-center justify-center overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Main loading console container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated logo frame */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-24 h-24 mb-6 flex items-center justify-center"
        >
          {/* Back light flare */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <img
            src="/icon.png"
            alt="Tech-Baazar Brand Logo"
            className="w-20 h-20 object-contain relative z-10 drop-shadow-[0_10px_25px_rgba(0,82,255,0.35)]"
          />
        </motion.div>

        {/* Title */}
        <h2 className="font-display font-black text-xl text-white uppercase tracking-widest mb-2">
          Tech-Baazar
        </h2>
        
        {/* Subtext */}
        <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-6">
          Initializing Connection Node
        </p>

        {/* Progress Bar Container */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
          {/* Shimmer glowing bar */}
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 bottom-0 w-[50%] bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-600 rounded-full shadow-[0_0_8px_rgba(0,242,255,0.8)]"
          />
        </div>
      </div>
    </div>
  );
}
