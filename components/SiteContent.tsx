"use client";

import { createContext, useContext, type ReactNode } from "react";
import { images as defaults } from "@/lib/data";
import type { ImageSlot, PublicContent } from "@/lib/site-types";

const SiteContentContext = createContext<PublicContent | null>(null);

export function SiteContentProvider({ content, children }: { content: PublicContent; children: ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
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
