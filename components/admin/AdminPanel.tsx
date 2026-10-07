"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { liveCopy, originalCopy } from "@/lib/copy";
import { formatNaira, membershipRevenue, tierRequiresPayment } from "@/lib/plans";
import { Icon } from "../Icon";
import { imageSlots, type GalleryExtra, type LgaEntry, type MailSend, type MembershipPlan, type PublicContent, type SiteText, type Submission, type Subscriber } from "@/lib/site-types";

type Section = "overview" | "text" | "images" | "movement" | "partners" | "plans" | "submissions" | "payments" | "mail";

const nav: [Section, string][] = [
  ["overview", "Overview"],
  ["text", "Text"],
  ["images", "Images & logo"],
  ["movement", "Members & LGAs"],
  ["partners", "Partnerships"],
  ["plans", "Membership"],
  ["submissions", "Submissions"],
  ["payments", "Bank & payments"],
  ["mail", "Bulk email"]
];

const textFields: { key: keyof SiteText; label: string; rows?: number; hint?: string }[] = [
  { key: "announcement", label: "Announcement bar", hint: "The original sentence stays in sync with the number of LGAs." },
  { key: "mission", label: "Mission", rows: 4 },
  { key: "vision", label: "Vision", rows: 4 },
  { key: "introTitle", label: "Homepage introduction title" },
  { key: "introText", label: "Homepage introduction", rows: 3 },
  { key: "introBody", label: "Homepage introduction, continued", rows: 3 },
  { key: "reachTitle", label: "Reach title", hint: "The original title stays in sync with the number of LGAs." },
  { key: "reachText", label: "Reach description", rows: 3 },
  { key: "reachPageTitle", label: "Our Reach page title" },
  { key: "aboutToday", label: "About page — membership sentence", rows: 3, hint: "The original sentence stays in sync with members and LGAs." },
  { key: "founderName", label: "Founder name" },
  { key: "founderRole", label: "Founder role" },
  { key: "founderQuote", label: "Founder quote", rows: 3 },
  { key: "founderBio", label: "Founder biography", rows: 3 },
  { key: "newsletterTitle", label: "Updates heading" },
  { key: "newsletterText", label: "Updates description" },
  { key: "contactAddress", label: "Visit address", rows: 3 },
  { key: "contactPhone", label: "Phone" },
  { key: "contactEmail", label: "Email" },
  { key: "membershipEmail", label: "Membership email" }
];

const galleryCategories = ["Leadership", "Training", "Community", "Advocacy", "Events", "Empowerment"];

function when(value: string) {
  return new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

function labelFor(key: string) {
  return key.replace(/-/g, " ");
}

async function uploadFile(file: File) {
  const body = new FormData();
  body.set("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!response.ok || !payload?.url) throw new Error(payload?.error || "Upload failed.");
  return payload.url;
}

export function AdminPanel() {
  const [section, setSection] = useState<Section>("overview");
  const [content, setContent] = useState<PublicContent | null>(null);
  const [baseline, setBaseline] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [submissionEmails, setSubmissionEmails] = useState<string[]>([]);
  const [sends, setSends] = useState<MailSend[]>([]);
  const [services, setServices] = useState({ images: false, email: false, database: false });
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function load() {
    const [contentResponse, submissionResponse, mailResponse] = await Promise.all([
      fetch("/api/admin/content"),
      fetch("/api/admin/submissions"),
      fetch("/api/admin/newsletter")
    ]);
    if (contentResponse.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const contentPayload = await contentResponse.json();
    const submissionPayload = await submissionResponse.json();
    const mailPayload = await mailResponse.json();
    if (!contentResponse.ok) throw new Error(contentPayload.error || "Could not load the admin panel.");
    setContent(contentPayload.content);
    setBaseline(JSON.stringify(contentPayload.content));
    setServices(contentPayload.services);
    setSubmissions(submissionPayload.submissions || []);
    setSubscribers(mailPayload.subscribers || []);
    setSubmissionEmails(mailPayload.submissionEmails || []);
    setSends(mailPayload.sends || []);
    setReady(true);
  }

  useEffect(() => {
    load().catch(() => setError("Could not load the admin panel."));
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function openSection(id: Section) {
    setSection(id);
    setMenuOpen(false);
  }

  const dirty = content ? JSON.stringify(content) !== baseline : false;
  const filtered = submissions.filter((item) => filter === "all" || item.type === filter);
  const payments = submissions.filter((item) => item.type === "membership");
  const preview = content ? liveCopy(content) : null;

  async function save() {
    if (!content) return;
    setPending(true);
    setError("");
    setNotice("");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(payload.error || "Could not save.");
      return;
    }
    setContent(payload.content);
    setBaseline(JSON.stringify(payload.content));
    setNotice("Saved. The public site is using these changes.");
  }

  function updateText(key: keyof SiteText, value: string) {
    setContent((current) => (current ? { ...current, text: { ...current.text, [key]: value } } : current));
  }

  async function onUpload(file: File, apply: (url: string) => void) {
    setError("");
    try {
      apply(await uploadFile(file));
      setNotice("Image uploaded. Save changes to publish it.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (!ready || !content || !preview) {
    return (
      <main className="admin-app">
        <p className="admin-loading">{error || "Loading admin…"}</p>
      </main>
    );
  }

  return (
    <main className="admin-app">
      <header className="admin-top">
        <button className="admin-menu" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <p className="admin-mark">WIPI</p>
        <a href="/" target="_blank" rel="noreferrer">
          View site
        </a>
      </header>
      {menuOpen ? <button className="admin-scrim" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} /> : null}
      <aside className={menuOpen ? "open" : ""}>
        <p className="admin-mark">WIPI</p>
        <small>Admin</small>
        <nav aria-label="Admin">
          {nav.map(([id, label]) => (
            <button key={id} type="button" className={section === id ? "active" : ""} onClick={() => openSection(id)}>
              {label}
              {id === "submissions" && submissions.some((item) => item.status === "new") ? <em>{submissions.filter((item) => item.status === "new").length}</em> : null}
            </button>
          ))}
        </nav>
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </aside>
      <div className="admin-main">
        <header>
          <div>
            <p>Women in Politics Initiative</p>
            <h1>{nav.find(([id]) => id === section)?.[1]}</h1>
          </div>
          <a href="/" target="_blank" rel="noreferrer">
            View site
          </a>
        </header>
        {!services.database || !services.images || !services.email ? (
          <div className="admin-banner">
            {!services.database ? <p>Supabase is not configured, so records are stored on this server. Add DATABASE_URL from the session pooler.</p> : null}
            {!services.images ? <p>Cloudinary is not configured, so images are stored on this server. Add the Cloudinary variables to keep them in Cloudinary.</p> : null}
            {!services.email ? <p>Bulk email needs RESEND_API_KEY and RESEND_FROM before a send can leave this panel.</p> : null}
          </div>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        {notice ? <p className="admin-notice">{notice}</p> : null}

        {section === "overview" ? (
          <section className="admin-grid">
            <button type="button" onClick={() => openSection("movement")}>
              <strong>{content.reportedMembers.toLocaleString("en-NG")}+</strong>
              <span>Reported members</span>
            </button>
            <button type="button" onClick={() => openSection("movement")}>
              <strong>{content.lgas.length}</strong>
              <span>Local government areas</span>
            </button>
            <button type="button" onClick={() => openSection("partners")}>
              <strong>{content.partnerships.length}</strong>
              <span>Partnerships</span>
            </button>
            <button type="button" onClick={() => openSection("plans")}>
              <strong>{content.plans.length}</strong>
              <span>Membership plans</span>
            </button>
            <button type="button" onClick={() => openSection("submissions")}>
              <strong>{submissions.filter((item) => item.status === "new").length}</strong>
              <span>New submissions</span>
            </button>
            <button type="button" onClick={() => openSection("payments")}>
              <strong>{payments.filter((item) => item.paymentScreenshot).length}</strong>
              <span>Payment screenshots</span>
            </button>
            <button type="button" onClick={() => openSection("mail")}>
              <strong>{subscribers.length}</strong>
              <span>Update subscribers</span>
            </button>
          </section>
        ) : null}

        {section === "text" ? (
          <section className="admin-stack">
            {textFields.map((field) => (
              <label key={field.key}>
                {field.label}
                {field.rows ? (
                  <textarea rows={field.rows} value={content.text[field.key]} onChange={(event) => updateText(field.key, event.target.value)} />
                ) : (
                  <input value={content.text[field.key]} onChange={(event) => updateText(field.key, event.target.value)} />
                )}
                {field.hint && content.text[field.key] === originalCopy[field.key as keyof typeof originalCopy] ? <small>{field.hint} Currently: {preview[field.key === "announcement" ? "announcement" : field.key === "reachTitle" ? "reachTitle" : field.key === "reachPageTitle" ? "reachPageTitle" : "aboutToday"]}</small> : null}
              </label>
            ))}
            <h2>Homepage slides</h2>
            {content.heroes.map((hero, index) => (
              <fieldset key={hero.image + index}>
                <legend>Slide {index + 1}</legend>
                <label>
                  Label
                  <input
                    value={hero.label}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        heroes: content.heroes.map((item, itemIndex) => (itemIndex === index ? { ...item, label: event.target.value } : item))
                      })
                    }
                  />
                </label>
                <label>
                  Title, first line
                  <input
                    value={hero.title[0]}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        heroes: content.heroes.map((item, itemIndex) => (itemIndex === index ? { ...item, title: [event.target.value, item.title[1]] } : item))
                      })
                    }
                  />
                </label>
                <label>
                  Title, second line
                  <input
                    value={hero.title[1]}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        heroes: content.heroes.map((item, itemIndex) => (itemIndex === index ? { ...item, title: [item.title[0], event.target.value] } : item))
                      })
                    }
                  />
                </label>
                <label>
                  Text
                  <textarea
                    rows={3}
                    value={hero.text}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        heroes: content.heroes.map((item, itemIndex) => (itemIndex === index ? { ...item, text: event.target.value } : item))
                      })
                    }
                  />
                </label>
                {index === 2 && hero.label === originalCopy.heroReach ? <small>This label stays in sync with the member and LGA figures. Currently: {preview.heroLabel(hero.label)}</small> : null}
              </fieldset>
            ))}
          </section>
        ) : null}

        {section === "images" ? (
          <section className="admin-stack">
            <div className="logo-editor">
              <img src={content.images.logo} alt="Current WIPI logo" />
              <div>
                <h2>Logo</h2>
                <p>This replaces the mark in the header, footer and registration page.</p>
                <label className="file-btn">
                  Change logo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      onUpload(file, (url) => setContent((current) => (current ? { ...current, images: { ...current.images, logo: url } } : current)));
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="image-grid">
              {imageSlots
                .filter(([slot]) => slot !== "logo")
                .map(([slot, label]) => (
                  <label key={slot} className="image-card">
                    <img src={content.images[slot]} alt="" />
                    <span>{label}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        onUpload(file, (url) => setContent((current) => (current ? { ...current, images: { ...current.images, [slot]: url } } : current)));
                      }}
                    />
                  </label>
                ))}
            </div>
            <h2>Add a gallery image</h2>
            <GalleryAdder
              onAdd={(item) => setContent({ ...content, galleryExtra: [item, ...content.galleryExtra] })}
              onUpload={onUpload}
            />
            <div className="image-grid">
              {content.galleryExtra.map((item) => (
                <article key={item.id} className="image-card">
                  <img src={item.image} alt="" />
                  <span>{item.caption}</span>
                  <small>{item.category}</small>
                  <button type="button" onClick={() => setContent({ ...content, galleryExtra: content.galleryExtra.filter((image) => image.id !== item.id) })}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {section === "movement" ? (
          <section className="admin-stack">
            <div className="split-fields">
              <label>
                Reported members
                <input
                  type="number"
                  min={0}
                  value={content.reportedMembers}
                  onChange={(event) => setContent({ ...content, reportedMembers: Number(event.target.value) })}
                />
              </label>
              <label>
                Established year
                <input
                  type="number"
                  min={1900}
                  max={2100}
                  value={content.establishedYear}
                  onChange={(event) => setContent({ ...content, establishedYear: Number(event.target.value) })}
                />
              </label>
            </div>
            <p className="admin-help">The homepage counters use these figures. Leave the original reach and about sentences unchanged if you want them to follow the numbers.</p>
            <h2>Local government areas</h2>
            {content.lgas.map((lga, index) => (
              <div className="record-row" key={`${lga.name}-${index}`}>
                <input aria-label="LGA name" value={lga.name} onChange={(event) => setContent({ ...content, lgas: replaceLga(content.lgas, index, { name: event.target.value }) })} />
                <input aria-label="Reported members" value={lga.members} placeholder="Reported members" onChange={(event) => setContent({ ...content, lgas: replaceLga(content.lgas, index, { members: event.target.value }) })} />
                <input aria-label="Coordinator" value={lga.coordinator} placeholder="Coordinator" onChange={(event) => setContent({ ...content, lgas: replaceLga(content.lgas, index, { coordinator: event.target.value }) })} />
                <input aria-label="Phone" value={lga.phone} placeholder="Phone" onChange={(event) => setContent({ ...content, lgas: replaceLga(content.lgas, index, { phone: event.target.value }) })} />
                <button type="button" onClick={() => setContent({ ...content, lgas: content.lgas.filter((_, itemIndex) => itemIndex !== index) })}>
                  Remove
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setContent({ ...content, lgas: [...content.lgas, { name: "", members: "", coordinator: "", phone: "" }] })}
            >
              Add local government area
            </button>
          </section>
        ) : null}

        {section === "partners" ? (
          <section className="admin-stack">
            <p className="admin-help">Each partner appears with a round photo beside the name.</p>
            {content.partnerships.map((partner, index) => (
              <div className="partner-edit" key={partner.id}>
                <span className="dp">{partner.image ? <img src={partner.image} alt="" /> : partner.name.slice(0, 1) || "W"}</span>
                <input
                  aria-label="Partner name"
                  value={partner.name}
                  onChange={(event) =>
                    setContent({
                      ...content,
                      partnerships: content.partnerships.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item))
                    })
                  }
                />
                <label className="file-btn">
                  {partner.image ? "Replace photo" : "Add photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      onUpload(file, (url) =>
                        setContent((current) =>
                          current
                            ? {
                                ...current,
                                partnerships: current.partnerships.map((item, itemIndex) => (itemIndex === index ? { ...item, image: url } : item))
                              }
                            : current
                        )
                      );
                    }}
                  />
                </label>
                <button type="button" onClick={() => setContent({ ...content, partnerships: content.partnerships.filter((item) => item.id !== partner.id) })}>
                  Remove
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setContent({ ...content, partnerships: [...content.partnerships, { id: crypto.randomUUID(), name: "", image: "" }] })}
            >
              Add partnership
            </button>
          </section>
        ) : null}

        {section === "plans" ? (
          <PlanEditor
            plans={content.plans}
            submissions={submissions}
            onChange={(plans) => setContent({ ...content, plans })}
          />
        ) : null}

        {section === "submissions" ? <SubmissionList items={filtered} plans={content.plans} filter={filter} setFilter={setFilter} onChange={setSubmissions} setError={setError} setNotice={setNotice} /> : null}

        {section === "payments" ? (
          <section className="admin-stack">
            <h2>Bank details</h2>
            <p className="admin-help">Members see these details after they choose a paid membership. They pay, then submit the transfer screenshot with their registration.</p>
            <label>
              Bank name
              <input value={content.bank.bankName} onChange={(event) => setContent({ ...content, bank: { ...content.bank, bankName: event.target.value } })} />
            </label>
            <label>
              Account name
              <input value={content.bank.accountName} onChange={(event) => setContent({ ...content, bank: { ...content.bank, accountName: event.target.value } })} />
            </label>
            <label>
              Account number
              <input value={content.bank.accountNumber} onChange={(event) => setContent({ ...content, bank: { ...content.bank, accountNumber: event.target.value } })} />
            </label>
            <label>
              Instructions
              <textarea rows={3} value={content.bank.instructions} onChange={(event) => setContent({ ...content, bank: { ...content.bank, instructions: event.target.value } })} />
            </label>
            <h2>Payment confirmations</h2>
            {payments.length === 0 ? <p>No membership submissions yet.</p> : null}
            {payments.map((item) => (
              <article className="submission-card" key={item.id}>
                <header>
                  <strong>{item.data["first-name"] || "Member"} {item.data["last-name"] || ""}</strong>
                  <span>{when(item.createdAt)}</span>
                </header>
                <p>{item.data.tier || "Membership"} · {item.data.lga || "LGA not stated"}</p>
                <p>{item.data.email || "No email address"}</p>
                {item.paymentScreenshot ? <a href={item.paymentScreenshot} target="_blank" rel="noreferrer"><img src={item.paymentScreenshot} alt="Payment screenshot" /></a> : <p>No screenshot submitted.</p>}
                <ConfirmPayment item={item} plans={content.plans} onDone={(submission) => setSubmissions((current) => current.map((entry) => (entry.id === submission.id ? submission : entry)))} setError={setError} setNotice={setNotice} />
              </article>
            ))}
          </section>
        ) : null}

        {section === "mail" ? (
          <MailDesk
            title={content.text.newsletterTitle}
            text={content.text.newsletterText}
            subscribers={subscribers}
            submissionEmails={submissionEmails}
            sends={sends}
            emailReady={services.email}
            onRemove={async (email) => {
              await fetch("/api/admin/newsletter", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
              setSubscribers((current) => current.filter((item) => item.email !== email));
            }}
            onSent={(send) => setSends((current) => [send, ...current])}
            setError={setError}
            setNotice={setNotice}
          />
        ) : null}

        {dirty && section !== "submissions" && section !== "mail" && section !== "overview" ? (
          <div className="save-bar">
            <span>You have unsaved changes.</span>
            <button type="button" onClick={() => content && setContent(JSON.parse(baseline) as PublicContent)}>
              Discard
            </button>
            <button className="btn btn-primary" type="button" disabled={pending} onClick={save}>
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function moveItem<T>(list: T[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
}

function PlanEditor({ plans, submissions, onChange }: { plans: MembershipPlan[]; submissions: Submission[]; onChange: (plans: MembershipPlan[]) => void }) {
  const revenue = membershipRevenue(submissions, plans);
  return (
    <section className="admin-stack">
      <article className="revenue-card">
        <span>Confirmed revenue</span>
        <strong>{formatNaira(revenue.total)}</strong>
        <p>
          {revenue.count} confirmed {revenue.count === 1 ? "membership" : "memberships"}. This total updates when a payment is confirmed.
        </p>
      </article>
      <p className="admin-help">These plans appear on the homepage, the membership page, and the registration form. Mark one as recommended. Use Free, or leave the price empty, when no transfer is required.</p>
      {plans.map((plan, index) => (
        <fieldset className="plan-card" key={plan.id}>
          <legend>Plan {String(index + 1).padStart(2, "0")}</legend>
          <label>
            Name
            <input aria-label="Plan name" value={plan.name} onChange={(event) => onChange(plans.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)))} />
          </label>
          <label>
            Price
            <input aria-label="Plan price" value={plan.price} placeholder="₦2,000 or Free" onChange={(event) => onChange(plans.map((item, itemIndex) => (itemIndex === index ? { ...item, price: event.target.value } : item)))} />
          </label>
          <label>
            Description
            <textarea rows={3} aria-label="Plan description" value={plan.text} onChange={(event) => onChange(plans.map((item, itemIndex) => (itemIndex === index ? { ...item, text: event.target.value } : item)))} />
          </label>
          <div className="plan-actions">
            <label className="plan-flag">
              <input
                type="checkbox"
                checked={plan.featured}
                onChange={(event) =>
                  onChange(
                    plans.map((item, itemIndex) => ({
                      ...item,
                      featured: event.target.checked ? itemIndex === index : itemIndex === index ? false : item.featured
                    }))
                  )
                }
              />
              Recommended
            </label>
            <button type="button" disabled={index === 0} onClick={() => onChange(moveItem(plans, index, -1))}>
              Move up
            </button>
            <button type="button" disabled={index === plans.length - 1} onClick={() => onChange(moveItem(plans, index, 1))}>
              Move down
            </button>
            <button type="button" onClick={() => onChange(plans.filter((item) => item.id !== plan.id))}>
              Remove
            </button>
          </div>
        </fieldset>
      ))}
      <button
        className="btn btn-secondary"
        type="button"
        onClick={() => onChange([...plans, { id: crypto.randomUUID(), name: "", price: "", text: "", featured: false }])}
      >
        Add plan
      </button>
    </section>
  );
}

function ConfirmPayment({
  item,
  plans,
  onDone,
  setError,
  setNotice
}: {
  item: Submission;
  plans: MembershipPlan[];
  onDone: (submission: Submission) => void;
  setError: (value: string) => void;
  setNotice: (value: string) => void;
}) {
  const [pending, setPending] = useState(false);
  if (!tierRequiresPayment(item.data.tier || "", plans)) return null;
  if (item.paymentConfirmed) return <p className="paid-note">Payment confirmed. The member has been emailed.</p>;
  return (
    <button
      className="btn btn-primary"
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        setError("");
        try {
          const response = await fetch("/api/admin/submissions", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id, confirmPayment: true })
          });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload.error || "Could not confirm this payment.");
          onDone(payload.submission);
          setNotice(payload.emailed ? "Confirmation email sent." : payload.emailError || "Payment confirmed, but the email was not sent.");
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "Could not confirm this payment.");
        } finally {
          setPending(false);
        }
      }}
    >
      {pending ? "Sending…" : "Confirm payment"}
    </button>
  );
}

function replaceLga(list: LgaEntry[], index: number, patch: Partial<LgaEntry>) {
  return list.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
}

function GalleryAdder({ onAdd, onUpload }: { onAdd: (item: GalleryExtra) => void; onUpload: (file: File, apply: (url: string) => void) => void }) {
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(galleryCategories[0]);
  const [image, setImage] = useState("");
  return (
    <div className="record-row">
      <input aria-label="Caption" placeholder="Caption" value={caption} onChange={(event) => setCaption(event.target.value)} />
      <select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value)}>
        {galleryCategories.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <label className="file-btn">
        {image ? "Photo ready" : "Choose photo"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            onUpload(file, setImage);
          }}
        />
      </label>
      <button
        className="btn btn-secondary"
        type="button"
        disabled={!image || !caption.trim()}
        onClick={() => {
          onAdd({ id: crypto.randomUUID(), image, caption: caption.trim(), category });
          setCaption("");
          setImage("");
        }}
      >
        Add image
      </button>
    </div>
  );
}

function SubmissionList({
  items,
  plans,
  filter,
  setFilter,
  onChange,
  setError,
  setNotice
}: {
  items: Submission[];
  plans: MembershipPlan[];
  filter: string;
  setFilter: (value: string) => void;
  onChange: (items: Submission[] | ((current: Submission[]) => Submission[])) => void;
  setError: (value: string) => void;
  setNotice: (value: string) => void;
}) {
  const filters = ["all", "membership", "contact", "partner", "interest"];
  return (
    <section className="admin-stack">
      <div className="filter-row">
        {filters.map((item) => (
          <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>
      {items.length === 0 ? <p>No submissions in this view.</p> : null}
      {items.map((item) => (
        <article className="submission-card" key={item.id}>
          <header>
            <strong>{item.type}</strong>
            <span>{when(item.createdAt)}</span>
            <em className={item.status}>{item.status}</em>
          </header>
          <dl>
            {Object.entries(item.data).map(([key, value]) => (
              <div key={key}>
                <dt>{labelFor(key)}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {item.paymentScreenshot ? (
            <a href={item.paymentScreenshot} target="_blank" rel="noreferrer">
              <img src={item.paymentScreenshot} alt="Payment screenshot" />
            </a>
          ) : null}
          <div className="card-actions">
            {item.type === "membership" ? (
              <ConfirmPayment
                item={item}
                plans={plans}
                onDone={(submission) => onChange((current) => current.map((entry) => (entry.id === submission.id ? submission : entry)))}
                setError={setError}
                setNotice={setNotice}
              />
            ) : null}
            <button
              type="button"
              onClick={async () => {
                const status = item.status === "new" ? "reviewed" : "new";
                const response = await fetch("/api/admin/submissions", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: item.id, status })
                });
                const payload = await response.json();
                if (!response.ok) {
                  setError(payload.error || "Could not update this submission.");
                  return;
                }
                onChange((current) => current.map((entry) => (entry.id === item.id ? payload.submission : entry)));
              }}
            >
              Mark {item.status === "new" ? "reviewed" : "new"}
            </button>
            <button
              type="button"
              onClick={async () => {
                const response = await fetch("/api/admin/submissions", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: item.id })
                });
                if (!response.ok) {
                  setError("Could not delete this submission.");
                  return;
                }
                onChange((current) => current.filter((entry) => entry.id !== item.id));
              }}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

function MailDesk({
  title,
  text,
  subscribers,
  submissionEmails,
  sends,
  emailReady,
  onRemove,
  onSent,
  setError,
  setNotice
}: {
  title: string;
  text: string;
  subscribers: Subscriber[];
  submissionEmails: string[];
  sends: MailSend[];
  emailReady: boolean;
  onRemove: (email: string) => Promise<void>;
  onSent: (send: MailSend) => void;
  setError: (value: string) => void;
  setNotice: (value: string) => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [includeSubmissions, setIncludeSubmissions] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const subscriberCount = subscribers.length;
  const combinedCount = useMemo(() => {
    const all = new Set(subscribers.map((item) => item.email.toLowerCase()));
    submissionEmails.forEach((email) => all.add(email.toLowerCase()));
    return all.size;
  }, [subscribers, submissionEmails]);
  const audience = includeSubmissions ? combinedCount : subscriberCount;

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!confirm) {
      setError("Confirm the send before the email goes out.");
      return;
    }
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message, includeSubmissions })
    });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(payload.error || "Could not send.");
      return;
    }
    setNotice(`Sent to ${payload.sent} ${payload.sent === 1 ? "person" : "people"}.`);
    onSent({ id: crypto.randomUUID(), at: new Date().toISOString(), subject, count: payload.sent });
    setSubject("");
    setMessage("");
    setConfirm(false);
  }

  return (
    <section className="mail-studio">
      <form className="mail-compose" onSubmit={send}>
        <span className="eyebrow">Bulk email</span>
        <h2>Write an update</h2>
        <p className="admin-help">{text}</p>
        <label>
          Subject
          <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="A note from WIPI" required />
        </label>
        <label>
          Message
          <textarea rows={8} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write the update for everyone on the list." required />
        </label>
        <div className="audience-row">
          <button type="button" className={!includeSubmissions ? "active" : ""} onClick={() => setIncludeSubmissions(false)}>
            <strong>{subscribers.length}</strong>
            <span>Subscribers</span>
          </button>
          <button type="button" className={includeSubmissions ? "active" : ""} onClick={() => setIncludeSubmissions(true)}>
            <strong>{combinedCount}</strong>
            <span>Subscribers and form emails</span>
          </button>
        </div>
        <label className="check-line">
          <input type="checkbox" checked={confirm} onChange={(event) => setConfirm(event.target.checked)} />
          Send this letter to {audience} {audience === 1 ? "person" : "people"}
        </label>
        <button className="btn btn-primary" type="submit" disabled={pending || !emailReady || audience === 0}>
          {pending ? "Sending…" : "Send bulk email"}
        </button>
        {!emailReady ? <small>Add RESEND_API_KEY and RESEND_FROM to enable sending.</small> : null}
      </form>
      <div className="mail-stage">
        <p className="eyebrow">Preview</p>
        <article className="mail-letter">
          <header>
            <span>Get updates from WIPI</span>
            <h3>{subject.trim() || title}</h3>
          </header>
          <div>
            {(message.trim() ? message : "Your update will appear here.").split(/\n{2,}/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <p className="mail-signoff">Women in Politics Initiative · Plateau State</p>
        </article>
        <h2>Subscribers</h2>
        {subscribers.length === 0 ? <p>Addresses appear here after someone joins from the footer.</p> : null}
        <ul className="email-list">
          {subscribers.map((item) => (
            <li key={item.id}>
              <span>{item.email}</span>
              <small>{when(item.createdAt)}</small>
              <button type="button" onClick={() => onRemove(item.email)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        {sends.length ? (
          <>
            <h2>Recent sends</h2>
            <ul className="email-list">
              {sends.map((item) => (
                <li key={item.id}>
                  <span>{item.subject}</span>
                  <small>
                    {item.count} · {when(item.at)}
                  </small>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
