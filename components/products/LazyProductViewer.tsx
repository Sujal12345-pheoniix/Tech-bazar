"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ProductViewer = dynamic(() => import("./ProductViewer"), { ssr: false, loading: () => null });

export default function LazyProductViewer({ images = [], selected = 0, onSwipe }: { images?: string[]; selected?: number; onSwipe?: (dir: "left" | "right") => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === "undefined") { setLoad(true); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Defer heavy load to idle to avoid blocking LCP
          if ((window as any).requestIdleCallback) {
            (window as any).requestIdleCallback(() => setLoad(true));
          } else {
            setTimeout(() => setLoad(true), 300);
          }
          obs.disconnect();
        }
      });
    }, { root: null, rootMargin: "200px" });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);

  return (
    <div ref={ref} className="w-full h-full">
      {load ? (
        <Suspense fallback={<div className="w-full h-full bg-white/3 rounded-3xl" /> }>
          {/* @ts-ignore */}
          <ProductViewer images={images} selected={selected} onSwipe={onSwipe} />
        </Suspense>
      ) : (
        <div className="w-full h-full bg-white/3 rounded-3xl" />
      )}
    </div>
  );
}
