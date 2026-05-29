"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch devices and disable the custom cursor for them
    const touch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setIsTouch(Boolean(touch));

    if (touch) return;

    const handle = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const hide = () => setVisible(false);

    const onEnterInteractive = () => setScale(1.6);
    const onLeaveInteractive = () => setScale(1);

    window.addEventListener("mousemove", handle);
    window.addEventListener("mouseenter", handle);
    window.addEventListener("mouseleave", hide);

    // Delegate hover listeners for interactive elements
    const onPointerOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest && target.closest('[data-cursor="interactive"]')) onEnterInteractive();
    };
    const onPointerOut = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest && target.closest('[data-cursor="interactive"]')) onLeaveInteractive();
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("mousemove", handle);
      window.removeEventListener("mouseenter", handle);
      window.removeEventListener("mouseleave", hide);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      <div
        style={{
          transform: `translate3d(${pos.x - 24}px, ${pos.y - 24}px, 0) scale(${scale})`,
          opacity: visible ? 1 : 0,
        }}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/40 to-violet-500/30 blur-2xl mix-blend-screen transition-transform duration-200 ease-out"
      />
      <div
        style={{ transform: `translate3d(${pos.x - 2}px, ${pos.y - 2}px, 0)`, opacity: visible ? 0.9 : 0 }}
        className="w-4 h-4 rounded-full bg-white/90 shadow-[0_6px_24px_rgba(0,82,255,0.18)] transition-all duration-150"
      />
    </div>
  );
}
