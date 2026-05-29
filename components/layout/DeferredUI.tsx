"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import CursorGlow from "@/components/ui/CursorGlow";
import { Toaster } from "sonner";

export default function DeferredUI() {
  return (
    <>
      <CartDrawer />
      <CursorGlow />
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "rgba(9, 9, 11, 0.9)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
          },
        }}
      />
    </>
  );
}
