import { ABOUT, BUILD, CFG, EXPERIENCE, MENU, STACK, Mode, roleDates, roleLength } from "@/lib/content";
import { CATEGORIES, CategoryId } from "@/lib/projects";
import ContactForm from "./ContactForm";

const H = ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>;

export function Screen({ mode, mi, pi, si, ei, onPick, onOpen }: {
  mode: Mode; mi: number; pi: number; si: number; ei: number; onPick: (i: number) => void; onOpen: (c: CategoryId) => void;
}) {
  switch (mode) {
    case "title": return (
      <div className="ttl">
        <div className="ttl-bar"><span>K/V POCKET</span><span>READY</span></div>
        <p className="ttl-k">KRUPALI VEKARIYA / PLAYER ONE</p>
        <h2 className="ttl-h">Building ideas into digital reality.</h2>
        <p className="ttl-s">Full-stack AI engineer. Product builder.</p>
        <div className="it on"><span className="blink">▶</span> PRESS START</div>
        <p className="ttl-f">© KRUPALI VEKARIYA · RAJKOT, INDIA</p>
      </div>);
    case "boot": return <div className="text-center pt-28"><H>LOADING...</H><p>████████░░</p></div>;
    case "menu": return (<><H>MAIN MENU</H>
      {MENU.map((m, i) => <button key={m[0]} className={`it ${i === mi ? "on" : ""}`} onClick={() => onPick(i)}>{i === mi ? "▶ " : "  "}{m[1]}</button>)}
      <p className="mt-2" style={{ fontSize: 12 }}>▲▼ move · A select · B back</p></>);
    case "about": { const { toolkit, engineer, beyond } = ABOUT; return (<><H>ABOUT ME</H>
      <p className="ab-hl">{ABOUT.headline.replace(/\. /g, ".\n")}</p>
      <p><b><i>{ABOUT.title}</i></b></p>
      {ABOUT.intro.map((p) => <p key={p}>{p}</p>)}
      <p className="ab-sub">{toolkit.title}</p><p>{toolkit.lead}</p>
      <p>{toolkit.items.map(([k, v]) => <span key={k}>★ <b>{k}:</b> {v}<br /></span>)}</p>
      <p className="ab-sub">{engineer.title}</p><p>{engineer.lead}</p>
      <p>{engineer.items.map((t) => <span key={t}>★ {t}<br /></span>)}</p>
      <p className="ab-sub">{beyond.title}</p>
      {beyond.paragraphs.map((p) => <p key={p}>{p}</p>)}
      <p><b>{beyond.closing}</b></p></>); }
    case "projects": return (<><H>SELECT CARTRIDGE</H>
      {CATEGORIES.map((c, i) => <button key={c.id} className={`it ${i === pi ? "on" : ""}`} onClick={() => onOpen(c.id)}>{i === pi ? "▶ " : "  "}{c.no} {c.short}</button>)}
      <p className="mt-2" style={{ fontSize: 12 }}>▲▼ choose · A open · B back</p>
      <p className="pl" style={{ fontSize: 12 }}>Opens the full collection: live websites, mobile apps and the MillerStorm case study.</p></>);
    case "stack": { const g = STACK[si]; return (<><H>TECH STACK · {g.no}/{STACK.length}</H>
      <p>◀ <b>{g.name.toUpperCase()}</b> ▶</p>
      <p className="st-blurb">{g.blurb}</p>
      {g.items.map((t) => <span key={t} className="chip">{t}</span>)}
      <p className="mt-2" style={{ fontSize: 12 }}>◀ ▶ next category · B back</p></>); }
    case "build": return (<><H>WHAT I BUILD</H>{BUILD.map(([a, b]) => <span key={a} className="chip"><b>[{a}]</b> {b}</span>)}</>);
    case "exp": { const r = EXPERIENCE[ei]; return (<><H>EXPERIENCE · {ei + 1}/{EXPERIENCE.length}</H>
      <p>◀ <b>{r.company.toUpperCase()}</b> ▶</p>
      <p><b>{r.title}</b><br />{r.type} · {roleDates(r)} · {roleLength(r)}<br />{r.location}</p>
      {r.summary.map((s) => <p key={s} className="st-blurb">{s}</p>)}
      <p>{r.points.map((p) => <span key={p}>▌ {p}<br /></span>)}</p>
      {r.skills.map((s) => <span key={s} className="chip">{s}</span>)}
      <p className="mt-2" style={{ fontSize: 12 }}>◀ ▶ next role · ▲▼ scroll · B back</p></>); }
    case "contact": return (<><H>HAVE AN IDEA? LET’S BUILD IT.</H>
      <p style={{ fontSize: 13 }}>I’m always interested in building meaningful products, collaborating with ambitious people, and solving real-world problems through technology.</p>
      <p style={{ fontSize: 13 }}>
        ✉ <a href={`mailto:${CFG.email}`}>{CFG.email}</a><br />
        ☎ <a href={`tel:${CFG.phone.replace(/\s/g, "")}`}>{CFG.phone}</a><br />
        in <a href={CFG.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> · Rajkot, Gujarat, India</p><ContactForm /></>);
  }
}
