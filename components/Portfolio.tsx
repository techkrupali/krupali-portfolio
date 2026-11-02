"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MENU, Mode, isSection } from "@/lib/content";
import { CATEGORIES, CategoryId, PROJECT_ROWS } from "@/lib/projects";
import { INTRO_LINES, createIntro, warmVoices } from "@/lib/intro";
import CardFan, { FIRST_APP } from "./CardFan";
import Collection from "./Collection";
import Projector from "./Projector";
import { Screen } from "./Screens";
import SimpleView from "./SimpleView";
import Turntable from "./Turntable";

type K = "up" | "down" | "left" | "right" | "a" | "b" | "start";
type View = "desk" | "play" | "simple" | "projects";
const isCat = (c: string | null): c is CategoryId => CATEGORIES.some((x) => x.id === c);
const KEYMAP: Record<string, K> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", Enter: "a", Escape: "b", Backspace: "b" };
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Blend two #rrggbb colors; used to shade the stacked layers that give the objects their thickness.
const mix = (a: string, b: string, t: number) => {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * t).toString(16).padStart(2, "0")).join("");
};
const Edges = ({ n, from, to }: { n: number; from: string; to: string }) => (
  <>{Array.from({ length: n }, (_, i) => <div key={i} className="edge" style={{ transform: `translateZ(${-(i + 1)}px)`, background: mix(from, to, i / (n - 1)) }} />)}</>
);

export default function Portfolio() {
  const [view, setView] = useState<View>("desk");
  const [colCat, setColCat] = useState<CategoryId>("web");
  const [fan, setFan] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const [mode, setMode] = useState<Mode>("home");
  const [mi, setMi] = useState(0), [pi, setPi] = useState(0);
  const scr = useRef<HTMLDivElement>(null), cur = useRef<HTMLDivElement>(null), face = useRef<HTMLDivElement>(null), panelBody = useRef<HTMLDivElement>(null);
  const intro = useRef<ReturnType<typeof createIntro> | null>(null);
  const [line, setLine] = useState(-1);
  const panel = view === "play" && isSection(mode) ? mode : null;

  const pickUp = useCallback(() => {
    setView("play");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => scr.current?.focus({ preventScroll: true }), 700);
  }, []);
  const putDown = useCallback(() => { setView("desk"); setMode("home"); }, []);
  // Page-level views get their own URL (?view=simple, ?view=projects&cat=apps) so links and the back button work.
  const go = useCallback((v: View, cat?: CategoryId) => {
    if (cat) setColCat(cat);
    setFan(null);
    setView(v);
    if (v === "desk") setMode("home");
    const url = v === "simple" || v === "projects" ? `?view=${v}${v === "projects" && cat && cat !== "web" ? `&cat=${cat}` : ""}` : window.location.pathname;
    window.history.pushState(null, "", url);
    window.scrollTo(0, 0);
  }, []);
  const openCollection = useCallback((cat: CategoryId) => go("projects", cat), [go]);
  // Rows on the console's Projects screen: the case study, the card fan (websites / apps), or the full collection.
  const runRow = useCallback((i: number) => {
    setPi(i);
    const id = PROJECT_ROWS[i].id;
    if (id === "ms") openCollection("crm");
    else if (id === "all") openCollection("web");
    else setFan(id === "web" ? 1 : FIRST_APP);
  }, [openCollection]);
  // Putting on the record plays the spoken intro; it lifts itself when the intro ends.
  const setRecord = (on: boolean) => {
    intro.current ??= createIntro();
    if (on) intro.current.start(setLine, () => { setPlaying(false); setLine(-1); });
    else { intro.current.stop(); setLine(-1); }
    setPlaying(on);
  };
  useEffect(() => { warmVoices(); return () => intro.current?.stop(); }, []);

  const key = useCallback((k: K) => {
    if (k === "start") return setMode("home");
    if (mode === "home") {
      if (k === "up") setMi((i) => (i + MENU.length - 1) % MENU.length);
      else if (k === "down") setMi((i) => (i + 1) % MENU.length);
      else if (k === "a" || k === "right") setMode(MENU[mi][0]);
      else if (k === "b") putDown();
      return;
    }
    if (mode === "projects") {
      if (k === "up") setPi((i) => (i + PROJECT_ROWS.length - 1) % PROJECT_ROWS.length);
      else if (k === "down") setPi((i) => (i + 1) % PROJECT_ROWS.length);
      else if (k === "a" || k === "right") runRow(pi);
      else if (k === "b" || k === "left") setMode("home");
      return;
    }
    // A section is open in the projected panel: ▲▼ scroll it, anything else closes it.
    if (k === "up" || k === "down") panelBody.current?.scrollBy({ top: k === "up" ? -160 : 160, behavior: "smooth" });
    else setMode("home");
  }, [mode, mi, pi, putDown, runRow]);

  useEffect(() => {
    if (view === "simple" || view === "projects" || fan !== null) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || (t.tagName === "BUTTON" && e.key === "Enter")) return;
      const k = KEYMAP[e.key];
      if (!k) return;
      if (view === "desk") { if (k === "a") { e.preventDefault(); pickUp(); } return; }
      e.preventDefault(); key(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, view, pickUp, fan]);

  // Keep the highlighted menu row visible inside the small screen.
  useEffect(() => {
    const s = scr.current, el = s?.querySelector<HTMLElement>(".lcd-item.on, .lcd-row.on");
    if (!s) return;
    if (!el || mode === "home" && mi === 0) { s.scrollTop = 0; return; }
    const top = el.offsetTop, bottom = top + el.offsetHeight;
    if (top < s.scrollTop + 24) s.scrollTop = top - 24;
    else if (bottom > s.scrollTop + s.clientHeight - 8) s.scrollTop = bottom - s.clientHeight + 8;
  }, [mi, pi, mode]);
  // While the console lies on the desk its buttons can't be clicked or tabbed to.
  useEffect(() => { if (face.current) face.current.inert = view !== "play"; }, [view]);

  // Shareable links: ?view=simple (plain page), ?view=projects[&cat=apps|crm] (the Collection), ?view=play (console picked up).
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(window.location.search), v = q.get("view"), c = q.get("cat");
      if (isCat(c)) setColCat(c); else setColCat("web");
      setView(v === "simple" || v === "play" || v === "projects" ? v : "desk");
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  useEffect(() => {
    const size = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cur.current) return;
      const hot = (e.target as HTMLElement).closest("button,a,input,select,textarea,[data-hot]");
      cur.current.style.transform = `translate(${e.clientX - 9}px,${e.clientY - 9}px) scale(${hot ? 2.2 : 1})`;
      cur.current.style.opacity = "1";
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const Btn = ({ k, children, cls, label }: { k: K; children?: React.ReactNode; cls?: string; label?: string }) => (
    <button type="button" className={cls} data-l={label} onClick={() => key(k)} aria-label={label ?? k}>{children}</button>
  );

  // Scale the objects to the window: desk size, picked-up size, record player size.
  const mobile = vp.w < 900;
  const ds = mobile ? clamp((vp.w - 24) / 620, 0.5, 0.85) : clamp(Math.min(vp.w / 1380, vp.h / 860), 0.6, 1.2);
  const ts = mobile ? clamp((vp.w - 24) / 560, 0.5, 0.85) : clamp(Math.min(vp.w / 1380, vp.h / 820), 0.6, 1.25) * 0.92;
  const ps = clamp(Math.min((vp.h - 110) / 650, (vp.w - 32) / 390), 0.5, 1.3);

  const cursor = <div ref={cur} className="cursor" aria-hidden />;

  if (view === "simple") return <>{cursor}<SimpleView onDesk={() => go("desk")} onProjects={() => go("projects", "web")} /></>;
  if (view === "projects") return (
    <>{cursor}<Collection initial={colCat} onExit={() => go("desk")} onSimple={() => { setRecord(false); go("simple"); }} playing={playing} onStopMusic={() => setRecord(false)} /></>
  );

  return (
    <main className="desk" data-view={view} data-panel={panel ? "on" : undefined} style={{ "--ds": ds, "--ts": ts, "--ps": ps } as React.CSSProperties}>
      {cursor}
      <div className="desk-wood" aria-hidden>
        <svg width="100%" height="100%">
          <filter id="wood-grain" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.0018 0.12" numOctaves="5" seed="11" />
            <feColorMatrix values="0.3 0 0 0 0.5  0.18 0 0 0 0.31  0.1 0 0 0 0.18  0 0 0 0 1" />
          </filter>
          <rect width="100%" height="100%" filter="url(#wood-grain)" />
        </svg>
      </div>
      <div className="desk-light" aria-hidden />

      <header className="desk-head">
        <p className="k">THE DESK OF</p>
        <h1>Krupali Vekariya<span>.</span></h1>
        <p className="d">Full-Stack AI Engineer in Rajkot, India. I turn complex ideas into practical, scalable products.</p>
        <p className="h">Pick up the console. Put on a record to hear my intro. Pull out the cartridge for projects.</p>
      </header>
      <div className="desk-top">
        <button type="button" className="pill pill-dark" onClick={() => setFan(0)}>Projects <span>↗</span></button>
        <button type="button" className="pill pill-dark" onClick={() => { setRecord(false); go("simple"); }}>Use simple view <span>↗</span></button>
      </div>

      <div className="obj tt-pos">
        <div className="rig tt-rig" data-hot onClick={() => setRecord(!playing)} aria-hidden>
          <div className="rig-shadow" />
          <Edges n={18} from="#7a4a2c" to="#3b2214" />
          <Turntable playing={playing} />
        </div>
        <button type="button" className="pill tt-pill" onClick={() => setRecord(!playing)} aria-pressed={playing}>
          {playing ? "Lift the needle" : "Put on a record"} <span>↗</span>
        </button>
      </div>

      {playing && (
        <div className="np">
          <p className="np-k"><span className="np-eq" aria-hidden><i /><i /><i /><i /></span>Now playing · Side A · My intro
            <button type="button" className="np-stop" onClick={() => setRecord(false)} aria-label="Stop the intro">■ Stop</button></p>
          <p className="np-line">{line >= 0 ? INTRO_LINES[line] : "Dropping the needle…"}</p>
          <div className="np-bar" aria-hidden><i style={{ width: `${((line + 1) / INTRO_LINES.length) * 100}%` }} /></div>
        </div>
      )}

      <div className="dim" onClick={() => (panel ? setMode("home") : putDown())} aria-hidden />

      <div className="obj con-pos">
        <div className="rig con-rig" data-hot={view === "desk" || undefined} onClick={() => view === "desk" && pickUp()}>
          <div className="rig-shadow" />
          <div className="cart" data-hot onClick={(e) => { e.stopPropagation(); if (view === "desk") setFan(0); }}><span>K/V COLLECTION · 01</span></div>
          <Edges n={14} from="#dcdad3" to="#b4b1a9" />
          <div ref={face} className="console" role="application" aria-label="Interactive portfolio console">
            <div className="c-rail" aria-hidden><span className="c-cam"><b /></span></div>
            <div className="bezel">
              <span className="c-led" aria-hidden />
              <div ref={scr} className="scr" tabIndex={0} aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: "easeOut" }}>
                    <Screen mode={mode} mi={mi} pi={pi} onPick={(i) => { setMi(i); setMode(MENU[i][0]); }} onRow={runRow} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="bezel-cap">DOT MATRIX DISPLAY · SCROLL TO EXPLORE</p>
            </div>
            <p className="c-logo"><b>K/V</b>POCKET<sup>01</sup></p>
            <div className="c-ctrl">
              <div className="dp">
                <Btn k="up" cls="u" label="Move up" /><Btn k="left" cls="l" label="Move left" /><i />
                <Btn k="right" cls="r" label="Move right" /><Btn k="down" cls="d" label="Move down" />
              </div>
              <div className="ab"><Btn k="b" cls="abtn b" label="B" /><Btn k="a" cls="abtn a" label="A" /></div>
            </div>
            <div className="c-sys"><Btn k="start" cls="sys" label="START" /></div>
            <div className="grille" aria-hidden><i /><i /><i /><i /><i /><i /></div>
            <p className="c-phones" aria-hidden>◉ PHONES</p>
          </div>
        </div>
        <button type="button" className="pill con-pill" onClick={pickUp}>Pick up &amp; play <span>↗</span></button>
        <button type="button" className="pill col-pill" onClick={() => setFan(0)}>Browse projects <span>↗</span></button>
        <p className="play-hint">ARROWS TO MOVE · ENTER TO SELECT · ESC TO GO BACK</p>
      </div>

      <AnimatePresence>
        {panel && <Projector key="proj" section={panel} onClose={() => setMode("home")} bodyRef={panelBody} />}
      </AnimatePresence>

      <div className="play-ui">
        <button type="button" className="pill pill-dark" onClick={() => setRecord(!playing)} aria-pressed={playing}>
          <span className={`rec ${playing ? "on" : ""}`} aria-hidden />{playing ? "Stop intro" : "My intro"} <span>↗</span>
        </button>
        <button type="button" className="pill pill-dark" onClick={putDown}><span>↙</span> Back to desk</button>
      </div>

      <p className="desk-foot">WEB · MOBILE · AI · SAAS · CRM · ERP — BUILT END TO END.</p>

      <AnimatePresence>
        {fan !== null && <CardFan key="fan" start={fan} onClose={() => setFan(null)} onCollection={(c) => openCollection(c)} />}
      </AnimatePresence>
    </main>
  );
}
