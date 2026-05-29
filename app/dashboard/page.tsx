import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/actions/order";
import DashboardClient from "@/components/dashboard/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard — MobileHub",
  description: "Manage your orders, profile, wishlist, and address book.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const params = await searchParams;
  const orders = await getUserOrders().catch(() => []);

  return <DashboardClient user={session.user as never} orders={orders as never[]} activeTab={params.tab} />;
}
