"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { searchProducts } from "@/actions/products";
import { cn } from "@/lib/utils";
import {
  ShoppingCart, Heart, Search, Menu, X, Sun, Moon,
  User, Package, LogOut, ChevronDown, Settings, Zap
} from "lucide-react";

const NAV_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=phone-cases", label: "Cases" },
  { href: "/products?category=chargers", label: "Chargers" },
  { href: "/products?category=audio", label: "Audio" },
  { href: "/products?category=smartwatches", label: "Wearables" },
  { href: "/products?category=gaming", label: "Gaming" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const { theme, toggleTheme, searchOpen, setSearchOpen, mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; slug: string; images: Array<{ url: string }> }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname, setMobileMenuOpen, setSearchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProducts(searchQuery);
        setSearchResults(results as Array<{ id: string; name: string; slug: string; images: Array<{ url: string }> }>);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchOpen]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out mx-auto px-4 sm:px-6 lg:px-8",
          scrolled
            ? "top-3 md:top-4 w-[95%] max-w-7xl rounded-2xl md:rounded-full border border-white/10 bg-dark-100/75 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] py-1.5 md:py-2"
            : "top-0 w-full border-b border-white/5 bg-dark-base/40 backdrop-blur-md py-3 md:py-4"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img 
              src="/icon.png" 
              alt="Tech-Baazar Logo" 
              className="w-8 h-8 md:w-9 md:h-9 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-display font-black text-lg md:text-xl tracking-tight gradient-text uppercase">
              Tech-Baazar
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 relative">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href.split("?")[0]));
              return (
                <Link
                  key={href}
                  href={href}
                  onMouseEnter={() => setHoveredLink(href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-250 z-10",
                    isActive ? "text-blue-400" : "text-gray-400 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeDot"
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {hoveredLink === href && (
                    <motion.span
                      layoutId="navHover"
                      className="absolute inset-0 bg-white/8 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Search"
                id="header-search-btn"
              >
                <Search className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 glass rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10"
                  >
                    <div className="p-3">
                      <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                          id="header-search-input"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery("")} className="cursor-pointer">
                            <X className="w-3 h-3 text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isSearching && (
                      <div className="px-4 pb-3 text-sm text-gray-400">Searching...</div>
                    )}

                    {searchResults.length > 0 && (
                      <div className="border-t border-white/5">
                        {searchResults.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.slug}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                          >
                            {p.images?.[0] && (
                              <img src={p.images[0].url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                            )}
                            <span className="text-sm text-gray-300 line-clamp-1">{p.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchQuery && !isSearching && searchResults.length === 0 && (
                      <div className="px-4 pb-4 text-sm text-gray-500 text-center">
                        No results for &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle - Desktop only */}
            <button
              onClick={toggleTheme}
              className="hidden lg:flex p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Toggle theme"
              id="header-theme-btn"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist - Desktop only */}
            <Link
              href="/dashboard?tab=wishlist"
              className="hidden lg:flex relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Wishlist"
              id="header-wishlist-btn"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart - Desktop only */}
            <button
              onClick={toggleCart}
              className="hidden lg:flex relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Cart"
              id="header-cart-btn"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </button>

            {/* User Menu / Desktop Login */}
            <div className="hidden lg:block">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full glass hover:bg-white/10 transition-all text-sm cursor-pointer"
                    id="header-user-btn"
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name ?? ""} className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                    )}
                    <span className="text-gray-300 max-w-20 truncate">
                      {session.user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className={cn("w-3 h-3 text-gray-400 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-48 glass rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 z-50"
                      >
                        <div className="p-1">
                          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Package className="w-4 h-4 text-blue-400" /> My Orders
                          </Link>
                          <Link href="/dashboard?tab=profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Settings className="w-4 h-4 text-violet-400" /> Profile
                          </Link>
                          {(session.user as { role?: string })?.role === "ADMIN" && (
                            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                              <Zap className="w-4 h-4 text-cyan-400" /> Admin
                            </Link>
                          )}
                          <div className="my-1 border-t border-white/5" />
                          <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="btn-premium-primary h-9.5 px-4 text-xs font-bold rounded-full transition-all shadow-glow-sm"
                  id="header-signin-btn"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Menu"
              id="header-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden glass border-t border-white/5 overflow-hidden absolute left-0 right-0 top-full bg-dark-100/95 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="w-full px-5 py-6 flex flex-col gap-6">
                {/* Brand Header */}
                <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                  <img src="/icon.png" alt="" className="w-7 h-7 object-contain" />
                  <span className="font-display font-black text-sm text-white uppercase tracking-wider">Tech-Baazar Drawer</span>
                </div>

                {/* Main Links */}
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Extra Controls Row */}
                <div className="grid grid-cols-3 gap-3 border-t border-b border-white/5 py-4">
                  <button
                    onClick={toggleTheme}
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Theme</span>
                  </button>

                  <Link
                    href="/dashboard?tab=wishlist"
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all text-center"
                  >
                    <div className="relative">
                      <Heart className="w-4 h-4 text-pink-400" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Wishlist</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      toggleCart();
                    }}
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <div className="relative">
                      <ShoppingCart className="w-4 h-4 text-blue-400" />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Cart</span>
                  </button>
                </div>

                {/* Account Actions */}
                <div className="mt-2">
                  {session ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/[0.01] border border-white/5 rounded-2xl">
                        {session.user?.image ? (
                          <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <User className="w-4.5 h-4.5 text-blue-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-white truncate max-w-[200px]">{session.user?.name}</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{session.user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/dashboard" className="py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white text-center border border-white/5 block">
                          My Dashboard
                        </Link>
                        {session.user?.role === "ADMIN" && (
                          <Link href="/admin" className="py-3 px-4 bg-cyan-500/10 hover:bg-cyan-500/15 rounded-xl text-xs font-semibold text-cyan-400 text-center border border-cyan-500/10 block">
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="col-span-2 py-3 px-4 bg-red-500/10 hover:bg-red-500/15 rounded-xl text-xs font-semibold text-red-400 text-center border border-red-500/10 cursor-pointer w-full"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="w-full flex items-center justify-center py-4 btn-premium-primary text-xs font-bold uppercase tracking-wider rounded-2xl shadow-glow-sm block text-center"
                    >
                      Sign In to Console
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      {pathname !== "/" && <div className="h-16 lg:h-20" />}
    </>
  );
}

