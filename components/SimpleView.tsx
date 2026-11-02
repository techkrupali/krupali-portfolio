"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ABOUT, CFG, EXPERIENCE, STACK, STACK_INTRO, roleDates, roleLength } from "@/lib/content";
import { APPS, INDUSTRIES, MILLERSTORM, MORE_PROJECTS, SITES, host } from "@/lib/projects";
import { INTRO_LINES, createIntro } from "@/lib/intro";
import { Device, Laptop, Monitor } from "./Collection";
import ContactForm from "./ContactForm";

const NAV = [["about", "About"], ["work", "Work"], ["experience", "Experience"], ["stack", "Stack"], ["contact", "Contact"]] as const;
const ease = [0.2, 0.8, 0.2, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");
// Fade-and-rise as a block scrolls into view.
const rv = (delay = 0) => ({
  initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" }, transition: { duration: 0.7, delay, ease },
});
const jump = (e: React.MouseEvent, id: string) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};
const tel = `tel:${CFG.phone.replace(/\s/g, "")}`;

function Rise({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="rise-word" aria-hidden>
      {[...text].map((c, i) => (
        <motion.span key={i} className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: delay + i * 0.03, ease }}>{c}</motion.span>
      ))}
    </span>
  );
}

function Head({ no, label, title, children }: { no: string; label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <motion.div {...rv()} className="mb-12 md:mb-16">
      <p className="sv-label"><span>{no}</span>{label}</p>
      <h2 className="mt-5 max-w-[20ch] text-[clamp(36px,5.2vw,70px)] font-bold leading-[.98] tracking-[-0.035em]">{title}</h2>
      {children && <div className="mt-5 max-w-[62ch] text-lg leading-relaxed text-mut">{children}</div>}
    </motion.div>
  );
}

function Nav({ onDesk }: { onDesk: () => void }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-40% 0px -55% 0px" });
    ["top", ...NAV.map(([id]) => id)].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <header className="sv-nav-bar">
      <div className="sv-wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" onClick={(e) => jump(e, "top")} className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-body text-[11px] font-bold text-paper">KV</span>
          <span className="hidden font-semibold tracking-[-0.01em] sm:block">Krupali Vekariya</span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`} onClick={(e) => jump(e, id)} className={`sv-nav ${active === id ? "on" : ""}`}>{label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onDesk} className="sv-btn-ghost">← Desk</button>
          <a href="#contact" onClick={(e) => jump(e, "contact")} className="sv-btn">Let’s talk</a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const [on, setOn] = useState(false), [line, setLine] = useState(-1);
  const intro = useRef<ReturnType<typeof createIntro> | null>(null);
  useEffect(() => () => intro.current?.stop(), []);
  const toggle = () => {
    intro.current ??= createIntro();
    if (on) { intro.current.stop(); setOn(false); setLine(-1); return; }
    setOn(true);
    intro.current.start(setLine, () => { setOn(false); setLine(-1); });
  };
  const stats: [string, string][] = [
    ["3+", "Years building software"], [String(SITES.length + APPS.length + 1), "Featured projects"],
    [String(INDUSTRIES.length), "Industries"], ["Web · iOS · Android", "Platforms"],
  ];
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="sv-hero-bg" aria-hidden />
      <div className="sv-wrap relative grid items-center gap-14 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[1.08fr_.92fr]">
        <div>
          <motion.p className="sv-chip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <i />Full-Stack AI Engineer · Rajkot, India
          </motion.p>
          <h1 className="mt-7 text-[clamp(58px,9.4vw,136px)] font-bold leading-[.86] tracking-[-0.055em]" aria-label="Krupali Vekariya">
            <Rise text="Krupali" /><br /><Rise text="Vekariya" delay={0.15} /><span className="text-acc">.</span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45, ease }}>
            <p className="mt-8 font-body text-[12px] uppercase tracking-[.16em] sm:text-[13px] sm:tracking-[.24em]">
              <span className="whitespace-nowrap">I engineer</span> <b className="text-acc">/</b> <span className="whitespace-nowrap">I build</span> <b className="text-acc">/</b> <span className="whitespace-nowrap">I innovate</span>
            </p>
            <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-mut md:text-xl">
              Full-Stack AI Engineer and Software Developer with over 3 years of experience building modern, scalable, and reliable software solutions.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#work" onClick={(e) => jump(e, "work")} className="sv-btn lg">View my work <span aria-hidden>→</span></a>
              <button type="button" onClick={toggle} className="sv-btn-ghost lg" aria-pressed={on}>
                {on ? <><span className="sv-eq" aria-hidden><i /><i /><i /></span>Stop intro</> : <>▶ Hear my intro</>}
              </button>
            </div>
            {on && (
              <p className="sv-caption"><span>Now playing</span>{line >= 0 ? INTRO_LINES[line] : "Starting…"}</p>
            )}
          </motion.div>
        </div>
        <motion.div className="sv-collage" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease }}>
          <div className="sv-mini sv-c1"><div className="bar"><i /><i /><i /></div><img src="/projects/web/pistola.webp" alt="Pistola Denim website" /></div>
          <div className="sv-mini sv-c2"><div className="bar"><i /><i /><i /></div><img src="/projects/web/raasta.webp" alt="Raasta Deals website" /></div>
          <img className="sv-c3" src={MILLERSTORM.appShots[1]} alt="MillerStorm iOS app" />
          <div className="sv-c4">
            <div className="flex -space-x-3">{APPS.map((a) => <img key={a.id} src={a.icon} alt="" className="h-10 w-10 rounded-xl ring-2 ring-[#fffdf8]" />)}</div>
            <span>{APPS.length} apps · iOS &amp; Android</span>
          </div>
        </motion.div>
      </div>
      <div className="sv-wrap relative">
        <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
          {stats.map(([n, l], i) => (
            <motion.div key={l} {...rv(i * 0.06)} className={`px-1 py-6 md:px-6 md:py-8 ${i % 2 ? "border-l border-line pl-5" : ""} ${i === 2 ? "md:border-l md:border-line md:pl-6" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""}`}>
              <dd className={`font-bold leading-none tracking-[-0.03em] ${n.length > 4 ? "pt-2 text-[clamp(18px,2vw,26px)]" : "text-[clamp(26px,3.4vw,46px)]"}`}>{n}</dd>
              <dt className="mt-2 font-body text-[11px] uppercase tracking-[.16em] text-mut">{l}</dt>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="sv-sec">
      <div className="sv-wrap grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <motion.div {...rv()} className="lg:sticky lg:top-28 lg:self-start">
          <p className="sv-label"><span>01</span>About me</p>
          <h2 className="mt-5 text-[clamp(44px,6vw,84px)] font-bold leading-[.92] tracking-[-0.045em]">
            {ABOUT.headline.split(". ").map((w, i, all) => <span key={w} className={`block ${i === all.length - 1 ? "text-acc" : ""}`}>{w.replace(/\.?$/, ".")}</span>)}
          </h2>
          <p className="mt-6 max-w-[28ch] text-xl font-medium leading-snug text-mut">{ABOUT.title}</p>
        </motion.div>
        <div>
          <motion.div {...rv()} className="space-y-5 text-lg leading-relaxed">
            {ABOUT.intro.map((p, i) => <p key={p} className={i === 0 ? "text-[clamp(22px,2.2vw,28px)] font-medium leading-snug" : "text-mut"}>{p}</p>)}
          </motion.div>
          <motion.div {...rv()} className="mt-12 rounded-3xl border border-line bg-[#fffdf8] p-6 md:p-8">
            <p className="sv-mini-label">{ABOUT.toolkit.title}</p>
            <p className="mt-2 text-mut">{ABOUT.toolkit.lead}</p>
            <dl className="mt-5">
              {ABOUT.toolkit.items.map(([k, v]) => (
                <div key={k} className="grid gap-1 border-t border-line py-3.5 sm:grid-cols-[190px_1fr] sm:gap-4">
                  <dt className="pt-0.5 font-body text-[11px] uppercase tracking-[.16em] text-acc">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
          <motion.div {...rv()} className="mt-12">
            <p className="sv-mini-label">{ABOUT.beyond.title}</p>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-mut">{ABOUT.beyond.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
          </motion.div>
          <motion.blockquote {...rv()} className="sv-quote mt-12">{ABOUT.beyond.closing}</motion.blockquote>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="sv-sec border-t border-line">
      <div className="sv-wrap">
        <Head no="02" label="What I build" title={ABOUT.engineer.lead} />
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT.engineer.items.map((t, i) => (
            <motion.div key={t} {...rv(i * 0.05)} className="sv-tile">
              <span className="font-body text-xs text-acc">{pad(i + 1)}</span>
              <p className="text-[21px] font-semibold leading-snug tracking-[-0.01em]">{t}</p>
            </motion.div>
          ))}
          <motion.a {...rv(0.35)} href="#contact" onClick={(e) => jump(e, "contact")} className="sv-tile sv-tile-cta">
            <span className="font-body text-xs">Your project</span>
            <p className="text-[21px] font-semibold leading-snug">Have something in mind? Let’s talk <span aria-hidden>→</span></p>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

function Work({ onProjects }: { onProjects: () => void }) {
  return (
    <section id="work" className="sv-sec border-t border-line">
      <div className="sv-wrap">
        <Head no="03" label="Selected work" title="Products across web, mobile and enterprise.">
          Real websites, apps and enterprise software, with live links.{" "}
          <button type="button" onClick={onProjects} className="font-semibold text-ink underline decoration-acc decoration-2 underline-offset-4 hover:text-acc">Open the interactive collection ↗</button>
        </Head>

        <motion.article {...rv()} className="sv-feature">
          <div className="flex flex-wrap items-center gap-3">
            <span className="sv-badge">Ongoing</span>
            <span className="font-body text-[11px] uppercase tracking-[.16em] text-mut">Featured case study · {MILLERSTORM.involvement}</span>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-12">
            <div>
              <h3 className="text-[clamp(46px,7vw,100px)] font-bold leading-[.88] tracking-[-0.05em]">{MILLERSTORM.name}</h3>
              <p className="mt-3 font-body text-sm text-acc">{MILLERSTORM.full}</p>
            </div>
            <p className="text-lg leading-relaxed text-mut">{MILLERSTORM.summary}</p>
          </div>
          <div className="sv-eco">
            <Laptop shot={MILLERSTORM.webShot} />
            <span className="sv-eco-arrow" aria-hidden>→</span>
            <Device platform="iOS" shots={MILLERSTORM.appShots} name="MillerStorm app" auto />
            <span className="sv-eco-arrow" aria-hidden>→</span>
            <Monitor shot={MILLERSTORM.crmShot} />
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {MILLERSTORM.products.map((p) => (
              <div key={p.id}>
                <p className="font-body text-[11px] uppercase tracking-[.16em] text-acc">{p.no} · {p.label}</p>
                <p className="mt-3 text-mut">{p.about}</p>
                <ul className="mt-4 space-y-2 text-[15px]">{p.built.map((b) => <li key={b} className="flex gap-2.5"><span className="text-acc">▸</span><span>{b}</span></li>)}</ul>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 border-b border-acc pb-0.5 font-semibold hover:text-acc">{p.linkLabel} ↗</a>
              </div>
            ))}
          </div>
        </motion.article>

        <h3 className="sv-sub">Business websites</h3>
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {SITES.map((s, i) => (
            <motion.a key={s.id} {...rv((i % 2) * 0.08)} href={s.url} target="_blank" rel="noopener noreferrer" className="sv-card-link block">
              <div className="sv-frame">
                <div className="sv-frame-bar"><i /><i /><i /><span>{host(s.url)}</span></div>
                <div className="pan aspect-[16/10] overflow-hidden bg-white"><img src={s.shot} alt={`${s.name} website`} loading="lazy" /></div>
              </div>
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-[clamp(26px,2.6vw,34px)] font-bold leading-tight tracking-[-0.025em]">{s.name}</h4>
                  <p className="mt-1.5 font-body text-[11px] uppercase tracking-[.14em] text-acc">{s.category}</p>
                </div>
                <span className="sv-arrow" aria-hidden>↗</span>
              </div>
              <p className="mt-3 leading-relaxed text-mut">{s.overview}</p>
              {s.tech?.length ? <p className="mt-3 font-body text-xs text-mut">Built on {s.tech.join(", ")}</p> : null}
            </motion.a>
          ))}
        </div>

        <h3 className="sv-sub">Mobile applications</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {APPS.map((a, i) => (
            <motion.a key={a.id} {...rv(i * 0.06)} href={a.store} target="_blank" rel="noopener noreferrer" className="sv-app" style={{ "--glow": a.glow } as React.CSSProperties}>
              <div className="sv-app-stage"><img src={a.shots[0]} alt={`${a.name} screenshot`} className="sv-app-shot" loading="lazy" /></div>
              <div className="mt-5 flex items-center gap-3">
                <img src={a.icon} alt="" width={44} height={44} className="h-11 w-11 rounded-xl shadow-sm" loading="lazy" />
                <div>
                  <h4 className="text-xl font-bold leading-tight">{a.name}</h4>
                  <p className="font-body text-[11px] text-mut">{a.platform}{a.status === "ongoing" ? " · Ongoing" : ""}</p>
                </div>
              </div>
              <p className="mt-3 font-body text-[11px] uppercase tracking-[.12em] text-acc">{a.category}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-mut">{a.overview}</p>
              <p className="mt-4 font-semibold">{a.platform === "iOS" ? "App Store" : "Google Play"} ↗</p>
            </motion.a>
          ))}
        </div>

        <motion.div {...rv()} className="mt-14 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-body text-[11px] uppercase tracking-[.16em] text-mut">Also worked on</span>
          {MORE_PROJECTS.map(([n, d]) => <span key={n} title={d} className="rounded-full border border-line bg-[#fffdf8] px-3.5 py-1.5 text-sm font-medium">{n}</span>)}
        </motion.div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="sv-sec border-t border-line">
      <div className="sv-wrap">
        <Head no="04" label="Experience" title="Where I’ve built things." />
        <ol className="space-y-6">
          {EXPERIENCE.map((r) => (
            <motion.li key={r.company} {...rv()} className="grid gap-6 rounded-3xl border border-line bg-[#fffdf8] p-6 md:grid-cols-[220px_1fr] md:gap-10 md:p-10">
              <div>
                <p className="font-body text-sm font-medium">{roleDates(r)}</p>
                <p className="mt-1.5 font-body text-[11px] uppercase tracking-[.14em] text-mut">{roleLength(r)} · {r.type}</p>
                <p className="mt-1 font-body text-[11px] uppercase tracking-[.14em] text-mut">{r.location}</p>
                {!r.end && <span className="sv-badge mt-5">Current</span>}
              </div>
              <div>
                <p className="font-body text-[11px] uppercase tracking-[.16em] text-acc">{r.highlight}</p>
                <h3 className="mt-2 text-[clamp(26px,3vw,40px)] font-bold leading-tight tracking-[-0.03em]">{r.title}</h3>
                <p className="mt-1 text-lg font-medium text-mut">{r.company}</p>
                <div className="mt-5 space-y-3 text-lg leading-relaxed">{r.summary.map((s) => <p key={s}>{s}</p>)}</div>
                <ul className="mt-6 grid gap-x-8 gap-y-2.5 text-[15px] md:grid-cols-2">
                  {r.points.map((p) => <li key={p} className="flex gap-2.5"><span className="text-acc">▸</span><span>{p}</span></li>)}
                </ul>
                <div className="mt-6 flex flex-wrap gap-1.5">{r.skills.map((s) => <span key={s} className="sv-chip-sm">{s}</span>)}</div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section id="stack" className="sv-sec border-t border-line">
      <div className="sv-wrap">
        <Head no="05" label="Tech stack" title={STACK_INTRO.title}>{STACK_INTRO.text}</Head>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STACK.map((g, i) => (
            <motion.article key={g.no} {...rv((i % 3) * 0.06)} className="rounded-3xl border border-line bg-[#fffdf8] p-6 md:p-7">
              <span className="sv-num">{g.no}</span>
              <h3 className="mt-3 text-[22px] font-bold leading-tight tracking-[-0.02em]">{g.name}</h3>
              <p className="mt-2 text-[15px] text-mut">{g.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">{g.items.map((t) => <span key={t} className="sv-chip-sm">{t}</span>)}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ onDesk }: { onDesk: () => void }) {
  const rows: [string, string, string, boolean][] = [
    ["Email", CFG.email, `mailto:${CFG.email}`, false], ["Phone", CFG.phone, tel, false], ["LinkedIn", "Krupali Vekariya", CFG.linkedin, true],
  ];
  return (
    <section id="contact" className="sv-dark">
      <div className="sv-wrap grid gap-14 py-20 md:py-28 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div {...rv()}>
          <p className="sv-label"><span>06</span>Contact</p>
          <h2 className="mt-6 text-[clamp(46px,7vw,104px)] font-bold leading-[.9] tracking-[-0.05em]">Have an idea?<br /><span className="text-acc">Let’s build it.</span></h2>
          <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-mut">I’m always interested in building meaningful products, collaborating with ambitious people, and solving real-world problems through technology.</p>
          <ul className="mt-10">
            {rows.map(([label, text, href, ext]) => (
              <li key={label}>
                <a href={href} className="sv-row" {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className="font-body text-[11px] uppercase tracking-[.16em] text-acc">{label}</span>
                  <span className="min-w-0 break-words text-[clamp(18px,2vw,26px)] font-semibold">{text}</span>
                  <span className="sv-arrow" aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-body text-[11px] uppercase tracking-[.16em] text-mut">Rajkot, Gujarat, India</p>
        </motion.div>
        <motion.div {...rv(0.1)} className="sv-formcard self-start">
          <p className="text-2xl font-bold tracking-[-0.02em]">Send a message</p>
          <p className="mt-1 text-sm text-mut">Tell me about your project and I’ll reply by email.</p>
          <div className="mt-6"><ContactForm /></div>
        </motion.div>
      </div>
      <footer className="border-t border-line">
        <div className="sv-wrap py-10">
          <p className="sv-wordmark" aria-hidden>Krupali Vekariya</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-body text-[11px] uppercase tracking-[.16em] text-mut">
            <span>© {new Date().getFullYear()} Krupali Vekariya</span>
            <span>Full-Stack AI Engineer · Rajkot, India</span>
            <button type="button" onClick={onDesk} className="uppercase tracking-[.16em] hover:text-acc">Back to the desk ↑</button>
          </div>
        </div>
      </footer>
    </section>
  );
}

// Readable, recruiter-friendly version of the portfolio: every section on one page.
export default function SimpleView({ onDesk, onProjects }: { onDesk: () => void; onProjects: () => void }) {
  return (
    <div className="simple">
      <Nav onDesk={onDesk} />
      <main>
        <Hero />
        <div className="sv-marquee" role="img" aria-label={`Industries: ${INDUSTRIES.join(", ")}`}>
          <div>{[...INDUSTRIES, ...INDUSTRIES].map((x, i) => <span key={i}>{x}</span>)}</div>
        </div>
        <About />
        <Services />
        <Work onProjects={onProjects} />
        <Experience />
        <Stack />
        <Contact onDesk={onDesk} />
      </main>
    </div>
  );
}
