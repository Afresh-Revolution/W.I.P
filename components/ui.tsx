"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { programmes } from "@/lib/data";
import { sendSubmission } from "./send-submission";
import { useSiteContent } from "./SiteContent";
import { Icon } from "./Icon";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = ""
}: {
  href: string;
  children: ReactNode;
  variant?: string;
  className?: string;
}) {
  return (
    <Link className={`btn btn-${variant} ${className}`.trim()} href={href}>
      {children}
    </Link>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h3>{title}</h3>
          <button className="icon-btn" type="button" aria-label="Close" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  placeholder,
  options,
  required = false,
  name,
  defaultValue
}: {
  label: string;
  type?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  name?: string;
  defaultValue?: string;
}) {
  const id = (name || label).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {options ? (
        <select id={id} name={id} required={required} defaultValue={defaultValue ?? (options.length === 1 ? options[0] : "")}>
          {options.length > 1 ? <option value="">Select</option> : null}
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input id={id} name={id} type={type} placeholder={placeholder || label} required={required} defaultValue={defaultValue} />
      )}
    </label>
  );
}

export function Success({ compact = false, note = "The WIPI team has received your submission and will be in touch." }: { compact?: boolean; note?: string }) {
  return (
    <div className={`success ${compact ? "compact" : ""}`}>
      <span>
        <Icon name="check" size={42} />
      </span>
      <h1>{compact ? "Your interest has been received" : "Welcome to the WIPI Community"}</h1>
      <p>Your membership interest has been received.</p>
      <small>{note}</small>
    </div>
  );
}

export function InterestModal({ onClose, title = "Express Your Interest" }: { onClose: () => void; title?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <Modal title={sent ? "Thank you" : title} onClose={onClose}>
      {sent ? (
        <Success compact />
      ) : (
        <form
          className="form-grid"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!event.currentTarget.reportValidity()) return;
            const data = Object.fromEntries([...new FormData(event.currentTarget)].filter((entry): entry is [string, string] => typeof entry[1] === "string"));
            setPending(true);
            setError("");
            try {
              await sendSubmission("interest", data);
              setSent(true);
            } catch (reason) {
              setError(reason instanceof Error ? reason.message : "Could not send your interest.");
            } finally {
              setPending(false);
            }
          }}
        >
          <Field label="Full name" required />
          <Field label="Email address" type="email" required />
          <Field label="Phone number" required />
          <Field label="Area of interest" options={programmes.slice(0, 6).map((item) => item[0])} required />
          <label className="field full">
            <span>Message</span>
            <textarea name="message" rows={4} placeholder="Tell us how you would like to participate" required />
          </label>
          {error ? <p className="form-error full">{error}</p> : null}
          <div className="full">
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send interest"} <Icon name="arrow" />
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image?: string;
}) {
  const { images } = useSiteContent();
  const map = Boolean(image && (image.includes("plateau-state") || image === images.map));
  return (
    <section className={`page-hero with-image ${map ? "map-page-hero" : ""}`}>
      {image ? <img className="page-hero-bg" src={image} alt="" aria-hidden="true" /> : null}
      <div className="page-hero-overlay" />
      <div className="wrap page-hero-grid">
        <div>
          <span className="eyebrow light">{eyebrow}</span>
          <h1>{title}</h1>
          {text ? <p>{text}</p> : null}
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  text,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-head ${align}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function FinalCta() {
  return (
    <section className="final-cta">
      <div className="wrap">
        <span className="eyebrow light">Take your next step</span>
        <h2>
          Your Voice Matters.
          <br />
          <em>Your Leadership Matters.</em>
        </h2>
        <p>Whether you want to become a more informed voter, develop your leadership skills, serve your community or prepare for public office, there is a place for you in WIPI.</p>
        <div className="button-row">
          <ButtonLink href="/join" variant="light">
            Become a member
          </ButtonLink>
          <ButtonLink href="/partner" variant="secondary">
            Partner with us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function Reveal({ children }: { children: ReactNode }) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const targets = document.querySelectorAll("main .section, main .page-hero, main .final-cta, main .article-head");
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px" }
      );
      targets.forEach((target, index) => {
        target.classList.add("reveal-ready");
        if (motion || index < 2) target.classList.add("is-visible");
        else observer.observe(target);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [children]);
  return <>{children}</>;
}
