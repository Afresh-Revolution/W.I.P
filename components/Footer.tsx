"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Brand } from "./Header";
import { Icon } from "./Icon";
import { useSiteContent } from "./SiteContent";

const organisation = [
  ["About", "/about"],
  ["Leadership", "/leadership"],
  ["Our Reach", "/our-reach"],
  ["News", "/news"],
  ["Gallery", "/gallery"]
];

const participate = [
  ["Join WIPI", "/join"],
  ["Membership", "/membership"],
  ["Programmes", "/programmes"],
  ["Partner With Us", "/partner"],
  ["Contact", "/contact"]
];

export function Footer() {
  const { text } = useSiteContent();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email") })
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setNote(payload?.error || "Could not save your email.");
      return;
    }
    setNote("You're on the list. We'll send leadership, programmes and community news.");
    event.currentTarget.reset();
  }

  async function openAdmin() {
    const response = await fetch("/api/admin/gate", { method: "POST" });
    if (response.ok) window.location.assign("/admin");
  }

  return (
    <footer>
      <div className="footer-main wrap">
        <div className="footer-brand">
          <Brand />
          <p>Protect • Respect • Empower • Support Female Politicians</p>
          <p className="muted-light">A non-partisan platform for women&apos;s meaningful participation in democracy, leadership and community development.</p>
        </div>
        <div>
          <h4>Organisation</h4>
          {organisation.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h4>Participate</h4>
          {participate.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div className="newsletter">
          <h4>{text.newsletterTitle}</h4>
          <p>{text.newsletterText}</p>
          <form onSubmit={subscribe}>
            <input aria-label="Email address" name="email" placeholder="Your email address" type="email" required />
            <button aria-label="Subscribe" type="submit" disabled={pending}>
              <Icon name="arrow" />
            </button>
          </form>
          {note ? <p>{note}</p> : null}
          <div className="socials">
            <span>f</span>
            <span>in</span>
            <span>ig</span>
            <span>x</span>
            <span>yt</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom wrap">
        <span>© 2026 Women in Politics Initiative. All Rights Reserved.</span>
        <span>
          Non-Partisan •{" "}
          <button className="footer-quiet" type="button" onClick={openAdmin}>
            Inclusive
          </button>{" "}
          • Women-Focused
        </span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
