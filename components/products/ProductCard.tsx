"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye, Zap, TrendingUp } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  brand?: string | null;
  rating: number;
  reviewCount: number;
  soldCount: number;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  images: Array<{ url: string; altText?: string | null }>;
  category: { name: string; slug: string };
  inventory?: { quantity: number } | null;
}

interface ProductCardProps {
  product: Product;
  index?: number;
  layoutMode?: "grid" | "list";
}

export default function ProductCard({ product, index = 0, layoutMode = "grid" }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Framer Motion Springs for ultra-smooth 3D hover rotation (primarily for grid view)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(1, springConfig);

  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const discount = calculateDiscount(product.price, product.comparePrice);
  const inStock = !product.inventory || product.inventory.quantity > 0;
  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);

    // Spotlight cursor follow
    const spotX = e.clientX - rect.left;
    const spotY = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${spotX}px`);
    cardRef.current.style.setProperty("--mouse-y", `${spotY}px`);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
    setHovered(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      id: `${product.id}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage?.url ?? "",
      slug: product.slug,
      stock: product.inventory?.quantity ?? 99,
    });
    toast.success("Added to cart!", {
      description: product.name,
      action: { label: "View Cart", onClick: () => useCartStore.getState().openCart() },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage?.url ?? "",
      slug: product.slug,
      addedAt: new Date().toISOString(),
    });
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  if (layoutMode === "list") {
    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, duration: 0.35 }}
        className="w-full relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative rounded-2xl overflow-hidden glass border border-white/8 hover:border-blue-500/20 transition-all duration-300 hover:shadow-card-hover cursor-spotlight-card flex flex-col md:flex-row p-4 gap-6 items-center md:items-stretch">
          {/* Spotlight reflection */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
            style={{
              background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 82, 255, 0.08), transparent 80%)`,
            }}
          />

          {/* Left aspect image container */}
          <div className="w-full md:w-56 h-56 md:h-auto aspect-square md:aspect-auto flex-shrink-0 bg-gradient-to-br from-white/3 to-white/1 overflow-hidden rounded-xl relative">
            <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
              {primaryImage && (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.altText ?? product.name}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500",
                    hovered && secondaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
                  )}
                />
              )}
              {secondaryImage && hovered && (
                <img
                  src={secondaryImage.url}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover scale-100 transition-transform duration-500"
                />
              )}
            </Link>

            {/* Floating badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-20">
              {discount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">
                  -{discount}%
                </span>
              )}
              {product.isNewArrival && (
                <span className="px-2 py-0.5 bg-green-500/90 text-white text-[10px] font-bold rounded-md">
                  NEW
                </span>
              )}
              {product.isTrending && (
                <span className="px-2 py-0.5 bg-orange-500/90 text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" /> HOT
                </span>
              )}
              {!inStock && (
                <span className="px-2 py-0.5 bg-gray-600 text-white text-[10px] font-bold rounded-md">
                  SOLD OUT
                </span>
              )}
            </div>
          </div>

          {/* Right detail section */}
          <div className="flex-1 flex flex-col justify-between py-1.5 w-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider font-mono">
                  {product.brand ?? product.category.name}
                </span>
                <div className="flex items-center gap-1.5 z-20">
                  <button
                    onClick={handleWishlist}
                    className={cn(
                      "w-8 h-8 rounded-full glass flex items-center justify-center transition-all hover:scale-105",
                      isWishlisted ? "bg-pink-500/20 text-pink-400 border-pink-500/30" : "text-gray-400 hover:text-pink-400"
                    )}
                    aria-label="Wishlist"
                  >
                    <Heart className={cn("w-3.5 h-3.5", isWishlisted && "fill-current")} />
                  </button>
                  <Link
                    href={`/products/${product.slug}`}
                    className="w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <Link href={`/products/${product.slug}`} className="block">
                <h3 className="text-lg font-bold text-white hover:text-blue-300 transition-colors leading-snug">
                  {product.name}
                </h3>
              </Link>

              {/* Rating row */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-3.5 h-3.5",
                        star <= Math.round(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-700"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">({product.reviewCount} Reviews)</span>
                {product.soldCount > 100 && (
                  <span className="text-xs text-gray-500 border-l border-white/10 pl-2">{product.soldCount}+ units sold</span>
                )}
              </div>
            </div>

            {/* Bottom pricing and Buy button */}
            <div className="flex items-end justify-between gap-4 mt-6 pt-4 border-t border-white/5">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">{formatPrice(product.price)}</span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-xs text-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                  "h-10 px-5 flex items-center justify-center gap-2 cursor-pointer font-semibold rounded-xl text-xs uppercase tracking-wider transition-all z-20 active:scale-97",
                  inStock
                    ? "btn-premium-primary"
                    : "bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed"
                )}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid Mode (Standard 3D card layout)
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-full flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative rounded-2xl overflow-hidden glass border border-white/8 hover:border-blue-500/20 transition-all duration-300 hover:shadow-card-hover cursor-spotlight-card h-full flex flex-col justify-between">
        {/* Spotlight cursor reflection */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(200px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 82, 255, 0.12), transparent 80%)`,
          }}
        />

        {/* Top Section (Image container) */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-white/3 to-white/1 overflow-hidden flex-shrink-0">
          <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
            {primaryImage && (
              <img
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  hovered && secondaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
                )}
              />
            )}
            {secondaryImage && hovered && (
              <img
                src={secondaryImage.url}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover scale-100 transition-transform duration-500"
              />
            )}
            {hovered && (
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-violet-500/5" />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-20">
            {discount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">
                -{discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="px-2 py-0.5 bg-green-500/90 text-white text-[10px] font-bold rounded-md">
                NEW
              </span>
            )}
            {product.isTrending && (
              <span className="px-2 py-0.5 bg-orange-500/90 text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" /> HOT
              </span>
            )}
            {!inStock && (
              <span className="px-2 py-0.5 bg-gray-600 text-white text-[10px] font-bold rounded-md">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Icons Tray */}
          <div className={cn(
            "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-20",
            hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
          )}>
            <button
              onClick={handleWishlist}
              className={cn(
                "w-8.5 h-8.5 rounded-full glass flex items-center justify-center transition-all hover:scale-105",
                isWishlisted ? "bg-pink-500/20 text-pink-400 border-pink-500/30" : "text-gray-300 hover:text-pink-400"
              )}
              aria-label="Add to wishlist"
            >
              <Heart className={cn("w-3.5 h-3.5", isWishlisted && "fill-current")} />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="w-8.5 h-8.5 rounded-full glass flex items-center justify-center text-gray-300 hover:text-white transition-all hover:scale-105"
              aria-label="Quick view"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Add Overlay Button */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 z-20",
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={cn(
                "w-full flex items-center justify-center gap-2 cursor-pointer font-semibold rounded-xl text-xs tracking-wider uppercase h-10 transition-all active:scale-97",
                inStock
                  ? "btn-premium-primary"
                  : "bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {inStock ? "Quick Add" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Content Section (takes remaining height to ensure alignment) */}
        <div className="flex-1 flex flex-col justify-between p-5 min-h-[140px] w-full">
          <div>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider font-mono block mb-1">
              {product.brand ?? "Tech-Baazar"}
            </span>
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="text-sm font-semibold text-white line-clamp-2 hover:text-blue-300 transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="mt-4">
            {/* Rating row */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-3 h-3",
                      star <= Math.round(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-700"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
              {product.soldCount > 100 && (
                <span className="ml-auto text-[10px] text-gray-500">{product.soldCount}+ sold</span>
              )}
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2 pt-2.5 border-t border-white/5">
              <span className="font-bold text-base text-white">{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs text-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
