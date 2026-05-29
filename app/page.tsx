import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import Showcase from "@/components/home/Showcase";
import CategoryExperience from "@/components/home/CategoryExperience";
import { StatsSection } from "@/components/home/StatsSection";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import ProductCard from "@/components/products/ProductCard";
import { getFeaturedProducts, getTrendingProducts } from "@/actions/products";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Package, Headphones, Watch } from "lucide-react";
import HomeProductsClient from "@/components/home/HomeProductsClient";

export const metadata: Metadata = {
  title: "TECH-BAAZAR — The Future of Mobile Accessories",
  description: "Experience India's most premium mobile accessories — phone cases, fast chargers, wireless earbuds, smartwatches, and more. Crafted for the future.",
};

export default async function HomePage() {
  const [featuredProducts, trendingProducts] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getTrendingProducts().catch(() => []),
  ]);

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Curated Showcase */}
      <Showcase />

      {/* Stats */}
      <StatsSection />

      {/* Brand Marquee */}
      <BrandMarquee />

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-24 relative">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-2">🔥 Hot Right Now</p>
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-white">
                  Trending <span className="gradient-text">Products</span>
                </h2>
              </div>
              <Link href="/products?sort=trending" className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <HomeProductsClient products={trendingProducts as never[]} />
          </div>
        </section>
      )}

      {/* Categories */}
      <CategoryExperience />

      {/* Featured Collections Banner */}
      <section className="py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "iPhone Collection",
                description: "MagSafe. Lightning-fast. Perfectly designed.",
                icon: "📱",
                gradient: "from-blue-600/20 to-violet-600/20",
                border: "border-blue-500/20",
                href: "/products?brand=Apple",
                id: "collection-iphone"
              },
              {
                title: "Gaming Setup",
                description: "Dominate every match with pro gear.",
                icon: "🎮",
                gradient: "from-red-600/20 to-orange-600/20",
                border: "border-red-500/20",
                href: "/products?category=gaming",
                id: "collection-gaming"
              },
              {
                title: "Audio Essentials",
                description: "Immersive sound. Crystal clarity.",
                icon: "🎧",
                gradient: "from-violet-600/20 to-pink-600/20",
                border: "border-violet-500/20",
                href: "/products?category=audio",
                id: "collection-audio"
              },
            ].map((col) => (
              <Link
                key={col.title}
                href={col.href}
                id={col.id}
                className={`group block rounded-3xl glass border ${col.border} hover:border-white/20 transition-all duration-300 p-8 hover:scale-[1.02]`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">{col.icon}</span>
                  <h3 className="text-xl font-display font-bold text-white mb-2">{col.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{col.description}</p>
                  <div className="flex items-center gap-2 text-sm text-blue-400 group-hover:gap-3 transition-all">
                    Shop now <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 relative">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">⭐ Editor&apos;s Pick</p>
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-white">
                  Featured <span className="gradient-text">Products</span>
                </h2>
              </div>
              <Link href="/products?featured=true" className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <HomeProductsClient products={featuredProducts as never[]} />
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-24 border-t border-white/5">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Why <span className="gradient-text">TECH-BAAZAR?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We&apos;re not just a store — we&apos;re a premium experience engineered for the discerning customer.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Same Day Dispatch", desc: "Order before 3 PM and get same-day shipping on all orders.", color: "yellow" },
              { icon: "🛡️", title: "2 Year Warranty", desc: "Every product comes with our premium 2-year warranty guarantee.", color: "blue" },
              { icon: "🏆", title: "100% Authentic", desc: "All products are sourced directly from authorized distributors.", color: "green" },
              { icon: "💬", title: "24/7 Support", desc: "Our expert team is always available to help you choose the right product.", color: "violet" },
            ].map((item, i) => (
              <div
                key={item.title}
                className="glass rounded-2xl border border-white/8 p-6 hover:border-blue-500/20 transition-all hover:scale-[1.02] group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="font-display font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Banner */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative glass rounded-4xl border border-blue-500/20 p-12 sm:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Limited Time</p>
              <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-4">
                New Customer? <span className="gradient-text">Get 10% Off</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                Use code <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">WELCOME10</span> on your first order
              </p>
              <Link
                href="/products"
                id="cta-shop-btn"
                className="group btn-premium-primary px-10 py-4 text-lg gap-2 cursor-pointer"
              >
                Start Shopping <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
