"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export default function AnimatedCounter({ value, format }: { value: number | string; format?: (n: number) => string }) {
  const [display, setDisplay] = useState<string>(typeof value === "number" ? Math.round(value).toString() : String(value));

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplay(String(value));
      return;
    }
    const mv = useMotionValue(0);
    const controls = animate(mv, value, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setDisplay(format ? format(Math.round(v)) : Math.round(v).toLocaleString()) });
    return () => controls.stop();
  }, [value, format]);

  return <span>{display}</span>;
}
