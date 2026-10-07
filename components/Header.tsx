"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { nav, searchIndex } from "@/lib/data";
import { useSiteContent } from "./SiteContent";
import { Icon } from "./Icon";

export function Brand() {
  const { images } = useSiteContent();
  return (
    <Link className="brand" href="/" aria-label="WIPI home">
      <img className="brand-logo" src={images.logo} alt="" />
      <span>
        <b>WIPI</b>
        <small>
          Women in Politics Initiative
          <br />
          Plateau State
        </small>
      </span>
    </Link>
  );
}

export function Header({ onSearch }: { onSearch: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-wrap">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" type="button" aria-label="Search" onClick={onSearch}>
            <Icon name="search" />
          </button>
          <Link className="btn btn-primary" href="/join">
            Join WIPI
          </Link>
          <button className="icon-btn mobile-only" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Icon name="menu" />
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <div className="mobile-menu-head">
          <Brand />
          <button className="icon-btn" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Mobile">
          {nav.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
              <Icon name="arrow" />
            </Link>
          ))}
        </nav>
        <Link className="btn btn-primary" href="/join">
          Join WIPI
        </Link>
      </div>
    </header>
  );
}

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = searchIndex.filter((item) => `${item[0]} ${item[2]}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search WIPI">
      <div className="search-top">
        <button className="icon-btn" type="button" aria-label="Close" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      <div className="search-inner">
        <span className="eyebrow">Search WIPI</span>
        <label className="search">
          <span className="sr-only">What are you looking for?</span>
          <input autoFocus placeholder="What are you looking for?" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="search-results">
          {results.map((item) => (
            <Link key={item[1]} href={item[1]} onClick={onClose}>
              <b>{item[0]}</b>
              <span>{item[2]}</span>
              <Icon name="arrow" />
            </Link>
          ))}
          {results.length === 0 ? <p>No matching pages yet. Try membership, programmes or reach.</p> : null}
        </div>
      </div>
    </div>
  );
}
