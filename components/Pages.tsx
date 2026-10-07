"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { faqs, journey, leaders, legal, objectives, programmes, promises, slugify, stories, tiers, uniforms } from "@/lib/data";
import { liveCopy } from "@/lib/copy";
import { sendSubmission } from "./send-submission";
import { useMedia, useSiteContent } from "./SiteContent";
import { Icon } from "./Icon";
import { Brand } from "./Header";
import { ButtonLink, Field, FinalCta, InterestModal, PageHero, SectionHead, Success } from "./ui";

export function AboutView() {
  const media = useMedia();
  const content = useSiteContent();
  const copy = liveCopy(content);
  return (
    <main>
      <PageHero eyebrow="About WIPI" title="We Are Building A Generation of Women Ready to Lead." text="A non-partisan, community-rooted movement creating practical pathways into civic participation, leadership and development." image={media.women} />
      <section className="section wrap two-col">
        <div>
          <SectionHead eyebrow="Our story" title="It Started With A Simple, Urgent Belief." />
          <p className="lead">Women deserve the information, support and opportunity to shape the decisions that affect their lives.</p>
          <p>WIPI began in Bokkos LGA in 2022 as a locally rooted response to the barriers women face in public participation.</p>
          <p>{copy.aboutToday}</p>
          <p>Our long-term ambition is to establish sustainable structures across Nigeria while keeping community voices at the centre.</p>
        </div>
        <img src={media.gathering} alt="Women gathering in community" />
      </section>
      <section className="section soft">
        <div className="wrap">
          <SectionHead eyebrow="Our journey" title="From One LGA To A Statewide Movement" />
          <div className="journey">
            {journey.map(([index, year, text]) => (
              <article key={index}>
                <span>{index}</span>
                <h3>{year}</h3>
                <p>{index === "03" ? copy.journeyLgas : index === "04" ? copy.journeyMembers : text}</p>
              </article>
            ))}
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
        <SectionHead eyebrow="What we pursue" title="Objectives That Turn Purpose Into Progress" />
        <div className="objective-grid">
          {objectives.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>
      <section className="section soft">
        <div className="wrap">
          <SectionHead eyebrow="Our commitment" title="Non-Partisan. Women-Focused. Democracy-Driven." />
          <p className="lead">WIPI promotes women’s participation in democratic governance without limiting its work to any political party. We welcome women from different political, professional, educational, ethnic, religious and social backgrounds who share the commitment to responsible leadership.</p>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}

export function ProgrammesView() {
  const media = useMedia();
  const [open, setOpen] = useState(false);
  return (
    <main>
      <PageHero eyebrow="Our programmes" title="Preparing Women To Participate, Lead and Thrive." text="Practical programmes shaped around knowledge, relationships, economic agency and safer participation." image={media.women} />
      <section className="section wrap programme-page">
        {programmes.map(([title, text, index]) => (
          <article key={title}>
            <span>{index}</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
              <ul>
                <li>Practical, accessible learning</li>
                <li>For women across Plateau State</li>
                <li>Community-centred outcomes</li>
              </ul>
              <div className="button-row">
                <ButtonLink href={`/programmes/${slugify(title)}`} variant="secondary">
                  Programme details
                </ButtonLink>
                <button className="btn btn-text" type="button" onClick={() => setOpen(true)}>
                  Express interest
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <FinalCta />
      {open ? <InterestModal onClose={() => setOpen(false)} /> : null}
    </main>
  );
}

export function ProgrammeDetailView({ slug }: { slug: string }) {
  const media = useMedia();
  const [open, setOpen] = useState(false);
  const match = programmes.find((item) => slugify(item[0]) === slug);
  const title = match?.[0] || slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ").replace("And", "&");
  return (
    <main>
      <PageHero eyebrow="WIPI Programme" title={title} text="Building the practical knowledge, confidence and networks women need to participate meaningfully." image={media.women} />
      <section className="section wrap two-col detail-copy">
        <div>
          <SectionHead eyebrow="Overview" title="Knowledge Designed For Real Participation" />
          <p className="lead">{match?.[1] || "This programme combines accessible learning, peer exchange and community action."}</p>
          <p>This programme combines accessible learning, peer exchange and community action.</p>
          <button className="btn btn-primary" type="button" onClick={() => setOpen(true)}>
            Express interest
          </button>
        </div>
        <div>
          <h3>Programme objectives</h3>
          <ul className="check-list">
            <li>Strengthen practical leadership and civic knowledge</li>
            <li>Build confidence for participation in public life</li>
            <li>Connect women with peers and experienced mentors</li>
            <li>Create pathways into meaningful community service</li>
          </ul>
        </div>
      </section>
      <section className="section soft">
        <div className="wrap">
          <SectionHead eyebrow="What to expect" title="Learning That Moves From Conversation To Action" />
          <div className="three-col">
            <article>
              <h3>Facilitated sessions</h3>
              <p>Practical, accessible learning for women across Plateau State.</p>
            </article>
            <article>
              <h3>Community projects</h3>
              <p>Community-centred outcomes shaped around local realities.</p>
            </article>
            <article>
              <h3>Peer networks</h3>
              <p>Relationships that continue after the session ends.</p>
            </article>
          </div>
        </div>
      </section>
      {open ? <InterestModal onClose={() => setOpen(false)} /> : null}
    </main>
  );
}

export function MembershipView() {
  const media = useMedia();
  const [open, setOpen] = useState(0);
  return (
    <main>
      <PageHero eyebrow="Membership" title="Join A Growing Community of Women Ready to Make A Difference." text="Whether you are discovering civic participation or preparing to lead, there is a place to begin." image={media.event} />
      <section className="section wrap two-col">
        <div>
          <SectionHead eyebrow="Eligibility" title="Membership Begins With Shared Purpose" />
          <p>WIPI welcomes women from every educational, professional, faith and community background.</p>
        </div>
        <div className="requirements">
          {["Female and aged 18+", "Voter’s card or willingness to register", "Complete the registration UI", "Select a membership category", "Follow WIPI rules and guidelines", "Comply with uniform requirements"].map((item) => (
            <div key={item}>
              <span>
                <Icon name="check" />
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="membership-preview section">
        <div className="wrap">
          <SectionHead eyebrow="Membership" title="There Is A Place For You In WIPI" text="Choose the pathway that reflects your educational background or begin as a Community member." />
          <div className="tiers">
            {tiers.map((tier) => (
              <article key={tier.name} className={tier.featured ? "featured" : ""}>
                {tier.featured ? <span className="recommended">Recommended</span> : null}
                <span className="tier-index">{tier.index}</span>
                <h3>{tier.name}</h3>
                <strong>{tier.price}</strong>
                <p>{tier.text}</p>
                <ButtonLink href="/join" variant={tier.featured ? "primary" : "secondary"}>
                  Choose {tier.name}
                </ButtonLink>
              </article>
            ))}
          </div>
          <p className="fineprint">Membership contributions support WIPI’s organisational and community activities. No payment is processed on this prototype.</p>
        </div>
      </section>
      <section className="section wrap benefits">
        <SectionHead eyebrow="Member opportunities" title="Learn. Connect. Participate." />
        <div className="benefit-grid">
          {["Empowerment", "Training", "Mentorship", "Networking", "Political education", "Voter education", "Leadership support", "Qualifying programmes"].map((item) => (
            <div key={item}>
              <Icon name="check" />
              {item}
            </div>
          ))}
        </div>
        <p className="notice">
          <Icon name="shield" /> Specific grants and programmes may have separate eligibility requirements. Membership does not guarantee access.
        </p>
      </section>
      <section className="section soft">
        <div className="wrap faq-layout">
          <SectionHead eyebrow="Questions" title="Membership FAQs" text="Clear information to help you choose your next step." />
          <div className="accordions">
            {faqs.map(([question, answer], index) => (
              <div key={question} className={open === index ? "open" : ""}>
                <button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}>
                  <span>{question}</span>
                  <Icon name="chevron" />
                </button>
                {open === index ? <p>{answer}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}

export function ReachView() {
  const media = useMedia();
  const content = useSiteContent();
  const copy = liveCopy(content);
  return (
    <main>
      <PageHero eyebrow="Our Reach" title="Across Plateau. Growing Beyond Plateau." text="Local chapters create the relationships and context that turn a statewide vision into community action." image={media.map} />
      <section className="section wrap reach-page">
        <div className="reach-map-large">
          <img className="official-map" src={media.map} alt="Map of Plateau State showing all 17 Local Government Areas" />
        </div>
        <div>
          <SectionHead eyebrow="Find your chapter" title={copy.reachPageTitle} />
          <div className="lga-list">
            {content.lgas.map((lga, index) => (
              <Link key={lga.name} href={`/our-reach/${slugify(lga.name)}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {lga.name}
                <Icon name="arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}

export function LgaView({ slug }: { slug: string }) {
  const media = useMedia();
  const { lgas } = useSiteContent();
  const entry = lgas.find((item) => slugify(item.name) === slug);
  const name = entry?.name || slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  const phone = entry?.phone || "";
  return (
    <main>
      <PageHero eyebrow="WIPI Plateau State" title={`${name} LGA`} text="A local network helping women connect, learn and participate in community life." image={media.community} />
      <section className="section wrap">
        <div className="chapter-stats">
          <div>
            <small>Coordinator</small>
            <strong>{entry?.coordinator || "Pending confirmation"}</strong>
          </div>
          <div>
            <small>Reported members</small>
            <strong>{entry?.members || "—"}</strong>
          </div>
          <div>
            <small>Contact</small>
            <strong>{phone ? <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a> : "Pending confirmation"}</strong>
          </div>
        </div>
        <div className="two-col detail-copy">
          <div>
            <h3>Upcoming</h3>
            <h2>Chapter Activities</h2>
            <article className="event-row">
              <span>Leadership circle</span>
              <p>A local session for women preparing to participate in community decision-making.</p>
            </article>
          </div>
          <div>
            <h3>Recent work</h3>
            <h2>Programmes In This Chapter</h2>
            <p>Chapter teams host training, voter education and mentorship activities shaped around local priorities.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function LeadershipView() {
  const media = useMedia();
  const people = leaders.map((leader) => ({ ...leader, image: media.resolve(leader.image) }));
  const [person, setPerson] = useState<(typeof people)[number] | null>(null);
  const [lead, ...team] = people;
  return (
    <main>
      <PageHero eyebrow="Leadership" title="Women Building The Movement" text="Stewarding WIPI with purpose, accountability and a commitment to women’s meaningful participation." image={media.founder} />
      <section className="section wrap">
        <article className="leader-feature">
          <img src={lead.image} alt={`Portrait representing ${lead.name}`} />
          <div>
            <span className="eyebrow">{lead.role}</span>
            <h2>{lead.name}</h2>
            <p>{lead.bio}</p>
            <button className="btn btn-text" type="button" onClick={() => setPerson(lead)}>
              View profile <Icon name="arrow" />
            </button>
          </div>
        </article>
      </section>
      <section className="section soft">
        <div className="wrap">
          <SectionHead eyebrow="Executive team" title="Leading Together" text="Executive team information and portraits below are placeholders pending official confirmation." />
          <div className="team-grid">
            {team.map((member) => (
              <article key={member.name}>
                <img src={member.image} alt="" />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <button className="btn btn-text" type="button" onClick={() => setPerson(member)}>
                  View profile
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
      {person ? (
        <div className="modal" role="dialog" aria-modal="true" aria-label={person.name} onMouseDown={() => setPerson(null)}>
          <div className="modal-card profile-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="icon-btn" type="button" aria-label="Close" onClick={() => setPerson(null)}>
              <Icon name="close" />
            </button>
            <img src={person.image} alt="" />
            <h3>{person.name}</h3>
            <p>{person.role}</p>
            <p>{person.bio}</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export function NewsView() {
  const media = useMedia();
  const published = stories.map((story) => ({ ...story, image: media.resolve(story.image) }));
  const tabs = ["All", "News", "Events", "Training", "Advocacy", "Empowerment"];
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => published.filter((story) => (tab === "All" || story.tab === tab || story.category === tab) && story.title.toLowerCase().includes(query.toLowerCase())),
    [published, tab, query]
  );
  const featured = published[0];
  return (
    <main>
      <PageHero eyebrow="News & events" title="News, Programmes & Conversations From WIPI." text="Follow our work across Plateau State and find the next opportunity to participate." image={media.event} />
      <section className="section wrap">
        <div className="tabs">
          {tabs.map((item) => (
            <button key={item} type="button" className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" />
          <input aria-label="Search stories" placeholder="Search stories" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <article className="featured-story">
          <img src={featured.image} alt="Community leadership session" />
          <div>
            <span className="eyebrow light">Featured story</span>
            <small>{featured.date}</small>
            <h2>{featured.title.replace("WIPI Leadership Training Programme Expands Across Plateau State", "Leadership Training Expands Across Plateau State")}</h2>
            <p>{featured.featured}</p>
            <ButtonLink href="/news/leadership-training-expands" variant="light">
              Read the story
            </ButtonLink>
          </div>
        </article>
        <div className="news-all">
          {filtered.map((story) => (
            <article className="news-card" key={story.title}>
              <div className="news-image">
                <img src={story.image} alt="" />
                <span>{story.category}</span>
              </div>
              <small>{story.date}</small>
              <h3>{story.title}</h3>
              <ButtonLink href="/news/leadership-training-expands" variant="text">
                Read article <Icon name="arrow" />
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ArticleView() {
  const media = useMedia();
  return (
    <main>
      <PageHero eyebrow="Leadership • 12 February 2026" title="WIPI Leadership Training Programme Expands Across Plateau State" text="Community-based learning sessions are creating more accessible pathways for women to develop practical leadership skills." image={media.gathering} />
      <div className="article-image wrap">
        <img src={media.gathering} alt="Women participating in a learning session" />
      </div>
      <article className="article-body">
        <Link className="article-back" href="/news">
          ← All news
        </Link>
        <p className="lead">Women in Politics Initiative has expanded its leadership training programme, bringing practical civic and community leadership sessions closer to women across Plateau State.</p>
        <p>The sessions focus on public speaking, community organising, understanding local governance, peaceful participation and building networks of support.</p>
        <h2>Learning rooted in local realities</h2>
        <p>Each session combines facilitated learning with peer exchange. Participants consider the challenges and opportunities within their own communities, then identify actions they can take together.</p>
        <blockquote>“Meaningful participation begins when women have the information, relationships and confidence to contribute where decisions are made.”</blockquote>
        <p>WIPI will continue working with local chapters and partners to widen access to leadership development across all 17 LGAs.</p>
        <div className="share">
          <b>Share this story</b>
          <button type="button">f</button>
          <button type="button">in</button>
          <button type="button">x</button>
        </div>
      </article>
    </main>
  );
}

export function GalleryView() {
  const media = useMedia();
  const { gallery } = useSiteContent();
  const tabs = ["All", "Leadership", "Training", "Community", "Advocacy", "Events", "Empowerment"];
  const [tab, setTab] = useState("All");
  const [active, setActive] = useState<number | null>(null);
  const items = gallery.filter((item) => tab === "All" || item.category === tab);
  return (
    <main>
      <PageHero eyebrow="Gallery" title="WIPI In Action" text="Learning, organising and building stronger communities together." image={media.gathering} />
      <section className="section wrap">
        <div className="tabs gallery-tabs">
          {tabs.map((item) => (
            <button key={item} className={tab === item ? "active" : ""} type="button" onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="gallery-grid">
          {items.map((item, index) => (
            <button key={`${item.caption}-${index}`} type="button" onClick={() => setActive(index)}>
              <img src={item.image} alt={item.caption} />
              <span>
                <small>{item.category}</small>
                {item.caption}
              </span>
            </button>
          ))}
        </div>
      </section>
      {active !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={items[active].caption} onClick={() => setActive(null)}>
          <button className="lightbox-close" type="button" aria-label="Close" onClick={() => setActive(null)}>
            <Icon name="close" />
          </button>
          <img src={items[active].image} alt={items[active].caption} />
          <figcaption>
            {items[active].category} • Plateau State
            <br />
            {items[active].caption}
          </figcaption>
        </div>
      ) : null}
    </main>
  );
}

export function ContactView() {
  const media = useMedia();
  const { text } = useSiteContent();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = Object.fromEntries([...new FormData(event.currentTarget)].filter((entry): entry is [string, string] => typeof entry[1] === "string"));
    setPending(true);
    setError("");
    try {
      await sendSubmission("contact", data);
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not send your message.");
    } finally {
      setPending(false);
    }
  }
  return (
    <main>
      <PageHero eyebrow="Contact" title="Let’s Build A More Inclusive Future Together." text="Contact the WIPI team about membership, programmes, chapters or partnership." image={media.hands} />
      <section className="section wrap contact-grid">
        <div>
          <SectionHead eyebrow="Contact WIPI" title="We Would Be Glad To Hear From You" />
          <div className="contact-list">
            <div>
              <small>Visit</small>
              <p style={{ whiteSpace: "pre-line" }}>{text.contactAddress}</p>
            </div>
            <div>
              <small>Call or WhatsApp</small>
              <p>
                <a href={`tel:${text.contactPhone.replace(/\s/g, "")}`}>{text.contactPhone}</a>
              </p>
            </div>
            <div>
              <small>Email</small>
              <p>
                <a href={`mailto:${text.contactEmail}`}>{text.contactEmail}</a>
                <br />
                <a href={`mailto:${text.membershipEmail}`}>{text.membershipEmail}</a>
              </p>
            </div>
          </div>
        </div>
        {sent ? (
          <Success compact />
        ) : (
          <form className="contact-form" onSubmit={submit}>
            <Field label="Name" required />
            <Field label="Email" type="email" required />
            <Field label="Phone" required />
            <Field label="Subject" required />
            <label className="field full">
              <span>Message</span>
              <textarea name="message" required rows={5} placeholder="Message" />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send message"} <Icon name="arrow" />
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export function PartnerView() {
  const media = useMedia();
  const { partnerships } = useSiteContent();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <main>
      <PageHero eyebrow="Partnership" title="Partner With Us To Expand Women’s Participation" text="Build locally credible, sustainable programmes with a statewide women’s network." image={media.hands} />
      <section className="section wrap two-col">
        <div>
          <SectionHead eyebrow="Why WIPI" title="Local Reach. Shared Purpose. Practical Action." />
          <button className="btn btn-primary" type="button" onClick={() => document.getElementById("partner-form")?.scrollIntoView({ behavior: "smooth" })}>
            Start a conversation
          </button>
        </div>
        <div className="partner-types">
          {["Government", "NGOs", "International development partners", "Corporate organisations", "Educational institutions", "Civil society", "Community organisations"].map((item) => (
            <p key={item}>
              <Icon name="check" /> {item}
            </p>
          ))}
        </div>
      </section>
      {partnerships.length ? (
        <section className="section wrap">
          <SectionHead eyebrow="Partners" title="Working Alongside WIPI" />
          <div className="partner-board">
            {partnerships.map((partner) => (
              <p key={partner.id}>
                {partner.image ? <img src={partner.image} alt="" /> : null}
                {partner.name}
              </p>
            ))}
          </div>
        </section>
      ) : null}
      <section className="section soft">
        <div className="wrap">
          <SectionHead eyebrow="Partnership areas" title="Where We Can Work Together" />
          <div className="objective-grid">
            {["Leadership programmes", "Grants", "Voter education", "Peacebuilding", "Economic empowerment", "Training", "Advocacy", "Research", "Community programmes"].map((item) => (
              <article key={item}>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section wrap" id="partner-form">
        {sent ? (
          <Success compact />
        ) : (
          <form
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!event.currentTarget.reportValidity()) return;
              const data = Object.fromEntries([...new FormData(event.currentTarget)].filter((entry): entry is [string, string] => typeof entry[1] === "string"));
              setPending(true);
              setError("");
              try {
                await sendSubmission("partner", data);
                setSent(true);
              } catch (reason) {
                setError(reason instanceof Error ? reason.message : "Could not send your enquiry.");
              } finally {
                setPending(false);
              }
            }}
          >
            <h2>Partnership enquiry</h2>
            <Field label="Organisation" required />
            <Field label="Contact person" required />
            <Field label="Email" type="email" required />
            <Field label="Phone" required />
            <Field label="Organisation type" options={["NGO", "Development partner", "Business", "Education", "Community", "Government"]} required />
            <Field label="Partnership interest" options={["Leadership programmes", "Voter education", "Peacebuilding", "Economic empowerment", "Training"]} required />
            <label className="field full">
              <span>Message</span>
              <textarea name="message" className="full" rows={5} required placeholder="How would you like to work with WIPI?" />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send enquiry"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export function UniformView() {
  const media = useMedia();
  const [open, setOpen] = useState(false);
  return (
    <main>
      <PageHero eyebrow="Membership uniform" title="One Identity. One Community." text="WIPI uniform creates a shared identity at designated official activities." image={media.event} />
      <section className="section wrap">
        <div className="notice">
          <Icon name="shield" /> Uniform is mandatory for all membership categories when attending designated official WIPI activities.
        </div>
        <div className="product-grid">
          {uniforms.map(([name, price], index) => (
            <article key={name}>
              <div className={`product-mock p${index}`}>
                <Brand />
              </div>
              <h3>{name}</h3>
              <strong>{price}</strong>
              <button className="btn btn-text" type="button" onClick={() => setOpen(true)}>
                Enquire <Icon name="arrow" />
              </button>
            </article>
          ))}
        </div>
      </section>
      {open ? <InterestModal title="Uniform Enquiry" onClose={() => setOpen(false)} /> : null}
    </main>
  );
}

const steps = ["Personal information", "Location", "Education", "Civic participation", "Membership", "Confirmation"];
const education = ["No formal education", "Primary", "SSCE", "NCE", "Diploma", "HND", "Bachelor's degree", "Master's degree", "Doctorate", "Professional qualification", "Other"];

export function JoinView() {
  const { lgas, bank } = useSiteContent();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [shot, setShot] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const paid = Boolean(values.tier && values.tier !== "Community");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const next = { ...values };
    for (const [key, value] of new FormData(form).entries()) {
      if (typeof value === "string" && value) next[key] = value;
    }
    if (step < 6) {
      setValues(next);
      setStep(step + 1);
      setError("");
      return;
    }
    if (paid && bank.accountNumber && !shot) {
      setError("Upload a screenshot of your transfer so the team can confirm it.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await sendSubmission("membership", next, shot);
      setDone(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not submit your registration.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <main className="success-page">
        <Success note="Your registration is with the WIPI team. If you uploaded a payment screenshot, they will confirm it." />
        <div className="button-row">
          <ButtonLink href="/">Return home</ButtonLink>
          <ButtonLink href="/programmes" variant="secondary">
            Explore programmes
          </ButtonLink>
        </div>
      </main>
    );
  }
  return (
    <main className="join-page">
      <div className="join-side">
        <Brand />
        <span className="eyebrow light">Membership registration</span>
        <h1>Your Journey With WIPI Starts Here.</h1>
        <p>Share your details, choose a membership category, and send proof of payment if a contribution applies.</p>
        <div className="join-progress">
          {steps.map((label, index) => (
            <div key={label} className={step === index + 1 ? "active" : step > index + 1 ? "complete" : ""}>
              <span>{step > index + 1 ? <Icon name="check" size={15} /> : index + 1}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="join-form">
        <Link className="back-site" href="/membership">
          ← Back to membership
        </Link>
        <div className="step-count">Step {step} of 6</div>
        <form onSubmit={submit}>
          <div className="form-step">
            <span className="eyebrow">Join WIPI</span>
            {step === 1 ? (
              <>
                <h2>Tell us about yourself</h2>
                <p>Use the information you would want associated with your membership.</p>
                <div className="form-grid">
                  <Field label="First name" required defaultValue={values["first-name"]} />
                  <Field label="Middle name" defaultValue={values["middle-name"]} />
                  <Field label="Last name" required defaultValue={values["last-name"]} />
                  <Field label="Date of birth" type="date" required defaultValue={values["date-of-birth"]} />
                  <Field label="Phone" required defaultValue={values.phone} />
                  <Field label="WhatsApp number" defaultValue={values["whatsapp-number"]} />
                  <Field label="Email" type="email" required defaultValue={values.email} />
                  <Field label="Residential address" required defaultValue={values["residential-address"]} />
                </div>
              </>
            ) : null}
            {step === 2 ? (
              <>
                <h2>Where are you located?</h2>
                <p>This helps connect members to the most relevant LGA chapter.</p>
                <div className="form-grid">
                  <Field label="State" options={["Plateau State"]} required defaultValue={values.state} />
                  <Field label="LGA" options={lgas.map((item) => item.name)} required defaultValue={values.lga} />
                  <Field label="Ward" defaultValue={values.ward} />
                  <Field label="Community" defaultValue={values.community} />
                </div>
              </>
            ) : null}
            {step === 3 ? (
              <>
                <h2>Educational background</h2>
                <p>Your selection helps suggest a membership category.</p>
                <div className="choice-list">
                  {education.map((item) => (
                    <label key={item}>
                      <input type="radio" name="education" value={item} defaultChecked={values.education === item} required />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </>
            ) : null}
            {step === 4 ? (
              <>
                <h2>Civic participation</h2>
                <p>WIPI supports informed and responsible participation.</p>
                <h3>Do you have a valid voter’s card?</h3>
                <div className="choice-list horizontal">
                  {["Yes", "No", "Registration in progress"].map((item) => (
                    <label key={item}>
                      <input type="radio" name="voter" value={item} defaultChecked={values.voter === item} required />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                <label className="check-field">
                  <input type="checkbox" name="voter-education" value="Yes" defaultChecked={values["voter-education"] === "Yes"} /> I would like to receive voter education information.
                </label>
              </>
            ) : null}
            {step === 5 ? (
              <>
                <h2>Choose your membership</h2>
                <p>Paid categories are confirmed by bank transfer. Community membership is free.</p>
                <div className="join-tiers">
                  {[["Bronze", "₦2,000"], ["Silver", "₦5,000"], ["Gold", "₦10,000"], ["Community", "Free"]].map((item, index) => (
                    <label key={item[0]} className={index === 2 ? "suggested" : ""}>
                      <input type="radio" name="tier" value={item[0]} defaultChecked={values.tier ? values.tier === item[0] : index === 2} required />
                      <span>
                        {index === 2 ? <small>Suggested</small> : null}
                        <b>{item[0]}</b>
                        <strong>{item[1]}</strong>
                      </span>
                    </label>
                  ))}
                </div>
              </>
            ) : null}
            {step === 6 ? (
              <>
                <h2>Confirm your registration</h2>
                <p>Review your details, then send them to the WIPI team.</p>
                <div className="confirmation-card">
                  <h3>Membership summary</h3>
                  <p>
                    <span>Name</span> {[values["first-name"], values["last-name"]].filter(Boolean).join(" ")}
                  </p>
                  <p>
                    <span>LGA</span> {values.lga || "Plateau State"}
                  </p>
                  <p>
                    <span>Category</span> {values.tier || "Gold"}
                  </p>
                </div>
                {paid && bank.accountNumber ? (
                  <div className="bank-card">
                    <h3>Pay by transfer</h3>
                    <p>{bank.instructions}</p>
                    <p>
                      <span>Bank</span> {bank.bankName}
                    </p>
                    <p>
                      <span>Account name</span> {bank.accountName}
                    </p>
                    <p>
                      <span>Account number</span> <strong>{bank.accountNumber}</strong>
                      <button
                        className="btn btn-text"
                        type="button"
                        onClick={() => navigator.clipboard.writeText(bank.accountNumber)}
                      >
                        Copy
                      </button>
                    </p>
                    <label className="field">
                      <span>Payment screenshot</span>
                      <input accept="image/jpeg,image/png,image/webp,image/gif" type="file" onChange={(event) => setShot(event.target.files?.[0] || null)} />
                    </label>
                    {shot ? <small>{shot.name}</small> : null}
                  </div>
                ) : null}
                {paid && !bank.accountNumber ? <p>Bank details are not published yet. You can still submit, and the membership team will contact you about payment.</p> : null}
                {["I confirm the information provided is correct.", "I agree to WIPI’s membership guidelines.", "I understand that membership does not guarantee access to grants or political positions."].map((item) => (
                  <label className="check-field" key={item}>
                    <input type="checkbox" required /> {item}
                  </label>
                ))}
              </>
            ) : null}
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-actions">
            <button className="btn btn-secondary" type="button" disabled={step === 1 || pending} onClick={() => setStep(step - 1)}>
              Back
            </button>
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? "Sending…" : step === 6 ? "Submit registration" : "Continue"} <Icon name="arrow" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export function LegalView({ type }: { type: keyof typeof legal }) {
  const media = useMedia();
  const content = legal[type];
  return (
    <main>
      <PageHero eyebrow="WIPI Information" title={content[1]} image={media.hands} />
      <section className="legal section wrap">
        <span className="eyebrow">{content[0]}</span>
        <h2>{content[0]}</h2>
        <p className="lead">{content[2]}</p>
        {type === "faqs" ? (
          <div className="accordions">
            {faqs.map(([question, answer]) => (
              <div key={question} className="open">
                <button type="button">
                  <span>{question}</span>
                </button>
                <p>{answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <h3>Our commitment</h3>
            <p>We aim to communicate clearly, protect trust and create an inclusive experience for every visitor. This content will be reviewed before production publication.</p>
          </>
        )}
        <ButtonLink href="/contact" variant="secondary">
          Contact WIPI
        </ButtonLink>
      </section>
    </main>
  );
}
