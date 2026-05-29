"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), { ssr: false, loading: () => null });

export default function LazyHeroScene({ rootMargin = "200px" }: { rootMargin?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === "undefined") { setLoad(true); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setLoad(true);
          obs.disconnect();
        }
      });
    }, { root: null, rootMargin });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, rootMargin]);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none z-0">
      {load ? (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      ) : null}
    </div>
  );
}
