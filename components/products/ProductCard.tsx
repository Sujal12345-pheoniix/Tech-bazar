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
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Framer Motion Springs for ultra-smooth 3D hover rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);
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
    scale.set(1.03);
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
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative rounded-2xl overflow-hidden glass border border-white/8 hover:border-blue-500/20 transition-all duration-300 hover:shadow-card-hover cursor-spotlight-card">
        {/* Spotlight cursor reflection */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(200px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 82, 255, 0.12), transparent 80%)`,
          }}
        />
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-white/3 to-white/1 overflow-hidden">
          {/* Main product page image link */}
          <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
            {primaryImage && (
              <img
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  hovered && secondaryImage ? "opacity-0 scale-110" : "opacity-100 scale-100"
                )}
              />
            )}
            {secondaryImage && hovered && (
              <img
                src={secondaryImage.url}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-500"
              />
            )}

            {/* Shimmer overlay on hover */}
            {hovered && (
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-violet-500/5" />
            )}
          </Link>

          {/* Badges - Pointer events none so it doesn't block clicks */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {discount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                -{discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="px-2 py-0.5 bg-green-500/90 text-white text-xs font-bold rounded-full">
                NEW
              </span>
            )}
            {product.isTrending && (
              <span className="px-2 py-0.5 bg-orange-500/90 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" /> HOT
              </span>
            )}
            {!inStock && (
              <span className="px-2 py-0.5 bg-gray-600 text-white text-xs font-bold rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action Buttons - Placed outside of main Link to prevent nesting */}
          <div className={cn(
            "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-200 z-10",
            hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}>
            <button
              onClick={handleWishlist}
              className={cn(
                "w-9 h-9 rounded-full glass flex items-center justify-center transition-all hover:scale-110",
                isWishlisted ? "bg-pink-500/20 text-pink-400 border-pink-500/30" : "text-gray-300 hover:text-pink-400"
              )}
              aria-label="Add to wishlist"
            >
              <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-300 hover:text-white transition-all hover:scale-110"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Add Button - Placed outside of main Link to prevent nesting */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 z-10",
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={cn(
                "w-full flex items-center justify-center gap-2 cursor-pointer font-semibold transition-all",
                inStock
                  ? "btn-premium-primary rounded-xl py-2.5 text-sm"
                  : "bg-gray-700 text-gray-400 rounded-xl py-2.5 text-sm cursor-not-allowed"
              )}
              id={`add-to-cart-${product.id}`}
            >
              <ShoppingCart className="w-4 h-4" />
              {inStock ? "Quick Add" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Content - Separated into its own block-level Link */}
        <Link href={`/products/${product.slug}`} className="block p-6">
          {product.brand && (
            <p className="text-xs text-blue-400 font-medium mb-1 uppercase tracking-wide">{product.brand}</p>
          )}
          <h3 className="text-sm font-medium text-white line-clamp-2 mb-2 group-hover:text-blue-300 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-3 h-3",
                    star <= Math.round(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
            {product.soldCount > 100 && (
              <span className="ml-auto text-xs text-gray-500">{product.soldCount}+ sold</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg text-white">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
