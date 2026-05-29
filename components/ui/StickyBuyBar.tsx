"use client";

import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Heart } from "lucide-react";

export default function StickyBuyBar({
  name,
  price,
  inStock,
  onAdd,
  onWishlist,
}: {
  name: string;
  price: number;
  inStock: boolean;
  onAdd: () => void;
  onWishlist: () => void;
}) {
  return (
    <div className="sm:hidden fixed left-0 right-0 bottom-4 z-50 px-4">
      <div className="glass rounded-3xl border border-white/8 p-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-sm text-gray-300 truncate font-semibold">{name}</div>
          <div className="text-white font-bold">{formatPrice(price)}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onWishlist} className="w-12 h-12 rounded-lg glass flex items-center justify-center text-gray-300 hover:text-pink-400">
            <Heart className="w-5 h-5" />
          </button>
          <button onClick={onAdd} disabled={!inStock} className={`px-4 py-3 rounded-lg btn-premium-primary font-semibold ${!inStock ? "opacity-60 cursor-not-allowed" : ""}`}>
            <ShoppingCart className="w-4 h-4 inline-block mr-2" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
