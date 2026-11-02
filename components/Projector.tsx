"use client";
import { motion } from "framer-motion";
import { ABOUT, BUILD, CFG, EXPERIENCE, STACK, STACK_INTRO, Section, roleDates, roleLength } from "@/lib/content";

const NAME: Record<Section, string> = { about: "About", exp: "Experience", stack: "Tech stack", build: "What I build", contact: "Contact" };

function About() {
  return (
    <>
      <p className="pj-kick">About me</p>
      <h2 className="pj-h">{ABOUT.headline.replace(/\bI /g, "I ")}</h2>
      <p className="pj-sub">{ABOUT.title}</p>
      <div className="pj-lead">{ABOUT.intro.map((p) => <p key={p}>{p}</p>)}</div>
      <div className="pj-cols">
        <div>
          <h3 className="pj-h3">{ABOUT.beyond.title}</h3>
          {ABOUT.beyond.paragraphs.map((p) => <p key={p} className="pj-p">{p}</p>)}
          <p className="pj-quote">{ABOUT.beyond.closing}</p>
        </div>
        <aside>
          <p className="pj-kick">{ABOUT.toolkit.title}</p>
          <dl className="pj-dl">{ABOUT.toolkit.items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <p className="pj-kick mt-7">{ABOUT.engineer.title}</p>
          <ul className="pj-ul">{ABOUT.engineer.items.map((t) => <li key={t}>{t}</li>)}</ul>
        </aside>
      </div>
    </>
  );
}

function Experience() {
  return (
    <>
      <p className="pj-kick">Experience</p>
      <h2 className="pj-h">Where I’ve built things.</h2>
      {EXPERIENCE.map((r) => (
        <article key={r.company} className="pj-role">
          <aside>
            <p className="pj-date">{roleDates(r)}</p>
            <p className="pj-meta">{roleLength(r)} · {r.type}<br />{r.location}</p>
            {!r.end && <span className="pj-tag">Current</span>}
          </aside>
          <div>
            <p className="pj-kick lime">{r.highlight}</p>
            <h3 className="pj-h3">{r.title}</h3>
            <p className="pj-sub sm">{r.company}</p>
            {r.summary.map((s) => <p key={s} className="pj-p">{s}</p>)}
            <ul className="pj-ul two">{r.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <p className="pj-tags">{r.skills.map((s) => <span key={s}>{s}</span>)}</p>
          </div>
        </article>
      ))}
    </>
  );
}

function Stack() {
  return (
    <>
      <p className="pj-kick">Tech stack</p>
      <h2 className="pj-h">{STACK_INTRO.title}</h2>
      <p className="pj-sub">{STACK_INTRO.text}</p>
      <div className="pj-grid">
        {STACK.map((g) => (
          <div key={g.no} className="pj-cell">
            <p className="pj-kick"><b>{g.no}</b> {g.name}</p>
            <p className="pj-p sm">{g.blurb}</p>
            <p className="pj-tags">{g.items.map((t) => <span key={t}>{t}</span>)}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Build() {
  return (
    <>
      <p className="pj-kick">What I build</p>
      <h2 className="pj-h">{ABOUT.engineer.lead}</h2>
      <div className="pj-tiles">{BUILD.map(([code, label]) => <div key={code}><span>{code}</span><b>{label}</b></div>)}</div>
    </>
  );
}

function Contact() {
  const rows: [string, string, string, boolean][] = [
    ["Email", CFG.email, `mailto:${CFG.email}`, false],
    ["Phone", CFG.phone, `tel:${CFG.phone.replace(/\s/g, "")}`, false],
    ["LinkedIn", "Krupali Vekariya", CFG.linkedin, true],
  ];
  return (
    <>
      <p className="pj-kick">Contact</p>
      <h2 className="pj-h">Have an idea? Let’s build it.</h2>
      <p className="pj-sub">I’m always interested in building meaningful products, collaborating with ambitious people, and solving real-world problems through technology.</p>
      <div className="pj-contact">
        {rows.map(([label, text, href, ext]) => (
          <a key={label} href={href} className="pj-link" {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            <span>{label}</span><b>{text}</b><i aria-hidden>↗</i>
          </a>
        ))}
        <p className="pj-meta mt-5">Rajkot, Gujarat, India</p>
      </div>
    </>
  );
}

// The panel the console projects above itself, with a beam of light connecting the two.
export default function Projector({ section, onClose, bodyRef }: {
  section: Section; onClose: () => void; bodyRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <>
      <motion.div className="beam" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
      <motion.section className="proj" aria-label={NAME[section]}
        initial={{ opacity: 0, scaleY: 0.06, y: 120 }} animate={{ opacity: 1, scaleY: 1, y: 0 }} exit={{ opacity: 0, scaleY: 0.06, y: 120 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}>
        <header className="proj-head">
          <span><i className="proj-dot" />K/V POCKET <em>/ {NAME[section].toUpperCase()}</em></span>
          <button type="button" onClick={onClose}>Close <b aria-hidden>✕</b></button>
        </header>
        <div ref={bodyRef} className="proj-body" tabIndex={-1}>
          <div className="proj-in">
            {section === "about" && <About />}
            {section === "exp" && <Experience />}
            {section === "stack" && <Stack />}
            {section === "build" && <Build />}
            {section === "contact" && <Contact />}
          </div>
        </div>
        <footer className="proj-foot">
          <span>{ABOUT.headline}</span>
          <button type="button" onClick={onClose}>Back to exploring <b aria-hidden>↗</b></button>
        </footer>
      </motion.section>
    </>
  );
}
