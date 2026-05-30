import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import Showcase from "@/components/home/Showcase";
import WhyUsTimeline from "@/components/home/WhyUsTimeline";
import BestSellers from "@/components/home/BestSellers";
import LifestyleShowcase from "@/components/home/LifestyleShowcase";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export const metadata: Metadata = {
  title: "TECH-BAAZAR — The Future of Mobile Accessories",
  description: "Experience India's most premium mobile accessories — phone cases, fast chargers, wireless earbuds, smartwatches, and more. Crafted for the future.",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-dark-base overflow-hidden">
      {/* Cinematic noise overlay */}
      <div className="noise-overlay" />

      {/* Section 1: Immersive Hero Experience */}
      <HeroSection />

      {/* Section 2: Interactive Product Universe */}
      <Showcase />

      {/* Section 3: Why Tech-Baazar Exists */}
      <WhyUsTimeline />

      {/* Section 4: Best Sellers */}
      <BestSellers />

      {/* Section 5: Lifestyle Showcase */}
      <LifestyleShowcase />

      {/* Section 6: Customer Trust */}
      <StatsSection />

      {/* Section 7: Testimonials */}
      <TestimonialsSection />
    </div>
  );
}
