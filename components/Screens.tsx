import { BUILD, CFG, MENU, PROJECTS, STACK, Mode } from "@/lib/content";
import ContactForm from "./ContactForm";

const H = ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>;
const Ph = ({ label, v }: { label: string; v?: string }) => <p className={v ? "" : "pl"}>{label}: {v ?? `[add ${label.toLowerCase()}]`}</p>;

export function Screen({ mode, mi, pi, si, onPick }: { mode: Mode; mi: number; pi: number; si: number; onPick: (i: number) => void }) {
  switch (mode) {
    case "title": return (
      <div className="text-center pt-11"><h2 style={{ border: 0, fontSize: 24, lineHeight: 1.15 }}>K·V<br />POCKET</h2>
        <p>FULL-STACK AI ENGINEER</p><p className="blink mt-8">▶ PRESS START ◀</p><p className="mt-7" style={{ fontSize: 12 }}>© KRUPALI VEKARIYA</p></div>);
    case "boot": return <div className="text-center pt-28"><H>LOADING...</H><p>████████░░</p></div>;
    case "menu": return (<><H>MAIN MENU</H>
      {MENU.map((m, i) => <button key={m[0]} className={`it ${i === mi ? "on" : ""}`} onClick={() => onPick(i)}>{i === mi ? "▶ " : "\u00a0\u00a0"}{m[1]}</button>)}
      <p className="mt-2" style={{ fontSize: 12 }}>▲▼ move · A select · B back</p></>);
    case "about": return (<><H>ABOUT</H><p><b>KRUPALI VEKARIYA</b><br />Full-Stack AI Engineer · Rajkot, India</p>
      <p>I turn complex ideas into practical, scalable products: concept, architecture, build, deploy.</p>
      <p>★ 3+ years building software<br />★ Web, Android &amp; iOS<br />★ AI apps &amp; automation<br />★ SaaS, CRM &amp; ERP<br />★ Payment gateways &amp; APIs<br />★ Backend architecture<br />★ International clients<br />★ End-to-end delivery</p>
      <p>I work solo, and bring in a team when a product needs it.</p></>);
    case "projects": { const p = PROJECTS[pi]; return (<><H>SELECT GAME {pi + 1}/{PROJECTS.length}</H>
      <p style={{ fontSize: 17 }}><b>◀ {p.name} ▶</b></p><p>{p.category}</p><p>{p.desc}</p>
      <Ph label="Tech" v={p.tech} /><Ph label="My role" v={p.role} />
      {p.link ? <p>Link: <a href={p.link} target="_blank" rel="noopener noreferrer">{p.link}</a></p> : <Ph label="Link" />}
      <p className="pl">Preview: [add screenshot]</p></>); }
    case "stack": { const k = Object.keys(STACK), c = k[si]; return (<><H>TECH STACK</H>
      <p>◀ <b>{c.toUpperCase()}</b> ▶ ({si + 1}/{k.length})</p>{STACK[c].map((t) => <span key={t} className="chip">{t}</span>)}</>); }
    case "build": return (<><H>WHAT I BUILD</H>{BUILD.map(([a, b]) => <span key={a} className="chip"><b>[{a}]</b> {b}</span>)}</>);
    case "exp": return (<><H>EXPERIENCE</H><p>▌ <b>Technova Technologies</b><br />&nbsp;&nbsp;My professional business identity</p>
      <p>▌ 3+ years of software development<br />▌ International clients<br />▌ Real-world production apps</p><p className="pl">[add roles, dates and details here]</p></>);
    case "contact": return (<><H>HAVE AN IDEA? LET’S BUILD IT.</H>
      <p style={{ fontSize: 13 }}>I’m always interested in building meaningful products, collaborating with ambitious people, and solving real-world problems through technology.</p>
      <p style={{ fontSize: 13 }}>{CFG.email}<br /><a href={CFG.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> · Rajkot, Gujarat, India</p><ContactForm /></>);
  }
}
