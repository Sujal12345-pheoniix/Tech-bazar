"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import {
  Package, Heart, User, MapPin, Bell, ChevronRight,
  ShoppingBag, Clock, CheckCircle, Truck, XCircle,
  Download, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

type UserType = { id: string; name?: string | null; email?: string | null; image?: string | null; role?: string };
type OrderType = {
  id: string; orderNumber: string; status: string; total: number; createdAt: Date;
  items: Array<{ id: string; name: string; image?: string | null; price: number; quantity: number }>;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  PENDING: { label: "Pending", color: "text-yellow-400 bg-yellow-400/10", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "text-blue-400 bg-blue-400/10", icon: CheckCircle },
  PROCESSING: { label: "Processing", color: "text-violet-400 bg-violet-400/10", icon: Package },
  SHIPPED: { label: "Shipped", color: "text-cyan-400 bg-cyan-400/10", icon: Truck },
  DELIVERED: { label: "Delivered", color: "text-green-400 bg-green-400/10", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "text-red-400 bg-red-400/10", icon: XCircle },
};

const TABS = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

export default function DashboardClient({
  user, orders, activeTab,
}: {
  user: UserType;
  orders: OrderType[];
  activeTab?: string;
}) {
  const [tab, setTab] = useState(activeTab ?? "orders");
  const wishlistItems = useWishlistStore((s) => s.items);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  return (
    <div className="min-h-screen bg-dark-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl">
            {user.image ? (
              <img src={user.image} alt={user.name ?? ""} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              (user.name ?? "U")[0].toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">{user.name ?? "Welcome!"}</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: orders.length, icon: "📦" },
            { label: "Delivered", value: orders.filter((o) => o.status === "DELIVERED").length, icon: "✅" },
            { label: "Wishlist Items", value: wishlistItems.length, icon: "❤️" },
            {
              label: "Total Spent",
              value: formatPrice(orders.filter(o => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0)),
              icon: "💰"
            },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl border border-white/8 p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-display font-bold text-xl text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="glass rounded-2xl border border-white/8 overflow-hidden">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all text-left",
                    tab === id
                      ? "bg-blue-500/20 text-blue-400 border-r-2 border-blue-500"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  id={`dashboard-tab-${id}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {/* Orders Tab */}
              {tab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-display font-bold text-white mb-4">My Orders</h2>
                  {orders.length === 0 ? (
                    <div className="glass rounded-2xl border border-white/8 p-12 text-center">
                      <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">No orders yet</p>
                      <p className="text-gray-400 text-sm mb-6">Start shopping to see your orders here</p>
                      <Link href="/products" className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm transition-colors" id="dashboard-shop-btn">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const StatusIcon = STATUS_CONFIG[order.status]?.icon ?? Clock;
                        return (
                          <div key={order.id} className="glass rounded-2xl border border-white/8 p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-semibold text-white">#{order.orderNumber}</p>
                                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium", STATUS_CONFIG[order.status]?.color)}>
                                  <StatusIcon className="w-3 h-3" />
                                  {STATUS_CONFIG[order.status]?.label}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                              {order.items.slice(0, 4).map((item) => (
                                <img key={item.id} src={item.image ?? "/placeholder.jpg"} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-white/5" />
                              ))}
                              {order.items.length > 4 && (
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                                  +{order.items.length - 4}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{formatPrice(order.total)}</span>
                              <div className="flex items-center gap-2">
                                {order.status === "DELIVERED" && (
                                  <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors" id={`order-invoice-${order.id}`}>
                                    <Download className="w-3.5 h-3.5" /> Invoice
                                  </button>
                                )}
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Wishlist Tab */}
              {tab === "wishlist" && (
                <motion.div key="wishlist" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-display font-bold text-white mb-4">My Wishlist</h2>
                  {wishlistItems.length === 0 ? (
                    <div className="glass rounded-2xl border border-white/8 p-12 text-center">
                      <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">Your wishlist is empty</p>
                      <Link href="/products" className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm" id="dashboard-wishlist-shop-btn">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.productId} className="glass rounded-2xl border border-white/8 overflow-hidden group">
                          <Link href={`/products/${item.slug}`}>
                            <img src={item.image} alt={item.name} className="w-full aspect-square object-cover" />
                          </Link>
                          <div className="p-3">
                            <Link href={`/products/${item.slug}`} className="text-sm font-medium text-white hover:text-blue-300 line-clamp-2 transition-colors">{item.name}</Link>
                            <p className="text-blue-400 font-bold mt-1">{formatPrice(item.price)}</p>
                            <button
                              onClick={() => removeWishlistItem(item.productId)}
                              className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                              id={`wishlist-remove-${item.productId}`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Profile Tab */}
              {tab === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-display font-bold text-white mb-4">Profile Settings</h2>
                  <div className="glass rounded-2xl border border-white/8 p-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl">
                        {user.image ? <img src={user.image} alt="" className="w-full h-full rounded-2xl object-cover" /> : (user.name ?? "U")[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <span className="mt-1 inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full">{user.role ?? "USER"}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Full Name</label>
                        <input defaultValue={user.name ?? ""} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors" id="profile-name-input" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
                        <input defaultValue={user.email ?? ""} disabled className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed" id="profile-email-input" />
                      </div>
                      <button className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors" id="profile-save-btn">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Addresses Tab */}
              {tab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-display font-bold text-white mb-4">My Addresses</h2>
                  <div className="glass rounded-2xl border border-white/8 p-12 text-center">
                    <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">No addresses saved</p>
                    <p className="text-gray-400 text-sm">Add an address during checkout</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
