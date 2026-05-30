"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { formatPrice } from "@/lib/utils";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import {
  TrendingUp, Users, Package, ShoppingBag, ArrowUpRight,
  LayoutDashboard, Box, ClipboardList, Tag, Settings, Terminal, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

type Stats = {
  totalOrders: number; totalRevenue: number; totalUsers: number; totalProducts: number;
  recentOrders: Array<{ id: string; orderNumber: string; status: string; total: number; createdAt: Date; user: { name?: string | null; email: string } }>;
  topProducts: Array<{ id: string; name: string; soldCount: number; price: number; images: Array<{ url: string }> }>;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-500/25",
  CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-500/25",
  PROCESSING: "text-violet-400 bg-violet-400/10 border-violet-500/25",
  SHIPPED: "text-cyan-400 bg-cyan-400/10 border-cyan-500/25",
  DELIVERED: "text-green-400 bg-green-400/10 border-green-500/25",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-500/25",
};

const ADMIN_NAV = [
  { href: "/admin", label: "Overview Console", icon: LayoutDashboard },
  { href: "/admin/products", label: "Hardware Index", icon: Box },
  { href: "/admin/orders", label: "Transaction Logs", icon: ClipboardList },
  { href: "/admin/coupons", label: "Discount Node", icon: Tag },
];

export default function AdminDashboardClient({
  stats, chartData,
}: {
  stats: Stats;
  chartData: Array<{ month: string; revenue: number; orders: number }>;
}) {
  const [activeChart, setActiveChart] = useState<"revenue" | "orders">("revenue");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const STAT_CARDS = [
    {
      title: "Consolidated Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      color: "text-blue-400 border-blue-500/25 bg-blue-500/5",
      change: "+12.5%",
      suffix: "MONTHLY_RATE: INCREASING",
      glow: "rgba(0, 82, 255, 0.15)"
    },
    {
      title: "Transaction Records",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "text-violet-400 border-violet-500/25 bg-violet-500/5",
      change: "+8.2%",
      suffix: "VOLUME_LOAD: STEADY",
      glow: "rgba(124, 58, 237, 0.15)"
    },
    {
      title: "Index Nodes (Users)",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-cyan-400 border-cyan-500/25 bg-cyan-500/5",
      change: "+23.1%",
      suffix: "NODE_PING: 42ms",
      glow: "rgba(0, 242, 255, 0.15)"
    },
    {
      title: "Hardware SKUs",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-emerald-400 border-emerald-500/25 bg-emerald-500/5",
      change: "+5",
      suffix: "ACTIVE_INVENTORY: NOMINAL",
      glow: "rgba(16, 185, 129, 0.15)"
    },
  ];

  return (
    <div className="min-h-screen bg-[#08080C] flex relative text-gray-300">
      <div className="noise-overlay" />
      <div className="absolute inset-0 linear-grid opacity-10 pointer-events-none" />

      {/* Sidebar Navigation */}
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#09090D] border-r border-white/8 relative z-20">
        <div className="p-6 border-b border-white/5 space-y-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-bold rotate-12">T</div>
            <span className="font-display font-black text-white text-sm tracking-widest uppercase">Tech-Baazar</span>
          </Link>
          <div className="flex items-center gap-1.5 pl-10 text-[9px] font-mono text-gray-500">
            <Terminal className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>ROOT_TELEMETRY: ACTIVE</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onMouseEnter={() => setHoveredLink(label)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-all duration-200 z-10"
              id={`admin-nav-${label.toLowerCase().replace(/ /g, "-")}`}
            >
              {hoveredLink === label && (
                <motion.span
                  layoutId="adminNavHover"
                  className="absolute inset-0 bg-white/[0.04] border border-white/5 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Icon className="w-4 h-4 text-blue-400" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl text-xs font-mono font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-all">
            <Settings className="w-4 h-4 text-violet-400" />
            Exit Dashboard
          </Link>
        </div>
      </div>

      {/* Main Telemetry Panel */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 space-y-8">
          
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-3xl font-display font-black text-white uppercase tracking-tight">Telemetry Console</h1>
              <p className="text-gray-500 text-xs font-mono mt-1">OPERATIONS_CENTER: LIVE_FEED (2026-05-30)</p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 w-fit">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>LOGS_STREAM: ONLINE</span>
            </div>
          </div>

          {/* Stat Cards Telemetry Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map((stat, index) => {
              let numericVal = 0;
              if (typeof stat.value === "number") numericVal = stat.value;
              else if (typeof stat.value === "string") {
                numericVal = Number(stat.value.replace(/[^0-9.-]+/g, ""));
              }
              
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-premium rounded-2xl border border-white/5 p-6 space-y-4 relative overflow-hidden group hover:border-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center", stat.color)}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-0.5 text-xs text-green-400 font-mono font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {stat.change}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-display font-black text-white leading-none mb-1">
                      <AnimatedCounter value={numericVal} format={(n) => stat.title === 'Consolidated Revenue' ? formatPrice(n) : n.toLocaleString()} />
                    </h3>
                    <p className="text-gray-400 text-xs font-semibold tracking-wider font-display uppercase">{stat.title}</p>
                    <p className="text-[9px] font-mono text-gray-500 mt-1">{stat.suffix}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Area Chart: Analytics */}
          <div className="glass-premium rounded-[32px] border border-white/5 p-6 relative overflow-hidden">
            
            {/* Fine grid overlay */}
            <div className="absolute inset-0 panel-grid-lines opacity-10 pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h2 className="font-display font-black text-white text-lg uppercase tracking-wider">Metrics Analytics</h2>
                <p className="text-[10px] font-mono text-gray-500 uppercase mt-0.5">TIMELINE: MONTHLY_ACCUMULATION</p>
              </div>

              <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
                {(["revenue", "orders"] as const).map((chart) => (
                  <button
                    key={chart}
                    onClick={() => setActiveChart(chart)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer",
                      activeChart === chart ? "bg-white/10 text-white shadow" : "text-gray-500 hover:text-white"
                    )}
                    id={`admin-chart-${chart}`}
                  >
                    {chart}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative z-10 w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeChart === "revenue" ? "#7c3aed" : "#00f2ff"} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={activeChart === "revenue" ? "#7c3aed" : "#00f2ff"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => activeChart === "revenue" ? `₹${(v / 1000).toFixed(0)}K` : v.toString()} />
                  <Tooltip
                    contentStyle={{ background: "rgba(9,9,14,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", color: "#fff", backdropFilter: "blur(12px)" }}
                    formatter={(value: any) => [activeChart === "revenue" ? formatPrice(Number(value)) : value, activeChart === "revenue" ? "Revenue" : "Orders"]}
                  />
                  <Area type="monotone" dataKey={activeChart} stroke={activeChart === "revenue" ? "#7c3aed" : "#00f2ff"} strokeWidth={2.5} fill="url(#glowColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lower Grid: Logs vs Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Transaction Logs */}
            <div className="glass-premium rounded-[32px] border border-white/5 p-6">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
                <div>
                  <h2 className="font-display font-black text-white text-base uppercase tracking-wider">Transaction Logs</h2>
                  <p className="text-[9px] font-mono text-gray-500 mt-0.5">QUEUED: REAL_TIME_INDEX</p>
                </div>
                <Link href="/admin/orders" className="text-[10px] font-mono font-bold text-blue-400 hover:text-white uppercase tracking-widest" id="admin-view-orders-link">View Logs</Link>
              </div>

              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center gap-3.5 p-4 glass rounded-2xl border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/8 flex items-center justify-center text-white font-mono font-bold text-xs">
                      {order.user.name?.[0] ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono font-bold text-white uppercase truncate">#{order.orderNumber}</p>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{order.user.name ?? order.user.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1.5">
                      <p className="text-xs font-bold text-white">{formatPrice(order.total)}</p>
                      <span className={cn("text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border", STATUS_COLORS[order.status])}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {stats.recentOrders.length === 0 && (
                  <p className="text-gray-500 font-mono text-xs text-center py-8">No transaction logs available.</p>
                )}
              </div>
            </div>

            {/* Hardware Index Inventory */}
            <div className="glass-premium rounded-[32px] border border-white/5 p-6">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
                <div>
                  <h2 className="font-display font-black text-white text-base uppercase tracking-wider">SKU Velocity Index</h2>
                  <p className="text-[9px] font-mono text-gray-500 mt-0.5">METRIC: UNIT_SALES_RANKING</p>
                </div>
                <Link href="/admin/products" className="text-[10px] font-mono font-bold text-blue-400 hover:text-white uppercase tracking-widest" id="admin-view-products-link">View Index</Link>
              </div>

              <div className="space-y-3">
                {stats.topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center gap-3.5 p-3.5 glass rounded-2xl border border-white/5">
                    <span className="text-xs font-mono font-bold text-gray-500 w-4">{i + 1}</span>
                    {product.images[0] && (
                      <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-white/5 bg-white/[0.01]" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{product.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{product.soldCount} units transferred</p>
                    </div>
                    <p className="text-xs font-bold text-white flex-shrink-0 font-mono">{formatPrice(product.price)}</p>
                  </div>
                ))}
                {stats.topProducts.length === 0 && (
                  <p className="text-gray-500 font-mono text-xs text-center py-8">No active SKUs in directory.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
