"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, Phone, MapPin, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Instagram = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const Github = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FOOTER_LINKS = {
  Products: [
    { label: "Cases & Protectors", href: "/products?category=phone-cases" },
    { label: "GaN Fast Chargers", href: "/products?category=chargers" },
    { label: "Acoustic Audio", href: "/products?category=audio" },
    { label: "Mobile Power", href: "/products?category=power-banks" },
    { label: "Smartwatches", href: "/products?category=smartwatches" },
    { label: "Mechanical Gaming", href: "/products?category=gaming" }
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Engineering Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Hardware Labs", href: "/labs" }
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Track Console", href: "/dashboard" },
    { label: "Warranty Claim", href: "/warranty" },
    { label: "Returns", href: "/returns" },
    { label: "Contact Us", href: "/contact" }
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Patent Registry", href: "/patents" }
  ]
};

const SOCIAL_LINKS = [
  { Icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400 hover:border-pink-500/20 hover:bg-pink-500/5" },
  { Icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400 hover:border-sky-500/20 hover:bg-sky-500/5" },
  { Icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5" },
  { Icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-100 hover:border-gray-500/20 hover:bg-gray-500/5" }
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative bg-dark-base border-t border-white/5 overflow-hidden">
      {/* Subtle top indicator border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      
      {/* Huge ambient backing glow */}
      <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl rotate-12 group-hover:rotate-6 transition-transform duration-300 shadow-[0_4px_15px_rgba(0,82,255,0.3)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white relative z-10" />
                </div>
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white uppercase">
                Tech-Baazar
              </span>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              We engineer premium mobile hardware accessories designed for performance, materials longevity, and structural design honesty.
            </p>

            {/* Newsletter input with glowing focus state and ripple validation */}
            <form onSubmit={handleSubscribe} className="space-y-3 max-w-sm">
              <p className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
                Subscribe to Releases
              </p>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribed}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/8 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all disabled:opacity-50"
                    id="footer-email-input"
                  />
                  <AnimatePresence>
                    {subscribed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  type="submit"
                  disabled={subscribed || !email}
                  className="px-5 bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl font-semibold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  id="footer-subscribe-btn"
                >
                  {subscribed ? "Subscribed" : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title} className="space-y-5">
                <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
                  {title}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 block font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Brand Statement / Luxury tagline */}
        <div className="border-t border-white/5 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-semibold tracking-widest uppercase">
              Tech-Baazar Design Labs
            </p>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} TECH-BAAZAR. Engineered with precision. All rights reserved.
            </p>
          </div>

          {/* Social media connections */}
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((soc) => {
              const SocialIcon = soc.Icon;
              return (
                <a
                  key={soc.label}
                  href={soc.href}
                  aria-label={soc.label}
                  className={cn(
                    "w-10 h-10 rounded-xl glass border border-white/8 flex items-center justify-center text-gray-400 transition-all hover:scale-105",
                    soc.color
                  )}
                >
                  <SocialIcon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Logistics & Security */}
          <div className="flex items-center gap-2.5 text-xs text-gray-500">
            <span>Secured Checkout:</span>
            <span className="px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-md font-mono font-semibold text-gray-400">Stripe</span>
            <span className="px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-md font-mono font-semibold text-gray-400">SSL</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
