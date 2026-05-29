"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Arjun Sharma",
    location: "Mumbai, Maharashtra",
    avatar: "AS",
    rating: 5,
    product: "MagSafe Wireless Charger",
    text: "Absolutely stunning quality! The MagSafe charger snaps perfectly and charges my iPhone 15 Pro at full speed. MobileHub's packaging is even better than Apple's retail experience.",
    gradient: "from-blue-500 to-violet-600",
  },
  {
    id: 2,
    name: "Priya Nair",
    location: "Bengaluru, Karnataka",
    avatar: "PN",
    rating: 5,
    product: "Nothing Ear (2) Case",
    text: "I've bought from Flipkart, Amazon, and Croma. None of them compare to MobileHub's experience. The website is gorgeous, the product is authentic, and delivery was same day!",
    gradient: "from-violet-500 to-pink-600",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    location: "Hyderabad, Telangana",
    avatar: "RM",
    rating: 5,
    product: "120W GaN Charger",
    text: "The GaN charger is insane — charges my laptop, phone, and iPad simultaneously at full speed. Premium build quality. This is the Amazon of mobile accessories but way more premium.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    location: "Chennai, Tamil Nadu",
    avatar: "SR",
    rating: 5,
    product: "Gaming Trigger Set",
    text: "Gaming triggers have transformed my BGMI experience. Solid build, zero latency, and they fit my OnePlus 12 perfectly. The unboxing experience is like opening a premium gadget!",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: 5,
    name: "Aditya Kumar",
    location: "Pune, Maharashtra",
    avatar: "AK",
    rating: 5,
    product: "Smart Watch Ultra",
    text: "The smartwatch I ordered arrived in 4 hours — absolutely unbelievable. The product quality rivals Samsung Galaxy Watch at half the price. MobileHub is the future of tech retail in India.",
    gradient: "from-green-500 to-teal-600",
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  const visible = [
    TESTIMONIALS[(current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length],
    TESTIMONIALS[current],
    TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/3 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Customer Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-display font-bold text-white mb-4"
          >
            Loved by{" "}
            <span className="gradient-text">50,000+</span>
            {" "}customers
          </motion.h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visible.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: index === 1 ? 1 : 0.5,
                  scale: index === 1 ? 1 : 0.9,
                }}
                transition={{ duration: 0.3 }}
                className={`glass rounded-3xl border p-6 md:p-8 ${index === 1 ? "border-blue-500/20" : "border-white/5"}`}
              >
                <Quote className="w-8 h-8 text-blue-400/30 mb-4" />

                <p className="text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.location}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                {index === 1 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-blue-400">Verified purchase: {testimonial.product}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-white/10 hover:border-blue-500/30 transition-all"
              id="testimonials-prev-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-blue-500" : "w-2 bg-gray-600"}`}
                  id={`testimonials-dot-${i}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-white/10 hover:border-blue-500/30 transition-all"
              id="testimonials-next-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
