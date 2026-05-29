"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import {
  ShoppingCart, Heart, Star, Shield, Truck, RotateCcw,
  ChevronLeft, ChevronRight, ZoomIn, Share2, Check,
  Package, Zap, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductVariant { id: string; name: string; value: string; price?: number | null; sku?: string | null; stock: number; image?: string | null }
interface ProductImage { id: string; url: string; altText?: string | null; isPrimary: boolean }
interface Review { id: string; rating: number; title?: string | null; content: string; createdAt: Date; user: { name?: string | null; image?: string | null } }
interface Product {
  id: string; name: string; slug: string; description: string; shortDescription?: string | null;
  price: number; comparePrice?: number | null; brand?: string | null; rating: number; reviewCount: number;
  soldCount: number; isNewArrival?: boolean; isFeatured?: boolean; isTrending?: boolean;
  specifications?: Record<string, string> | null;
  images: ProductImage[]; variants: ProductVariant[];
  category: { name: string; slug: string };
  inventory?: { quantity: number } | null;
  reviews: Review[];
}

export default function ProductDetailClient({
  product, relatedProducts,
}: {
  product: Product;
  relatedProducts: unknown[];
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [isZoomed, setIsZoomed] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const addRecentlyViewed = useUIStore((s) => s.addRecentlyViewed);
  const isWishlisted = isInWishlist(product.id);

  const price = selectedVariant?.price ?? product.price;
  const comparePrice = product.comparePrice;
  const discount = calculateDiscount(price, comparePrice);
  const inStock = selectedVariant
    ? selectedVariant.stock > 0
    : !product.inventory || product.inventory.quantity > 0;
  const stock = selectedVariant?.stock ?? product.inventory?.quantity ?? 0;

  useState(() => { addRecentlyViewed(product.id); });

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price,
      image: product.images[0]?.url ?? "",
      slug: product.slug,
      stock,
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
    });
    toast.success(`${quantity > 1 ? quantity + "x " : ""}${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    toggleItem({
      productId: product.id, name: product.name, price,
      image: product.images[0]?.url ?? "", slug: product.slug,
      addedAt: new Date().toISOString(),
    });
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const TABS = [
    { id: "description" as const, label: "Description" },
    { id: "specs" as const, label: "Specifications" },
    { id: "reviews" as const, label: `Reviews (${product.reviews.length})` },
  ];

  return (
    <div className="min-h-screen bg-dark-base">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-white transition-colors">{product.category.name}</Link>
          <span>/</span>
          <span className="text-white truncate max-w-40">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square bg-white/3 rounded-3xl overflow-hidden glass border border-white/8 cursor-zoom-in"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]?.url ?? "/placeholder.jpg"}
                  alt={product.images[selectedImage]?.altText ?? product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.3 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Zoom icon */}
              <div className="absolute top-4 right-4 w-9 h-9 glass rounded-xl flex items-center justify-center">
                <ZoomIn className="w-4 h-4 text-gray-400" />
              </div>

              {/* Prev/Next */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p - 1 + product.images.length) % product.images.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    id="product-img-prev"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p + 1) % product.images.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    id="product-img-next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">-{discount}%</span>}
                {product.isNewArrival && <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">NEW</span>}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                      i === selectedImage ? "border-blue-500 scale-105" : "border-white/10 hover:border-white/30"
                    )}
                    id={`product-thumb-${i}`}
                  >
                    <img src={img.url} alt={img.altText ?? ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info — Sticky Panel */}
          <div className="lg:sticky lg:top-24 h-fit space-y-6">
            {/* Brand + Category */}
            <div className="flex items-center gap-3">
              {product.brand && (
                <Link href={`/products?brand=${product.brand}`} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                  {product.brand}
                </Link>
              )}
              <Link href={`/products?category=${product.category.slug}`} className="px-3 py-1 bg-white/5 text-gray-400 text-xs rounded-full border border-white/10 hover:border-white/20 transition-colors">
                {product.category.name}
              </Link>
              {product.isTrending && (
                <span className="flex items-center gap-1 px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/20">
                  <TrendingUp className="w-3 h-3" /> Trending
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-snug">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={cn("w-4 h-4", s <= Math.round(product.rating) ? "text-yellow-400 fill-current" : "text-gray-600")} />
                ))}
              </div>
              <span className="text-gray-300 font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({product.reviewCount} reviews)</span>
              {product.soldCount > 0 && <span className="text-gray-500 text-sm">· {product.soldCount}+ sold</span>}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-display font-black gradient-text">{formatPrice(price)}</span>
              {comparePrice && comparePrice > price && (
                <span className="text-xl text-gray-500 line-through">{formatPrice(comparePrice)}</span>
              )}
              {discount > 0 && (
                <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-sm font-bold rounded-full">Save {discount}%</span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-400 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Variants */}
            {product.variants.length > 0 && (
              <div>
                {/* Group variants by name */}
                {Object.entries(
                  product.variants.reduce((acc, v) => {
                    if (!acc[v.name]) acc[v.name] = [];
                    acc[v.name].push(v);
                    return acc;
                  }, {} as Record<string, ProductVariant[]>)
                ).map(([variantName, variants]) => (
                  <div key={variantName} className="mb-4">
                    <p className="text-sm font-medium text-gray-300 mb-2">{variantName}</p>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={variant.stock === 0}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                            selectedVariant?.id === variant.id
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                              : variant.stock === 0
                              ? "border-white/5 text-gray-600 cursor-not-allowed"
                              : "border-white/10 text-gray-300 hover:border-white/30 hover:text-white"
                          )}
                          id={`variant-${variant.id}`}
                        >
                          {variant.value}
                          {variant.price && variant.price !== product.price && (
                            <span className="ml-1 text-xs text-gray-400">+{formatPrice(variant.price - product.price)}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 glass rounded-xl border border-white/10 px-2 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-lg font-bold" id="product-qty-minus">−</button>
                <span className="w-8 text-center font-semibold text-white tabular-nums">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} disabled={quantity >= stock} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-lg font-bold disabled:opacity-50" id="product-qty-plus">+</button>
              </div>
              <span className={cn("text-sm", inStock ? "text-green-400" : "text-red-400")}>
                {inStock ? (stock < 10 ? `Only ${stock} left!` : "In Stock") : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 cursor-pointer font-semibold text-base transition-all",
                  inStock
                    ? "btn-premium-primary rounded-2xl py-4"
                    : "bg-gray-700 text-gray-400 rounded-2xl py-4 cursor-not-allowed"
                )}
                id="product-add-cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                onClick={handleWishlist}
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all hover:scale-105",
                  isWishlisted
                    ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
                    : "glass border-white/10 text-gray-400 hover:text-pink-400 hover:border-pink-500/30"
                )}
                id="product-wishlist-btn"
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
              </button>
              <button
                onClick={handleShare}
                className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
                id="product-share-btn"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: "Free Delivery\nabove ₹499" },
                { icon: Shield, text: "2 Year\nWarranty" },
                { icon: RotateCcw, text: "Easy\nReturns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 p-3 glass rounded-xl border border-white/5 text-center">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-gray-400 whitespace-pre-line">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white"
                )}
                id={`product-tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="prose prose-invert max-w-none"
              >
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">{product.description}</div>
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {product.specifications ? (
                  <div className="glass rounded-2xl border border-white/8 overflow-hidden">
                    {Object.entries(product.specifications).map(([key, value], i) => (
                      <div
                        key={key}
                        className={cn("flex gap-4 px-6 py-4 text-sm", i % 2 === 0 ? "bg-white/2" : "")}
                      >
                        <span className="text-gray-400 min-w-40 font-medium">{key}</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No specifications available.</p>
                )}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="glass rounded-2xl border border-white/8 p-6">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                            {review.user.name?.[0] ?? "U"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-medium text-white text-sm">{review.user.name ?? "Anonymous"}</span>
                              <div className="flex items-center">
                                {[1,2,3,4,5].map((s) => (
                                  <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "text-yellow-400 fill-current" : "text-gray-600")} />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString("en-IN")}
                              </span>
                            </div>
                            {review.title && <p className="font-semibold text-white mt-1 text-sm">{review.title}</p>}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {(relatedProducts as Product[]).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
