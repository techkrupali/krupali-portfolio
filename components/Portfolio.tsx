"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EXPERIENCE, MENU, Mode, STACK } from "@/lib/content";
import { CATEGORIES, CategoryId } from "@/lib/projects";
import { INTRO_LINES, createIntro, warmVoices } from "@/lib/intro";
import Collection from "./Collection";
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
  const [playing, setPlaying] = useState(false);
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const [mode, setMode] = useState<Mode>("title");
  const [mi, setMi] = useState(0), [pi, setPi] = useState(0), [si, setSi] = useState(0), [ei, setEi] = useState(0);
  const scr = useRef<HTMLDivElement>(null), cur = useRef<HTMLDivElement>(null), face = useRef<HTMLDivElement>(null);
  const intro = useRef<ReturnType<typeof createIntro> | null>(null);
  const [line, setLine] = useState(-1);
  const nStack = STACK.length;

  const pickUp = useCallback(() => {
    setView("play");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => scr.current?.focus({ preventScroll: true }), 700);
  }, []);
  const putDown = useCallback(() => { setView("desk"); setMode("title"); }, []);
  // Page-level views get their own URL (?view=simple, ?view=projects&cat=apps) so links and the back button work.
  const go = useCallback((v: View, cat?: CategoryId) => {
    if (cat) setColCat(cat);
    setView(v);
    if (v === "desk") setMode("title");
    const url = v === "simple" || v === "projects" ? `?view=${v}${v === "projects" && cat && cat !== "web" ? `&cat=${cat}` : ""}` : window.location.pathname;
    window.history.pushState(null, "", url);
    window.scrollTo(0, 0);
  }, []);
  const openCollection = useCallback((cat: CategoryId) => go("projects", cat), [go]);
  // Putting on the record plays the spoken intro; it lifts itself when the intro ends.
  const setRecord = (on: boolean) => {
    intro.current ??= createIntro();
    if (on) intro.current.start(setLine, () => { setPlaying(false); setLine(-1); });
    else { intro.current.stop(); setLine(-1); }
    setPlaying(on);
  };
  useEffect(() => { warmVoices(); return () => intro.current?.stop(); }, []);

  const key = useCallback((k: K) => {
    const scroll = (d: number) => scr.current && (scr.current.scrollTop += d);
    if (mode === "boot") return;
    if (k === "b" && (mode === "title" || mode === "menu")) return putDown();
    if (mode === "title") { if (k === "start" || k === "a") { setMode("boot"); setTimeout(() => setMode("menu"), 900); } return; }
    if (k === "start") return setMode("menu");
    if (mode === "menu") {
      if (k === "up") setMi((i) => (i + MENU.length - 1) % MENU.length);
      if (k === "down") setMi((i) => (i + 1) % MENU.length);
      if (k === "a" || k === "right") setMode(MENU[mi][0]);
      return;
    }
    if (k === "b") return setMode("menu");
    if (mode === "projects") {
      if (k === "up" || k === "down") setPi((i) => (i + (k === "up" ? -1 : 1) + CATEGORIES.length) % CATEGORIES.length);
      if (k === "a" || k === "right") openCollection(CATEGORIES[pi].id);
      return;
    }
    if (mode === "stack" && (k === "left" || k === "right")) setSi((i) => (i + (k === "left" ? -1 : 1) + nStack) % nStack);
    else if (mode === "exp" && (k === "left" || k === "right")) setEi((i) => (i + (k === "left" ? -1 : 1) + EXPERIENCE.length) % EXPERIENCE.length);
    else if (k === "up" || k === "down") scroll(k === "up" ? -40 : 40);
  }, [mode, mi, pi, nStack, putDown, openCollection]);

  useEffect(() => {
    if (view === "simple" || view === "projects") return;
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
  }, [key, view, pickUp]);

  useEffect(() => { scr.current?.scrollTo(0, 0); }, [mode]);
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

  const pick = (i: number) => { setMi(i); setMode(MENU[i][0]); };
  const Btn = ({ k, children, cls, label }: { k: K; children?: React.ReactNode; cls?: string; label?: string }) => (
    <button type="button" className={cls} data-l={label} onClick={() => key(k)} aria-label={k}>{children}</button>
  );

  // Scale the objects to the window: desk size, picked-up size, record player size.
  const mobile = vp.w < 900;
  const ds = mobile ? clamp((vp.w - 24) / 620, 0.5, 0.85) : clamp(Math.min(vp.w / 1380, vp.h / 820), 0.6, 1.25);
  const ts = mobile ? clamp((vp.w - 24) / 560, 0.5, 0.85) : ds * 0.92;
  const ps = clamp(Math.min((vp.h - 190) / 620, (vp.w - 32) / 390), 0.5, 1.25);

  const cursor = <div ref={cur} className="cursor pointer-events-none fixed left-0 top-0 z-[99] h-[18px] w-[18px] rounded-full border-2 border-acc opacity-0" aria-hidden />;

  if (view === "simple") return <>{cursor}<SimpleView onDesk={() => go("desk")} onProjects={() => go("projects", "web")} /></>;
  if (view === "projects") return (
    <>{cursor}<Collection initial={colCat} onExit={() => go("desk")} onSimple={() => { setRecord(false); go("simple"); }} playing={playing} onStopMusic={() => setRecord(false)} /></>
  );

  return (
    <main className="desk" data-view={view} style={{ "--ds": ds, "--ts": ts, "--ps": ps } as React.CSSProperties}>
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
        <h1>Krupali Vekariya.</h1>
        <p className="d">Full-Stack AI Engineer in Rajkot, India. I turn complex ideas into practical, scalable products.</p>
        <p className="h">Pick up the console. Put on a record to hear my intro. Pull out the cartridge for projects.</p>
      </header>
      <div className="desk-top">
        <button type="button" className="pill pill-dark" onClick={() => openCollection("web")}>Projects <span>↗</span></button>
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

      <div className="dim" onClick={putDown} aria-hidden />

      <div className="obj con-pos">
        <div className="rig con-rig" data-hot={view === "desk" || undefined} onClick={() => view === "desk" && pickUp()}>
          <div className="rig-shadow" />
          <div className="cart" data-hot onClick={(e) => { e.stopPropagation(); if (view === "desk") openCollection("web"); }}><span>K/V COLLECTION · 01</span></div>
          <Edges n={14} from="#d6cebb" to="#a99e86" />
          <div ref={face} className="console" role="application" aria-label="Interactive portfolio console">
            <div className="c-top"><span className="c-slot" /></div>
            <div className="bezel">
              <span className="c-led" />
              <div ref={scr} className="scr" tabIndex={0} aria-live="polite" onClick={() => mode === "title" && key("start")}>
                <AnimatePresence mode="wait">
                  <motion.div key={mode + (mode === "projects" ? pi : "") + (mode === "stack" ? si : "") + (mode === "exp" ? ei : "")}
                    initial={{ clipPath: "inset(50% 0 50% 0)" }} animate={{ clipPath: "inset(0% 0 0% 0)" }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
                    <Screen mode={mode} mi={mi} pi={pi} si={si} ei={ei} onPick={pick} onOpen={openCollection} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="bezel-cap">DOT MATRIX DISPLAY · PRESS START TO EXPLORE</p>
            </div>
            <p className="c-logo">K/V POCKET<sup>01</sup></p>
            <div className="c-ctrl">
              <div className="dp"><Btn k="up" cls="u">▲</Btn><Btn k="left" cls="l">◀</Btn><i /><Btn k="right" cls="r">▶</Btn><Btn k="down" cls="d">▼</Btn></div>
              <div className="ab"><Btn k="b" cls="abtn" label="B" /><Btn k="a" cls="abtn" label="A" /></div>
            </div>
            <div className="c-sys"><Btn k="b" cls="sys" label="SELECT" /><Btn k="start" cls="sys" label="START" /></div>
            <div className="grille" aria-hidden><i /><i /><i /><i /><i /><i /></div>
          </div>
        </div>
        <button type="button" className="pill con-pill" onClick={pickUp}>Pick up &amp; play <span>↗</span></button>
        <button type="button" className="pill col-pill" onClick={() => openCollection("web")}>Browse projects <span>↗</span></button>
      </div>

      <div className="play-bar">
        <button type="button" className="pill" onClick={putDown}>Put it down <span>↙</span></button>
        <p>Arrow keys move · Enter selects · Esc goes back</p>
      </div>

      <p className="desk-foot">WEB · MOBILE · AI · SAAS · CRM · ERP — BUILT END TO END.</p>
    </main>
  );
}
