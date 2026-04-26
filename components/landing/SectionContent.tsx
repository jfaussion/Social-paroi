"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface SectionContentProps {
  children: ReactNode;
  delay?: number;
}

export function SectionContent({ children, delay = 0 }: SectionContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 60 }}
      transition={{ duration: 0.8, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
