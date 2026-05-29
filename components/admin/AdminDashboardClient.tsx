"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { formatPrice } from "@/lib/utils";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import {
  TrendingUp, Users, Package, ShoppingBag, ArrowUpRight,
  LayoutDashboard, Box, ClipboardList, Tag, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

type Stats = {
  totalOrders: number; totalRevenue: number; totalUsers: number; totalProducts: number;
  recentOrders: Array<{ id: string; orderNumber: string; status: string; total: number; createdAt: Date; user: { name?: string | null; email: string } }>;
  topProducts: Array<{ id: string; name: string; soldCount: number; price: number; images: Array<{ url: string }> }>;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PROCESSING: "text-violet-400 bg-violet-400/10",
  SHIPPED: "text-cyan-400 bg-cyan-400/10",
  DELIVERED: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export default function AdminDashboardClient({
  stats, chartData,
}: {
  stats: Stats;
  chartData: Array<{ month: string; revenue: number; orders: number }>;
}) {
  const [activeChart, setActiveChart] = useState<"revenue" | "orders">("revenue");

  const STAT_CARDS = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      color: "from-blue-500 to-violet-600",
      change: "+12.5%",
      suffix: "this month",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "from-violet-500 to-pink-600",
      change: "+8.2%",
      suffix: "vs last month",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "from-cyan-500 to-blue-600",
      change: "+23.1%",
      suffix: "this week",
    },
    {
      title: "Active Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "from-green-500 to-teal-600",
      change: "+5",
      suffix: "new this week",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-base flex">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-56 flex-shrink-0 glass border-r border-white/8">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
            <span className="font-display font-bold gradient-text">MobileHub</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1 ml-10">Admin</p>
        </div>
        <nav className="flex-1 p-3">
          {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-1"
              id={`admin-nav-${label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Settings className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map((stat, index) => (
              // compute numeric value for AnimatedCounter
              (() => {
                let numericVal: number | string = 0;
                if (typeof stat.value === "number") numericVal = stat.value;
                else if (typeof stat.value === "string") {
                  if (stat.value.includes("₹")) {
                    numericVal = Number(stat.value.replace(/[^0-9.-]+/g, ""));
                  } else {
                    numericVal = Number(stat.value.toString().replace(/,/g, ""));
                  }
                }
                return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass rounded-2xl border border-white/8 p-5 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs text-green-400">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-display font-bold text-white mb-0.5"><AnimatedCounter value={numericVal} format={(n) => stat.title === 'Total Revenue' ? formatPrice(n) : n.toLocaleString()} /></p>
                <p className="text-xs text-gray-400">{stat.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{stat.suffix}</p>
              </motion.div>
              );
            })()
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="glass rounded-2xl border border-white/8 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-white text-lg">Analytics</h2>
              <div className="flex gap-2">
                {(["revenue", "orders"] as const).map((chart) => (
                  <button
                    key={chart}
                    onClick={() => setActiveChart(chart)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize",
                      activeChart === chart ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:text-white"
                    )}
                    id={`admin-chart-${chart}`}
                  >
                    {chart}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => activeChart === "revenue" ? `₹${(v / 1000).toFixed(0)}K` : v.toString()} />
                <Tooltip
                  contentStyle={{ background: "rgba(9,9,11,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                  formatter={(value: any) => [activeChart === "revenue" ? formatPrice(Number(value)) : value, activeChart === "revenue" ? "Revenue" : "Orders"]}
                />
                <Area type="monotone" dataKey={activeChart} stroke="#3b82f6" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="glass rounded-2xl border border-white/8 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-white">Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs text-blue-400 hover:text-blue-300" id="admin-view-orders-link">View all</Link>
              </div>
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
                      {order.user.name?.[0] ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 truncate">{order.user.name ?? order.user.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-white">{formatPrice(order.total)}</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", STATUS_COLORS[order.status])}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {stats.recentOrders.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="glass rounded-2xl border border-white/8 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-white">Top Products</h2>
                <Link href="/admin/products" className="text-xs text-blue-400 hover:text-blue-300" id="admin-view-products-link">View all</Link>
              </div>
              <div className="space-y-3">
                {stats.topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl">
                    <span className="text-sm font-bold text-gray-500 w-5">{i + 1}</span>
                    {product.images[0] && (
                      <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.soldCount} sold</p>
                    </div>
                    <p className="text-sm font-bold text-white flex-shrink-0">{formatPrice(product.price)}</p>
                  </div>
                ))}
                {stats.topProducts.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-6">No products yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
