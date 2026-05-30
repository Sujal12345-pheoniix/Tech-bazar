"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Arjun Sharma",
    location: "Mumbai",
    avatar: "AS",
    rating: 5,
    product: "MagSafe Wireless Charger",
    text: "Absolutely stunning quality! The MagSafe charger snaps perfectly and charges my iPhone at full speed. Tech-Baazar's packaging is even better than Apple's retail experience.",
    glow: "rgba(0, 82, 255, 0.1)"
  },
  {
    name: "Priya Nair",
    location: "Bengaluru",
    avatar: "PN",
    rating: 5,
    product: "Nothing Ear (2) Case",
    text: "I've bought from Croma, Amazon, and Flipkart. None of them compare to this startup. The website is gorgeous, the case is completely authentic, and delivery was same-day!",
    glow: "rgba(124, 58, 237, 0.1)"
  },
  {
    name: "Rohan Mehta",
    location: "Hyderabad",
    avatar: "RM",
    rating: 5,
    product: "120W GaN Charger",
    text: "This GaN charger is insane — charges my MacBook, phone, and tablet simultaneously at full speed. Premium build. This is the Tesla of mobile accessories.",
    glow: "rgba(0, 242, 255, 0.1)"
  },
  {
    name: "Sneha Reddy",
    location: "Chennai",
    avatar: "SR",
    rating: 5,
    product: "Gaming Trigger Set",
    text: "Gaming triggers have transformed my BGMI experience. Solid build, zero latency, and fits my phone perfectly. Unboxing was like opening a premium gadget!",
    glow: "rgba(255, 0, 122, 0.1)"
  },
  {
    name: "Aditya Kumar",
    location: "Pune",
    avatar: "AK",
    rating: 5,
    product: "Smart Watch Ultra",
    text: "Watch arrived in 4 hours — unbelievable dispatch speed. Build quality rivals Apple Watch at a fraction of the cost. Tech-Baazar is the future of retail.",
    glow: "rgba(34, 197, 94, 0.1)"
  },
  {
    name: "Meera Sen",
    location: "Delhi",
    avatar: "MS",
    rating: 5,
    product: "Braided 240W Cable",
    text: "Sturdy braided cable that doesn't kink. Delivers full power to my fast chargers. Best accessory brand in India by a long shot.",
    glow: "rgba(245, 158, 11, 0.1)"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-32 relative bg-dark-base border-t border-white/5 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-violet-500/3 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <span className="text-xs uppercase font-mono tracking-widest text-violet-400 font-bold block mb-4">
            User Experience Reports
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-white leading-none uppercase tracking-tight">
            Loved by Hardware Enthusiasts
          </h2>
          <p className="text-gray-400 mt-4">
            Hear from developers, gamers, and creators who upgraded their workspace layouts with our hardware accessories.
          </p>
        </div>

        {/* Masonry Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          
          {/* Column 1 */}
          <div className="space-y-6">
            {[TESTIMONIALS[0], TESTIMONIALS[3]].map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-6 md:mt-12 lg:mt-6">
            {[TESTIMONIALS[1], TESTIMONIALS[4]].map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-6 lg:mt-12">
            {[TESTIMONIALS[2], TESTIMONIALS[5]].map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: typeof TESTIMONIALS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="glass-premium rounded-3xl border border-white/5 p-8 relative overflow-hidden group hover:border-white/12 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all"
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle 180px at 0% 0%, ${item.glow}, transparent 85%)`
        }}
      />

      <Quote className="w-8 h-8 text-white/5 mb-6" />

      <p className="text-gray-300 text-sm leading-relaxed mb-6 font-sans">
        &ldquo;{item.text}&rdquo;
      </p>

      {/* User meta details */}
      <div className="flex items-center gap-3 border-t border-white/5 pt-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white font-bold text-sm">
          {item.avatar}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white text-sm block truncate">{item.name}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" aria-label="Verified hardware purchaser" />
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">{item.location}</span>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <div className="flex">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
            ))}
          </div>
          <span className="text-[9px] font-mono text-gray-600 block leading-none">VERIFIED_BUYER</span>
        </div>
      </div>
    </motion.div>
  );
}
