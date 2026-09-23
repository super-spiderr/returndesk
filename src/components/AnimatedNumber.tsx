"use client";

// Counts up from 0 the first time it scrolls into view, for a real user with
// JS. Critically, the initial (server-rendered, pre-hydration, no-JS, or
// never-scrolled-into-view) state is the real `value` — never 0 — so a
// crawler that doesn't run the scroll animation still reads the correct
// number rather than a placeholder.

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export default function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1.2,
  className,
  format,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /** Formats the in-progress rounded number — defaults to en-IN grouping. */
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  // Starts at the real value (correct for SSR/no-JS/crawlers); only resets
  // to 0 to animate once a real viewer actually scrolls it into view.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  const formatted = format ? format(display) : Math.round(display).toLocaleString("en-IN");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
