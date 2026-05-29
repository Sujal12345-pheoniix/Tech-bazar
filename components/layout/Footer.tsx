"use client";

import Link from "next/link";
import { Zap, Mail, Phone, MapPin, Instagram, Twitter, Youtube, Github, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FOOTER_LINKS = {
  Products: [
    { label: "Phone Cases", href: "/products?category=phone-cases" },
    { label: "Chargers", href: "/products?category=chargers" },
    { label: "Earbuds & Headphones", href: "/products?category=audio" },
    { label: "Power Banks", href: "/products?category=power-banks" },
    { label: "Smartwatches", href: "/products?category=smartwatches" },
    { label: "Gaming Accessories", href: "/products?category=gaming" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Track Order", href: "/dashboard" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Warranty", href: "/warranty" },
    { label: "Contact Us", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const SOCIAL_LINKS = [
  { Icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
  { Icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
  { Icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-400" },
  { Icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-200" },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5">
      {/* Background glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl rotate-12 group-hover:rotate-6 transition-transform duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white relative z-10" />
                </div>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight gradient-text">MobileHub</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              India&apos;s most premium mobile accessories store. Engineered for the future, crafted for you.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3">Get exclusive deals</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  id="footer-email-input"
                />
                <button className="p-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors" aria-label="Subscribe" id="footer-subscribe-btn">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>support@mobilehub.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-semibold text-white text-sm mb-4">{title}</h3>
                <ul className="space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MobileHub. All rights reserved. Made with ❤️ in India.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ Icon, href, label, color }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={cn(
                  "w-9 h-9 glass rounded-xl flex items-center justify-center text-gray-400 transition-all hover:scale-110",
                  color
                )}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Payment badges */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Secured by</span>
            <span className="px-2 py-1 bg-white/5 rounded-md font-medium text-gray-400">Stripe</span>
            <span className="px-2 py-1 bg-white/5 rounded-md font-medium text-gray-400">SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
