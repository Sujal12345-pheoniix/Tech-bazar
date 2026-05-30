"use client";

import { ReactNode, useRef } from "react";
import Link from "next/link";

type MagneticButtonProps = React.HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
  style?: any;
  href?: string;
};

export default function MagneticButton({ children, className = "", style = {}, href, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) - rect.width / 2;
    const y = (e.clientY - rect.top) - rect.height / 2;
    const tx = (x / rect.width) * 12;
    const ty = (y / rect.height) * 8;
    ref.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.02)`;
    ref.current.style.transition = "transform 0.12s cubic-bezier(0.16,1,0.3,1)";
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate3d(0,0,0) scale(1)";
    ref.current.style.transition = "transform 0.28s cubic-bezier(0.16,1,0.3,1)";
  };

  const common = {
    'data-cursor': 'interactive',
    ref,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onMouseDown: () => { if (ref.current) (ref.current as HTMLElement).style.transform += " scale(0.98)"; },
    onMouseUp: reset,
    className,
    style,
  } as any;

  if (href) {
    return (
      <Link href={href} {...common} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button {...common} {...props}>
      {children}
    </button>
  );
}
