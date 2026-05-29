"use client";

import ProductCard from "@/components/products/ProductCard";

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

export default function HomeProductsClient({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
