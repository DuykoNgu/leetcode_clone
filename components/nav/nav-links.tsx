"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/problems", label: "Bài tập" },
  { href: "/discuss", label: "Thảo luận" },
  { href: "/interview", label: "Phỏng vấn", comingSoon: true },
  { href: "/contest", label: "Thi đấu", comingSoon: true },
];

export function NavLinks({
  activePath,
}: {
  activePath: string | null;
}) {
  const activeIndex = navLinks.findIndex((link) => activePath?.startsWith(link.href));
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, bottom: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback(() => {
    if (containerRef.current && activeIndex >= 0) {
      const container = containerRef.current;
      const items = container.children;

      if (items[activeIndex]) {
        const linkElement = items[activeIndex] as HTMLElement;
        const containerRect = container.getBoundingClientRect();

        setIndicatorStyle({
          left: linkElement.offsetLeft,
          bottom: containerRect.height - linkElement.offsetHeight,
          width: linkElement.offsetWidth,
        });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <div ref={containerRef} className="relative hidden items-center gap-6 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group relative text-sm font-medium text-gray-700 transition-colors hover:text-brand-orange"
        >
          {link.label}

          {link.comingSoon && (
            <span
              className="
                pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2
                rounded-md bg-gray-900 px-2 py-1
                text-[10px] font-semibold text-brand-orange whitespace-nowrap
                opacity-0 scale-95
                transition-all duration-200 ease-out
                group-hover:opacity-100 group-hover:scale-100
                shadow-lg
              "
            >
              🚧 coming soon
              {/* Mũi tên nhỏ */}
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 border-4 border-transparent border-t-gray-900" />
            </span>
          )}
        </Link>
      ))}

      {activeIndex >= 0 && indicatorStyle.width > 0 ? (
        <motion.div
          className="absolute h-0.5 rounded-full bg-brand-orange"
          initial={{ left: 0, bottom: 0, width: 0 }}
          animate={{
            left: indicatorStyle.left,
            bottom: indicatorStyle.bottom,
            width: indicatorStyle.width,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30, duration: 0.3 }}
        />
      ) : null}
    </div>
  );
}
