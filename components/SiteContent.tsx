"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { images as defaults } from "@/lib/data";
import type { ImageSlot, PublicContent } from "@/lib/site-types";

const SiteContentContext = createContext<PublicContent | null>(null);

export function SiteContentProvider({ content, children }: { content: PublicContent; children: ReactNode }) {
  const pathname = usePathname();
  const [live, setLive] = useState(content);

  useEffect(() => {
    let cancel = false;
    async function pull() {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok) return;
        const next = (await response.json()) as PublicContent;
        if (!cancel && next?.text && Array.isArray(next.plans)) setLive(next);
      } catch {
        // Keep the copy already on the page.
      }
    }
    pull();
    function onShow() {
      if (document.visibilityState === "visible") pull();
    }
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("focus", pull);
    return () => {
      cancel = true;
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("focus", pull);
    };
  }, [pathname]);

  return <SiteContentContext.Provider value={live}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const content = useContext(SiteContentContext);
  if (!content) throw new Error("Site content is unavailable.");
  return content;
}

const sourceKey = new Map(Object.entries(defaults).map(([key, src]) => [src, key as ImageSlot]));

export function useMedia() {
  const { images } = useSiteContent();
  const resolve = (src: string) => {
    const key = sourceKey.get(src);
    return (key && images[key]) || src;
  };
  return { ...images, resolve };
}
