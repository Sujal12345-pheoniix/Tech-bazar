import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminStats, getRevenueChartData } from "@/actions/admin";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — MobileHub",
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/");
  }

  const [stats, chartData] = await Promise.all([
    getAdminStats().catch(() => ({
      totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalProducts: 0, recentOrders: [], topProducts: [],
    })),
    getRevenueChartData().catch(() => []),
  ]);

  return <AdminDashboardClient stats={stats as never} chartData={chartData} />;
}
