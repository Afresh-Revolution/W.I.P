"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Footer } from "./Footer";
import { Header, SearchOverlay } from "./Header";
import { Icon } from "./Icon";
import { Reveal } from "./ui";

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = useState(false);
  const standalone = pathname === "/join" || pathname.startsWith("/admin");

  return (
    <>
      {!standalone ? <Header onSearch={() => setSearch(true)} /> : null}
      <div className="page-transition" key={pathname}>
        <Reveal>{children}</Reveal>
      </div>
      {!standalone ? <Footer /> : null}
      {!standalone ? (
        <Link className="mobile-sticky" href="/join">
          Join WIPI <Icon name="arrow" />
        </Link>
      ) : null}
      {search ? <SearchOverlay onClose={() => setSearch(false)} /> : null}
    </>
  );
}
