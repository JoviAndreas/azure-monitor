"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}

// Smoothly interpolates from previous to new value over `duration` ms
export function AnimatedNumber({ value, format = (n) => Math.round(n).toLocaleString(), duration = 600 }: Props) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    from.current = display;
    startTime.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - (startTime.current ?? now);
      const t = Math.min(1, elapsed / duration);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = from.current + (value - from.current) * eased;
      setDisplay(cur);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{format(display)}</>;
}
