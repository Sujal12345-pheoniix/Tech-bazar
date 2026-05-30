"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

const FLAGSHIP_PRODUCTS = [
  {
    id: "nothing-earbuds",
    productId: "nothing-earbuds-id",
    name: "Nothing Ear (2)",
    tagline: "True Wireless Audio",
    desc: "Active noise cancellation up to -45dB, high-res audio certified, and a unique transparent aesthetic.",
    price: 8999,
    slug: "nothing-ear-2-true-wireless-earbuds",
    color: "#7C3AED",
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format",
    floatDelay: 0,
    accentGlow: "rgba(124, 58, 237, 0.25)"
  },
  {
    id: "gan-charger",
    productId: "gan-charger-id",
    name: "GaN 120W Fast Charger",
    tagline: "Uncompromising Power",
    desc: "Triple port rapid charge powered by GaN III technology. Pocket-sized charging station.",
    price: 3499,
    slug: "gan-120w-triple-port-charger",
    color: "#00F2FF",
    img: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=600&auto=format",
    floatDelay: 0.4,
    accentGlow: "rgba(0, 242, 255, 0.25)"
  },
  {
    id: "magsafe-case",
    productId: "magsafe-case-id",
    name: "MagSafe Armor Case",
    tagline: "Invisible Protection",
    desc: "Military-grade protection with a built-in magnetic ring for perfect MagSafe docking.",
    price: 2499,
    slug: "iphone-15-pro-magsafe-case-midnight-black",
    color: "#0052FF",
    img: "https://images.unsplash.com/photo-1601593346740-925612772716?w=600&auto=format",
    floatDelay: 0.8,
    accentGlow: "rgba(0, 82, 255, 0.25)"
  }
];

function FloatingIsland({ product }: { product: typeof FLAGSHIP_PRODUCTS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Motion physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180, mass: 0.7 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = (e.clientX - rect.left) / width - 0.5;
    const yVal = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xVal);
    mouseY.set(yVal);

    // Reflection coordinates
    const lightX = e.clientX - rect.left;
    const lightY = e.clientY - rect.top;
    cardRef.current.style.setProperty("--light-x", `${lightX}px`);
    cardRef.current.style.setProperty("--light-y", `${lightY}px`);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    scale.set(1.04);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
    setHovered(false);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.productId,
      name: product.name,
      price: product.price,
      image: product.img,
      slug: product.slug,
      stock: 99
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: hovered ? 0 : [0, -12, 0],
      }}
      transition={{
        y: {
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
          delay: product.floatDelay
        }
      }}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d"
      }}
      className="relative z-10 w-full max-w-sm rounded-[36px] glass-premium p-8 border border-white/5 hover:border-white/15 transition-colors cursor-spotlight-card group overflow-hidden"
    >
      {/* Dynamic Laser reflection effect */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at var(--light-x, 0px) var(--light-y, 0px), rgba(255, 255, 255, 0.08), transparent 60%), radial-gradient(300px circle at var(--light-x, 0px) var(--light-y, 0px), ${product.accentGlow}, transparent 50%)`
        }}
      />

      {/* Floating back-glow */}
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: product.color }}
      />

      {/* Product Image Section */}
      <Link href={`/products/${product.slug}`} className="block relative h-64 flex items-center justify-center mb-8 overflow-hidden rounded-2xl bg-white/[0.01] border border-white/5" style={{ transform: "translateZ(30px)" }}>
        <img
          src={product.img}
          alt={product.name}
          className="w-[75%] h-[75%] object-cover rounded-xl transition-all duration-700 group-hover:scale-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </Link>

      {/* Info details */}
      <div style={{ transform: "translateZ(15px)" }}>
        <span className="text-xs uppercase font-bold tracking-widest" style={{ color: product.color }}>
          {product.tagline}
        </span>
        <h3 className="text-2xl font-display font-black text-white mt-1 mb-2 tracking-tight">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 h-12 line-clamp-2">
          {product.desc}
        </p>

        <div className="flex items-center justify-between border-t border-white/5 pt-5">
          <div>
            <span className="text-xs text-gray-500 block uppercase tracking-wider">Price</span>
            <span className="text-xl font-bold text-white">₹{product.price.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              className="w-11 h-11 rounded-full glass border border-white/8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
              title="Quick Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="px-5 py-3 rounded-full btn-premium-primary text-xs gap-1.5 flex items-center"
            >
              Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Showcase() {
  return (
    <section className="py-32 relative overflow-hidden bg-dark-base border-t border-white/5">
      {/* Background design accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-blue-500/3 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle telemetry line */}
      <div className="absolute left-0 right-0 top-16 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute left-0 right-0 bottom-16 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass border border-white/8 text-xs font-semibold text-gray-400 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <span>Interactive Space</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight uppercase leading-none"
          >
            Interactive <br />
            <span className="gradient-text font-black">Product Universe</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-lg mt-6 max-w-xl mx-auto"
          >
            A physical playground of hardware. Move your cursor to adjust lighting shadows, and experience the glass depth structure of our flagship releases.
          </motion.p>
        </div>

        {/* Islands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 justify-items-center">
          {FLAGSHIP_PRODUCTS.map((product) => (
            <FloatingIsland key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
