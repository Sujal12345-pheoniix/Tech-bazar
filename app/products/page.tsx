import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, getCategories, getBrands } from "@/actions/products";
import ProductsPageClient from "@/components/products/ProductsPageClient";

export const metadata: Metadata = {
  title: "All Products — Shop Premium Mobile Accessories",
  description: "Browse India's widest collection of premium mobile accessories. Filter by brand, category, price, and ratings.",
};

interface SearchParams {
  category?: string;
  brand?: string;
  query?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const sortMap: Record<string, "newest" | "price_asc" | "price_desc" | "best_selling" | "trending" | "rating"> = {
    newest: "newest",
    price_asc: "price_asc",
    price_desc: "price_desc",
    best_selling: "best_selling",
    trending: "trending",
    rating: "rating",
  };

  const [{ products, total, pages }, categories, brands] = await Promise.all([
    getProducts({
      query: params.query,
      category: params.category,
      brand: params.brand,
      sortBy: sortMap[params.sort ?? "newest"] ?? "newest",
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      page: params.page ? parseInt(params.page) : 1,
      limit: 20,
    }).catch(() => ({ products: [], total: 0, pages: 0, page: 1 })),
    getCategories().catch(() => []),
    getBrands().catch(() => []),
  ]);

  return (
    <ProductsPageClient
      initialProducts={products as never[]}
      total={total}
      pages={pages}
      currentPage={params.page ? parseInt(params.page) : 1}
      categories={categories as never[]}
      brands={brands}
      initialFilters={{
        category: params.category,
        brand: params.brand,
        query: params.query,
        sort: params.sort,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      }}
    />
  );
}
