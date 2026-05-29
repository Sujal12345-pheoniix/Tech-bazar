"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
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
        transform: hovered ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.02)` : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform 0.2s ease",
      }}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative rounded-2xl overflow-hidden glass border border-white/8 hover:border-blue-500/20 transition-all duration-300 hover:shadow-card-hover">
          {/* Image Container */}
          <div className="relative aspect-square bg-gradient-to-br from-white/3 to-white/1 overflow-hidden">
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

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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

            {/* Action Buttons */}
            <div className={cn(
              "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-200",
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
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-300 hover:text-white transition-all hover:scale-110"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Add Button */}
            <div className={cn(
              "absolute bottom-0 left-0 right-0 p-3 transition-all duration-300",
              hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                  "w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
                  inStock
                    ? "bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white shadow-glow-sm"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                )}
                id={`add-to-cart-${product.id}`}
              >
                <ShoppingCart className="w-4 h-4" />
                {inStock ? "Quick Add" : "Out of Stock"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
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
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
