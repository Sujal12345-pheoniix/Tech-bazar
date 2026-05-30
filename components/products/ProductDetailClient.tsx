"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import ProductViewer from "@/components/products/ProductViewer";
import StickyBuyBar from "@/components/ui/StickyBuyBar";
import {
  ShoppingCart, Heart, Star, Shield, Truck, RotateCcw,
  ChevronLeft, ChevronRight, Share2, Info, ArrowRight,
  Plus, Check, HelpCircle, Columns, X
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

const FAQS = [
  { q: "Is this accessory covered under the 2-Year Warranty?", a: "Yes, Tech-Baazar covers any manufacturing defect or performance degradation for 24 months. You can initiate a replacement claim instantly from your client dashboard." },
  { q: "Does it support rapid magnetic inductive docking?", a: "If the product specifies MagSafe or Qi2, it contains built-in N52 neodymium magnetic arrays that snap and transfer energy without inductive thermal loss." },
  { q: "What is Gallium Nitride (GaN) technology?", a: "GaN III is a state-of-the-art alternative to silicon. It operates at higher frequencies, enabling chargers to be 60% smaller, run cooler, and transfer energy with 92% efficiency." },
  { q: "What is your shipping dispatch timeline?", a: "All orders locked before 3:00 PM are dispatched on the same day. Standard delivery ranges from 2-4 business days across India, with real-time tracking console links." }
];

export default function ProductDetailClient({
  product, relatedProducts = [],
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareTarget, setCompareTarget] = useState<Product | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { recentlyViewed, addRecentlyViewed } = useUIStore();
  const isWishlisted = isInWishlist(product.id);

  const price = selectedVariant?.price ?? product.price;
  const comparePrice = product.comparePrice;
  const discount = calculateDiscount(price, comparePrice);
  const inStock = selectedVariant
    ? selectedVariant.stock > 0
    : !product.inventory || product.inventory.quantity > 0;
  const stock = selectedVariant?.stock ?? product.inventory?.quantity ?? 0;

  // Track recently viewed
  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

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
      toast.success("Product link copied to clipboard!");
    }
  };

  const TABS = [
    { id: "description" as const, label: "Description" },
    { id: "specs" as const, label: "Specifications" },
    { id: "reviews" as const, label: `Reviews (${product.reviews.length})` },
  ];

  // Recently Viewed Filter
  const filteredRecentlyViewed = relatedProducts.filter((p) =>
    recentlyViewed.includes(p.id) && p.id !== product.id
  );

  return (
    <div className="min-h-screen bg-[#08080C] relative">
      <div className="noise-overlay" />
      
      <div className="container px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 mb-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-white transition-colors">{product.category.name}</Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-40">{product.name}</span>
        </nav>

        {/* Primary Product Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          
          {/* Left Column: 3D Scene View */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square w-full rounded-[40px] overflow-hidden glass-premium border border-white/5 h-[500px] sm:h-[600px] flex items-center justify-center">
              
              {/* Product 3D Viewer */}
              <ProductViewer
                images={product.images.map((i) => i.url)}
                selected={selectedImage}
                onSwipe={(dir) => {
                  const len = product.images.length;
                  if (dir === "left") setSelectedImage((p) => (p + 1) % len);
                  else setSelectedImage((p) => (p - 1 + len) % len);
                }}
              />

              {/* Laser highlight badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-20 pointer-events-none">
                {discount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    -{discount}%
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail tray */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "flex-shrink-0 w-18 h-18 rounded-2xl overflow-hidden border-2 bg-white/[0.01] transition-all",
                      i === selectedImage ? "border-blue-500 scale-105" : "border-white/5 hover:border-white/20"
                    )}
                    id={`product-thumb-${i}`}
                  >
                    <img src={img.url} alt={img.altText ?? ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Apple-style Sticky details panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {product.brand && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold tracking-wider uppercase">
                    {product.brand}
                  </span>
                )}
                <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">
                  {product.category.name}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight uppercase tracking-tight">
                {product.name}
              </h1>

              {/* Rating metrics */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-4.5 h-4.5",
                        s <= Math.round(product.rating) ? "text-yellow-400 fill-current" : "text-gray-700"
                      )}
                    />
                  ))}
                </div>
                <span className="text-white font-bold text-sm ml-1">{product.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({product.reviewCount} reviews)</span>
                {product.soldCount > 0 && (
                  <span className="text-xs text-gray-500 font-mono border-l border-white/10 pl-2">
                    {product.soldCount}+ SOLD
                  </span>
                )}
              </div>
            </div>

            {/* Price indicators */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-display font-black text-white">
                {formatPrice(price)}
              </span>
              {comparePrice && comparePrice > price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full">
                  SAVE {discount}%
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-gray-400 leading-relaxed text-sm">
                {product.shortDescription}
              </p>
            )}

            {/* Variants Picker */}
            {product.variants.length > 0 && (
              <div className="space-y-3">
                {Object.entries(
                  product.variants.reduce((acc, v) => {
                    if (!acc[v.name]) acc[v.name] = [];
                    acc[v.name].push(v);
                    return acc;
                  }, {} as Record<string, ProductVariant[]>)
                ).map(([variantName, variants]) => (
                  <div key={variantName}>
                    <p className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">{variantName}</p>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          disabled={v.stock === 0}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer",
                            selectedVariant?.id === v.id
                              ? "bg-white text-black border-white"
                              : v.stock === 0
                              ? "border-white/5 text-gray-700 cursor-not-allowed"
                              : "border-white/8 text-gray-300 hover:border-white/20 hover:text-white"
                          )}
                          id={`variant-btn-${v.id}`}
                        >
                          {v.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Controller */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">Quantity</span>
              <div className="flex items-center gap-3 bg-white/[0.02] border border-white/8 rounded-xl px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors font-bold cursor-pointer"
                  id="qty-minus"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold text-white text-sm tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock || 99, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors font-bold cursor-pointer"
                  id="qty-plus"
                >
                  +
                </button>
              </div>
              <span className={cn("text-xs font-semibold", inStock ? "text-green-400" : "text-red-400")}>
                {inStock ? (stock < 10 ? `Only ${stock} left!` : "In Stock") : "Out of Stock"}
              </span>
            </div>

            {/* Purchase triggers */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-2xl cursor-pointer active:scale-98 transition-all",
                  inStock
                    ? "btn-premium-primary text-white"
                    : "bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed"
                )}
                id="add-to-cart-btn"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              
              <button
                onClick={handleWishlist}
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all hover:scale-102 cursor-pointer active:scale-98",
                  isWishlisted
                    ? "bg-pink-500/10 text-pink-400 border-pink-500/25 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
                    : "glass border-white/8 text-gray-400 hover:text-pink-400 hover:border-pink-500/20"
                )}
                id="wishlist-btn"
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
              </button>
              
              <button
                onClick={handleShare}
                className="w-14 h-14 rounded-2xl glass border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer active:scale-98"
                id="share-btn"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Specs Comparison Option */}
            {relatedProducts.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] text-xs font-mono font-bold tracking-widest uppercase text-blue-400 rounded-2xl transition-all cursor-pointer"
                id="compare-modal-trigger"
              >
                <Columns className="w-4 h-4" />
                Compare Specifications
              </button>
            )}

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: "Free Delivery\nabove ₹499" },
                { icon: Shield, text: "2 Year\nWarranty" },
                { icon: RotateCcw, text: "Easy\nReturns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 p-3 glass rounded-2xl border border-white/5 text-center">
                  <Icon className="w-4.5 h-4.5 text-blue-400" />
                  <span className="text-[10px] text-gray-400 leading-tight whitespace-pre-line font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Mobile Sticky Purchase Panel */}
        <StickyBuyBar name={product.name} price={price} inStock={inStock} onAdd={handleAddToCart} onWishlist={handleWishlist} />

        {/* Tab section: Descriptions, Specifications, Reviews */}
        <div className="mb-24">
          <div className="flex gap-1.5 bg-white/5 rounded-2xl p-1.5 w-fit mb-8 border border-white/5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                  activeTab === tab.id
                    ? "bg-white/10 text-white shadow-[0_4px_15px_rgba(255,255,255,0.03)]"
                    : "text-gray-400 hover:text-white"
                )}
                id={`detail-tab-${tab.id}`}
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
                className="max-w-none text-gray-300 leading-relaxed whitespace-pre-line text-base font-sans"
              >
                {product.description}
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {product.specifications ? (
                  <div className="glass-premium rounded-3xl border border-white/5 overflow-hidden">
                    {Object.entries(product.specifications).map(([key, value], i) => (
                      <div
                        key={key}
                        className={cn("flex gap-4 px-6 py-4.5 text-sm items-center border-b border-white/5 last:border-b-0", i % 2 === 0 ? "bg-white/[0.01]" : "")}
                      >
                        <span className="text-gray-400 min-w-48 font-mono font-bold text-xs uppercase tracking-wider">{key}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 font-mono text-sm">No hardware specifications indexed.</p>
                )}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="glass-premium rounded-3xl border border-white/5 p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                            {review.user.name?.[0] ?? "U"}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-semibold text-white text-sm">{review.user.name ?? "Anonymous"}</span>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "text-yellow-400 fill-current" : "text-gray-700")} />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 font-mono ml-auto">
                                {new Date(review.createdAt).toLocaleDateString("en-IN")}
                              </span>
                            </div>
                            {review.title && <p className="font-bold text-white mt-1 text-sm">{review.title}</p>}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 glass border border-white/5 rounded-3xl">
                    <Star className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 font-mono text-sm">No telemetry reviews. Be the first to verify hardware performance!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FAQ Accordion Section */}
        <section className="mb-24 border-t border-white/5 pt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={faq.q} className="glass rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed ml-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products Catalog */}
        {relatedProducts.length > 0 && (
          <section className="mb-24 border-t border-white/5 pt-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
                  Synchronous Category List
                </span>
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                  Related Hardware
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {relatedProducts.slice(0, 6).map((p, i) => (
                <ProductCard key={p.id} product={p as never} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Carousel Tray */}
        {filteredRecentlyViewed.length > 0 && (
          <section className="border-t border-white/5 pt-16">
            <div className="mb-8">
              <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
                Telemetry Log
              </span>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                Recently Viewed
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredRecentlyViewed.map((p, i) => (
                <ProductCard key={p.id} product={p as never} index={i} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Specifications Comparison Drawer Dialog */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md">
            
            {/* Click outside target */}
            <div className="absolute inset-0" onClick={() => { setIsCompareOpen(false); setCompareTarget(null); }} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl h-full bg-[#09090E] border-l border-white/8 shadow-2xl p-8 sm:p-10 flex flex-col"
            >
              <button
                onClick={() => { setIsCompareOpen(false); setCompareTarget(null); }}
                className="absolute top-6 right-6 p-2 rounded-full glass hover:text-red-400 transition-colors"
                id="compare-close-btn"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8 pr-8">
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-2">Compare Hardware Specifications</h3>
                <p className="text-xs text-gray-400 font-mono">Select a secondary category node to display comparison metrics.</p>
              </div>

              {/* Selector for compared product */}
              <div className="mb-8">
                <label className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">Target Product Node</label>
                <select
                  onChange={(e) => {
                    const match = relatedProducts.find((p) => p.id === e.target.value);
                    setCompareTarget(match ?? null);
                  }}
                  className="w-full bg-white/[0.02] border border-white/8 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50"
                  id="compare-target-select"
                >
                  <option value="" className="bg-dark-300">-- Choose related hardware --</option>
                  {relatedProducts.map((p) => (
                    <option key={p.id} value={p.id} className="bg-dark-300">{p.name} - ₹{p.price}</option>
                  ))}
                </select>
              </div>

              {/* Comparison table panel */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 block uppercase">Current Unit</span>
                    <span className="text-sm font-semibold text-white truncate block">{product.name}</span>
                    <span className="text-base font-bold text-blue-400 block mt-1">{formatPrice(price)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 block uppercase">Compare Node</span>
                    {compareTarget ? (
                      <>
                        <span className="text-sm font-semibold text-white truncate block">{compareTarget.name}</span>
                        <span className="text-base font-bold text-blue-400 block mt-1">{formatPrice(compareTarget.price)}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-600 block mt-2">No selection active</span>
                    )}
                  </div>
                </div>

                {compareTarget && (
                  <div className="space-y-4">
                    {/* Brand */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-b border-white/5 text-xs font-mono text-gray-300">
                      <div>Brand: <span className="text-white font-bold">{product.brand ?? "Default"}</span></div>
                      <div>Brand: <span className="text-white font-bold">{compareTarget.brand ?? "Default"}</span></div>
                    </div>
                    {/* Rating */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-b border-white/5 text-xs font-mono text-gray-300">
                      <div>Rating: <span className="text-white font-bold">{product.rating.toFixed(1)} ★</span></div>
                      <div>Rating: <span className="text-white font-bold">{compareTarget.rating.toFixed(1)} ★</span></div>
                    </div>
                    
                    {/* Specification list union */}
                    {Object.entries({
                      ...product.specifications,
                      ...compareTarget.specifications
                    }).map(([key]) => (
                      <div key={key} className="py-3 border-b border-white/5">
                        <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wide mb-1.5">{key}</span>
                        <div className="grid grid-cols-2 gap-4 text-sm text-white">
                          <div className="pr-2">{product.specifications?.[key] ?? <span className="text-gray-700 font-mono text-xs">N/A</span>}</div>
                          <div className="pr-2">{compareTarget.specifications?.[key] ?? <span className="text-gray-700 font-mono text-xs">N/A</span>}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
