"use client";

import { useEffect, useRef, useState } from "react";
import { pillars, programmes, promises, testimonials, stories } from "@/lib/data";
import { liveCopy } from "@/lib/copy";
import { Icon } from "./Icon";
import Link from "next/link";
import { useMedia, useSiteContent } from "./SiteContent";
import { ButtonLink, SectionHead } from "./ui";

export function Announcement() {
  const content = useSiteContent();
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="announcement">
      <div className="wrap">
        <span>{liveCopy(content).announcement}</span>
        <Link href="/our-reach">
          Learn more <Icon name="arrow" size={16} />
        </Link>
        <button className="announcement-close" type="button" aria-label="Close" onClick={() => setShow(false)}>
          <Icon name="close" size={17} />
        </button>
      </div>
    </div>
  );
}

export function HeroCarousel() {
  const content = useSiteContent();
  const copy = liveCopy(content);
  const slides = content.heroes.map((slide) => ({ ...slide, label: copy.heroLabel(slide.label) }));
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % count), 6500);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  function change(next: number) {
    setActive((next + count) % count);
  }

  const slide = slides[active];

  return (
    <section
      className="hero-shell"
      aria-label="Featured WIPI stories"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") change(active - 1);
        if (event.key === "ArrowRight") change(active + 1);
      }}
      onTouchStart={(event) => {
        const start = event.changedTouches[0].clientX;
        event.currentTarget.dataset.x = String(start);
      }}
      onTouchEnd={(event) => {
        const start = Number(event.currentTarget.dataset.x || 0);
        const delta = event.changedTouches[0].clientX - start;
        if (delta > 40) change(active - 1);
        if (delta < -40) change(active + 1);
      }}
    >
      <div className="home-hero-carousel">
        <div className="hero-image-stack">
          {slides.map((item, index) => (
            <img key={item.label} className={index === active ? "active" : ""} src={item.image} alt={index === active ? item.title.join(" ") : ""} />
          ))}
          <div className="hero-shade" />
        </div>
        <div className="hero-carousel-content">
          <span className="hero-label">{slide.label}</span>
          <h1>
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h1>
          <p>{slide.text}</p>
          <div className="button-row">
            <ButtonLink href={slide.primary[1]} variant="light">
              {slide.primary[0]} <Icon name="arrow" />
            </ButtonLink>
            <ButtonLink href={slide.secondary[1]} variant="secondary">
              {slide.secondary[0]}
            </ButtonLink>
          </div>
        </div>
        <div className="hero-controls">
          <div className="hero-arrows">
            <button type="button" aria-label="Previous slide" onClick={() => change(active - 1)}>
              ←
            </button>
            <button type="button" aria-label="Next slide" onClick={() => change(active + 1)}>
              →
            </button>
          </div>
          <div className="hero-dots">
            {slides.map((item, index) => (
              <button key={item.label} type="button" className={index === active ? "active" : ""} aria-label={`Go to slide ${index + 1}`} onClick={() => change(index)}>
                <span />
              </button>
            ))}
          </div>
          <span className="hero-count">
            {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>
        <div className={`hero-progress ${paused ? "paused" : ""}`} />
      </div>
    </section>
  );
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    let played = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      if (played) return;
      played = true;
      if (reduced) {
        setValue(target);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1700);
        const eased = 1 - (1 - progress) ** 3;
        setValue(Math.round(target * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) run();
      },
      { threshold: 0.45 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return <strong ref={ref}>{value.toLocaleString("en-NG")}{suffix}</strong>;
}

export function AnimatedStats() {
  const { reportedMembers, establishedYear, lgas } = useSiteContent();
  return (
    <section className="impact wrap reveal">
      <div>
        <CountUp target={reportedMembers} suffix="+" />
        <span>Reported members</span>
      </div>
      <div>
        <CountUp target={lgas.length} />
        <span>Local Government Areas</span>
      </div>
      <div>
        <CountUp target={establishedYear} />
        <span>Established in Bokkos</span>
      </div>
      <div>
        <CountUp target={1} />
        <span>Shared vision</span>
      </div>
      <small>Current membership figures as reported by WIPI.</small>
    </section>
  );
}

export function Testimonials() {
  const media = useMedia();
  const quotes = testimonials.map((item) => ({ ...item, image: media.resolve(item.image) }));
  const [index, setIndex] = useState(0);
  const item = quotes[index];
  return (
    <section className="testimonials section">
      <div className="wrap reveal">
        <div className="testimonial-heading">
          <SectionHead eyebrow="Community voices" title="Voices From The Movement" text="Reflections shown are representative placeholder content pending verification with WIPI members." />
          <div className="testimonial-controls">
            <button type="button" aria-label="Previous story" onClick={() => setIndex((index + quotes.length - 1) % quotes.length)}>
              ←
            </button>
            <button type="button" aria-label="Next story" onClick={() => setIndex((index + 1) % quotes.length)}>
              →
            </button>
          </div>
        </div>
        <div className="testimonial-stage">
          <article className="active">
            <Icon name="quote" size={38} />
            <blockquote>{item.quote}</blockquote>
            <div>
              <img src={item.image} alt="" />
              <span>
                <b>{item.name}</b>
                <small>{item.place}</small>
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function HomeView() {
  const content = useSiteContent();
  const media = useMedia();
  const copy = liveCopy(content);
  const latest = stories.slice(0, 3).map((story) => ({ ...story, image: media.resolve(story.image) }));
  return (
    <main>
      <Announcement />
      <HeroCarousel />
      <AnimatedStats />
      <section className="intro section wrap">
        <div className="editorial-images">
          <img src={media.women} alt="Women learning together" />
          <div className="image-note">
            <strong>
              Women-led.
              <br />
              Community-rooted.
              <br />
              Future-focused.
            </strong>
          </div>
        </div>
        <div>
          <SectionHead eyebrow="Who we are" title={content.text.introTitle} text={content.text.introText} />
          <p>{content.text.introBody}</p>
          <ButtonLink href="/about" variant="text">
            About WIPI <Icon name="arrow" />
          </ButtonLink>
        </div>
      </section>
      <section className="mission section">
        <div className="wrap mission-grid">
          <div>
            <span className="number">01</span>
            <h3>Our Mission</h3>
            <p>{content.text.mission}</p>
          </div>
          <div>
            <span className="number">02</span>
            <h3>Our Vision</h3>
            <p>{content.text.vision}</p>
          </div>
        </div>
      </section>
      <section className="motto section">
        <div className="wrap">
          <span className="eyebrow light">Our promise</span>
          <div className="motto-words">
            <h2>Protect.</h2>
            <h2>Respect.</h2>
            <h2>Empower.</h2>
            <h2>Support.</h2>
          </div>
          <p className="motto-lead">Female Politicians. Female Leaders. Female Voices.</p>
          <div className="motto-grid">
            {promises.map(([title, text]) => (
              <p key={title}>
                <b>{title}</b>
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="section wrap">
        <SectionHead eyebrow="Our pillars" title="What We Stand For" text="Six connected priorities guide our work and keep every programme focused on meaningful participation." />
        <div className="pillars">
          {pillars.map(([index, title, text, icon]) => (
            <div className="pillar" key={title}>
              <span>{index}</span>
              <Icon name={icon} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <ButtonLink href="/programmes" variant="secondary">
          Explore our programmes
        </ButtonLink>
      </section>
      <section className="program-preview section">
        <div className="wrap">
          <SectionHead eyebrow="What we do" title="Knowledge Becomes Agency When It Is Shared." />
          <div className="programme-lines">
            {programmes.slice(0, 4).map(([title, text, index]) => (
              <Link key={title} href={`/programmes/${title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}>
                <span>{index}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Link>
            ))}
          </div>
          <ButtonLink href="/programmes" variant="light">
            View all programmes
          </ButtonLink>
        </div>
      </section>
      <section className="participation section wrap">
        <div>
          <span className="eyebrow">Why participation matters</span>
          <h2>When Women Participate, Communities Become Stronger.</h2>
          <blockquote>“Representation isn’t simply about being present—it is about having a voice where decisions are made.”</blockquote>
          <p>WIPI believes inclusive leadership can strengthen qualities such as empathy, transparency, accountability and responsiveness to community needs.</p>
        </div>
        <img src={media.gathering} alt="Women in a community learning session" />
      </section>
      <section className="membership-preview section">
        <div className="wrap">
          <SectionHead eyebrow="Membership" title="There Is A Place For You In WIPI" text="Choose the pathway that reflects your educational background or begin as a Community member." />
          <div className="tiers">
            {content.plans.map((tier, index) => (
              <article key={tier.id} className={tier.featured ? "featured" : ""}>
                {tier.featured ? <span className="recommended">Recommended</span> : null}
                <span className="tier-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{tier.name}</h3>
                <strong>{tier.price || "Free"}</strong>
                <p>{tier.text}</p>
                <ButtonLink href="/join" variant={tier.featured ? "primary" : "secondary"}>
                  Choose {tier.name}
                </ButtonLink>
              </article>
            ))}
          </div>
          <p className="fineprint">Membership contributions are paid by bank transfer. During registration you can upload a screenshot so the team can confirm it.</p>
        </div>
      </section>
      <section className="reach-preview section">
        <div className="wrap reach-grid">
          <div className="map-visual">
            <img className="official-map" src={media.map} alt="Map of Plateau State showing all 17 Local Government Areas" />
          </div>
          <div>
            <SectionHead eyebrow="Our reach" title={copy.reachTitle} text={content.text.reachText} />
            <div className="reach-mini-stats">
              <div>
                <CountUp target={content.lgas.length} />
                <span>Local Government Areas</span>
              </div>
              <div>
                <CountUp target={content.reportedMembers} suffix="+" />
                <span>Reported members</span>
              </div>
            </div>
            <ButtonLink href="/our-reach" variant="light">
              Explore our reach
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="founder section wrap">
        <div className="founder-photo">
          <img src={media.founder} alt={`Portrait of ${content.text.founderName}`} />
          <span>{content.text.founderRole}</span>
        </div>
        <div>
          <blockquote>“{content.text.founderQuote}”</blockquote>
          <h3>{content.text.founderName}</h3>
          <p>{content.text.founderBio}</p>
          <ButtonLink href="/leadership" variant="text">
            Meet our leadership <Icon name="arrow" />
          </ButtonLink>
        </div>
      </section>
      <section className="news-preview section wrap">
        <div className="section-row">
          <SectionHead eyebrow="Stories & updates" title="Latest From WIPI" />
          <ButtonLink href="/news" variant="text">
            View all news
          </ButtonLink>
        </div>
        <div className="news-grid">
          {latest.map((story, index) => (
            <article className={`news-card ${index === 0 ? "large" : ""}`} key={story.title}>
              <div className="news-image">
                <img src={story.image} alt="" />
                <span>{story.category}</span>
              </div>
              <small>{story.date}</small>
              <h3>{story.title}</h3>
              <ButtonLink href="/news/leadership-training-expands" variant="text">
                Read article
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>
      <Testimonials />
      <section className="partners section">
        <div className="wrap">
          <SectionHead align="center" eyebrow="Partnerships" title="Building Change Through Collaboration" />
          <div className="partner-marquee" aria-hidden="true">
            <div className="partner-logos">
              {[0, 1].map((loop) => (
                <div key={loop}>
                  {content.partnerships.map((partner) => (
                    <span className="partner-chip" key={`${loop}-${partner.id}`}>
                      {partner.image ? <img src={partner.image} alt="" /> : null}
                      {partner.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <ButtonLink href="/partner" variant="secondary">
            Partner with WIPI
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
