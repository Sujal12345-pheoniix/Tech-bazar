import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — TECH-BAAZAR`,
    description: product.shortDescription ?? product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? "",
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId).catch(() => []);

  return <ProductDetailClient product={product as never} relatedProducts={relatedProducts as never[]} />;
}
