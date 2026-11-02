"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  APPS, CATEGORIES, CategoryId, INDUSTRIES, MILLERSTORM, MORE_PROJECTS, Product, SITES, Status, host, projectCount,
} from "@/lib/projects";

type Detail = { kind: "site" | "app"; i: number } | null;
const pad = (n: number) => String(n).padStart(2, "0");
const ease = [0.2, 0.8, 0.2, 1] as const;

// Big title whose letters rise into place.
function Title({ text, className }: { text: string; className?: string }) {
  let n = 0;
  return (
    <h2 className={className} aria-label={text}>
      {text.split(" ").map((w, wi) => (
        <span key={wi} className="rise-word" aria-hidden>
          {[...w].map((ch, ci) => (
            <motion.span key={ci} className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 + n++ * 0.022, ease }}>{ch}</motion.span>
          ))}
        </span>
      ))}
    </h2>
  );
}
// Letters that ripple when the card is hovered.
const Wave = ({ text }: { text: string }) => (
  <span className="wave" aria-label={text}>
    {[...text].map((c, i) => <span key={i} aria-hidden style={{ "--i": i } as React.CSSProperties}>{c === " " ? " " : c}</span>)}
  </span>
);
const Badge = ({ status }: { status: Status }) => <span className={`badge ${status}`}>{status === "ongoing" ? "Ongoing" : "Live"}</span>;

function Browser({ url, shot, name, onOpen }: { url: string; shot: string; name: string; onOpen?: () => void }) {
  const img = <img src={shot} alt={`${name} website, homepage`} loading="lazy" decoding="async" />;
  return (
    <div className="browser">
      <div className="browser-bar"><i /><i /><i /><span>{host(url)}</span></div>
      {onOpen
        ? <button type="button" className="browser-view" onClick={onOpen} aria-label={`Open ${name} details`}>{img}<span className="hint">Hover to scroll · click for details</span></button>
        : <div className="browser-scroll" tabIndex={0}>{img}</div>}
    </div>
  );
}

// Phone mockup: tilts toward the mouse, click the screen (or a dot) to flip through real screenshots.
export function Device({ platform, shots, name, auto }: { platform: "iOS" | "Android"; shots: string[]; name: string; auto?: boolean }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setI((v) => (v + 1) % shots.length), 3200);
    return () => clearInterval(t);
  }, [auto, shots.length]);
  const tilt = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -12}deg`);
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 18}deg`);
  };
  const reset = () => { ref.current?.style.setProperty("--rx", "0deg"); ref.current?.style.setProperty("--ry", "0deg"); };
  return (
    <div className="dev-wrap">
      <div ref={ref} className={`dev ${platform === "iOS" ? "ios" : "android"}`} onMouseMove={tilt} onMouseLeave={reset}>
        <button type="button" className="dev-screen" onClick={() => setI((i + 1) % shots.length)} aria-label={`Next ${name} screenshot`}>
          {shots.map((s, k) => <img key={s} src={s} alt={k === i ? `${name} screenshot ${k + 1} of ${shots.length}` : ""} className={k === i ? "on" : ""} loading="lazy" decoding="async" />)}
        </button>
      </div>
      <div className="dev-dots">
        {shots.map((_, k) => <button key={k} type="button" className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Show ${name} screenshot ${k + 1}`} />)}
      </div>
    </div>
  );
}

function useRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0), [scrollable, setScrollable] = useState(false);
  const step = () => {
    const r = ref.current!, c = r.children[0] as HTMLElement;
    return c.offsetWidth + parseFloat(getComputedStyle(r).columnGap || "0");
  };
  useEffect(() => {
    const r = ref.current; if (!r) return;
    const check = () => setScrollable(r.scrollWidth > r.clientWidth + 4);
    check();
    const ro = new ResizeObserver(check); ro.observe(r);
    return () => ro.disconnect();
  }, []);
  const onScroll = () => {
    const r = ref.current; if (!r) return;
    const end = r.scrollLeft >= r.scrollWidth - r.clientWidth - 4;
    setAt(end ? r.children.length - 1 : Math.round(r.scrollLeft / step()));
  };
  const go = (d: number) => ref.current?.scrollBy({ left: d * step(), behavior: "smooth" });
  return { ref, at, go, onScroll, scrollable };
}
const RailNav = ({ at, n, go }: { at: number; n: number; go: (d: number) => void }) => (
  <div className="rail-nav">
    <button type="button" onClick={() => go(-1)} disabled={at <= 0} aria-label="Previous project">←</button>
    <span>{pad(at + 1)} / {pad(n)}</span>
    <button type="button" onClick={() => go(1)} disabled={at >= n - 1} aria-label="Next project">→</button>
  </div>
);

function Websites({ onOpen }: { onOpen: (i: number) => void }) {
  const r = useRail();
  return (<>
    <div ref={r.ref} onScroll={r.onScroll} className="rail">
      {SITES.map((s, i) => (
        <article key={s.id} className="web-card">
          <Browser url={s.url} shot={s.shot} name={s.name} onOpen={() => onOpen(i)} />
          <div className="web-meta">
            <div>
              <p className="kick">{pad(i + 1)} · {s.industry}</p>
              <h3 className="web-name"><Wave text={s.name} /></h3>
              <p className="cat-line">{s.category}</p>
            </div>
            <div>
              <p className="ov">{s.overview}</p>
              <div className="acts">
                <Badge status={s.status} />
                <a className="pill pill-sm" href={s.url} target="_blank" rel="noopener noreferrer">Visit site <span>↗</span></a>
                <button type="button" className="pill pill-sm pill-line" onClick={() => onOpen(i)}>Details</button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
    {r.scrollable && <RailNav at={r.at} n={SITES.length} go={r.go} />}
  </>);
}

function Apps({ onOpen }: { onOpen: (i: number) => void }) {
  const r = useRail();
  return (<>
    <div ref={r.ref} onScroll={r.onScroll} className="rail">
      {APPS.map((a, i) => (
        <article key={a.id} className="app-stage" style={{ "--glow": a.glow } as React.CSSProperties}>
          <Device platform={a.platform} shots={a.shots} name={a.name} />
          <div className="app-meta">
            <div className="app-id">
              <img className="app-icon" src={a.icon} alt={`${a.name} app icon`} width={52} height={52} loading="lazy" />
              <div><h3 className="app-name"><Wave text={a.name} /></h3><p className="cat-line">{a.category}</p></div>
            </div>
            <div className="acts"><span className="badge plat">{a.platform}</span><Badge status={a.status} /></div>
            <p className="ov">{a.overview}</p>
            <div className="acts">
              <a className="pill pill-sm" href={a.store} target="_blank" rel="noopener noreferrer">{a.platform === "iOS" ? "App Store" : "Google Play"} <span>↗</span></a>
              <button type="button" className="pill pill-sm pill-line" onClick={() => onOpen(i)}>Details</button>
            </div>
          </div>
        </article>
      ))}
    </div>
    {r.scrollable && <RailNav at={r.at} n={APPS.length} go={r.go} />}
  </>);
}

export const Laptop = ({ shot }: { shot: string }) => (
  <div className="laptop"><div className="laptop-lid"><div className="laptop-screen pan"><img src={shot} alt="MillerStorm business website" loading="lazy" /></div></div><div className="laptop-base" /></div>
);
export const Monitor = ({ shot }: { shot: string }) => (
  <div className="monitor">
    <div className="monitor-body"><div className="monitor-screen"><img src={shot} alt="MillerStorm internal CRM sign-in screen" loading="lazy" /></div><div className="monitor-chin" /></div>
    <div className="monitor-neck" /><div className="monitor-foot" />
  </div>
);
const Flow = () => <div className="ms-link" aria-hidden><span className="ms-line" /><span className="ms-arrow" /><span className="ms-dot" /></div>;

function MillerStorm() {
  const [sel, setSel] = useState<Product["id"]>("web");
  const p = MILLERSTORM.products.find((x) => x.id === sel)!;
  const node = (prod: Product, device: React.ReactNode) => (
    <div className={`ms-node ${sel === prod.id ? "on" : ""}`} onClick={() => setSel(prod.id)} data-hot>
      {device}
      <button type="button" className="ms-tag" aria-pressed={sel === prod.id} onClick={(e) => { e.stopPropagation(); setSel(prod.id); }}>{prod.no} · {prod.label}</button>
    </div>
  );
  const [web, app, crm] = MILLERSTORM.products;
  return (
    <div className="ms">
      <div className="ms-head">
        <div className="ms-h1">
          <p className="kick">Featured case study</p>
          <Title text={MILLERSTORM.name} className="ms-title" />
        </div>
        <div>
          <p className="ms-full">{MILLERSTORM.full}</p>
          <div className="acts mt-3"><Badge status={MILLERSTORM.status} /><span className="badge plain">{MILLERSTORM.involvement}</span></div>
        </div>
        <p className="ms-sum">{MILLERSTORM.summary}</p>
      </div>

      <p className="ms-flowtext">Business website<b>→</b>Mobile application<b>→</b>Internal CRM</p>
      <div className="ms-eco">
        {node(web, <Laptop shot={MILLERSTORM.webShot} />)}
        <Flow />
        {node(app, <Device platform="iOS" shots={MILLERSTORM.appShots} name="MillerStorm app" auto />)}
        <Flow />
        {node(crm, <Monitor shot={MILLERSTORM.crmShot} />)}
      </div>
      <p className="ms-tip">Select a product to explore what I built.</p>

      <AnimatePresence mode="wait">
        <motion.div key={sel} className="ms-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          <div>
            <p className="kick">{p.no} · {p.label}</p>
            <h3 className="ms-ptitle">{p.label}</h3>
            <p className="ov">{p.about}</p>
            <a className="pill pill-sm" href={p.url} target="_blank" rel="noopener noreferrer">{p.linkLabel} <span>↗</span></a>
          </div>
          <div>
            <p className="kick">What I built</p>
            <ul className="ms-built">{p.built.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="ms-foot">
        <div>
          <p className="kick">Timeline</p>
          <ol className="ms-tl">
            {MILLERSTORM.timeline.map((t) => <li key={t.when} className={t.live ? "live" : ""}><span className="tl-when">{t.when}</span><span className="tl-what">{t.what}</span></li>)}
          </ol>
        </div>
        <div>
          <p className="kick">Technology</p>
          <ul className="ms-tech">{MILLERSTORM.tech.map(([k, v]) => <li key={k}><span>{k}</span><b>{v}</b></li>)}</ul>
          <div className="acts mt-6">
            {MILLERSTORM.products.map((x) => <a key={x.id} className="pill pill-sm pill-line" href={x.url} target="_blank" rel="noopener noreferrer">{x.linkLabel} <span>↗</span></a>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DetailView({ d, onClose, onNav }: { d: NonNullable<Detail>; onClose: () => void; onNav: (dir: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [onClose, onNav]);

  const site = d.kind === "site" ? SITES[d.i] : null;
  const app = d.kind === "app" ? APPS[d.i] : null;
  const item = (site ?? app)!;
  const n = site ? SITES.length : APPS.length;
  const link = site ? site.url : app!.store;
  return (
    <motion.div className="det" role="dialog" aria-modal="true" aria-label={`${item.name} details`}
      initial={{ clipPath: "inset(50% 0 50% 0)" }} animate={{ clipPath: "inset(0% 0 0% 0)" }} exit={{ clipPath: "inset(50% 0 50% 0)" }} transition={{ duration: 0.45, ease }}>
      <div className="det-bar">
        <p className="kick">{site ? "01 · Business Websites" : "02 · Mobile Applications"} — {pad(d.i + 1)} / {pad(n)}</p>
        <div className="acts">
          <button type="button" className="pill pill-sm pill-line" onClick={() => onNav(-1)}>← Prev</button>
          <button type="button" className="pill pill-sm pill-line" onClick={() => onNav(1)}>Next →</button>
          <button ref={closeRef} type="button" className="pill pill-sm" onClick={onClose}>Close ✕</button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={d.kind + d.i} className="det-grid" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <div className={`det-media ${app ? "app" : ""}`} style={app ? ({ "--glow": app.glow } as React.CSSProperties) : undefined}>
            {site && <Browser url={site.url} shot={site.shot} name={site.name} />}
            {app && <>
              <Device platform={app.platform} shots={app.shots} name={app.name} auto />
              <div className="det-strip">{app.shots.map((s, k) => <img key={s} src={s} alt={`${app.name} screenshot ${k + 1}`} loading="lazy" />)}</div>
            </>}
          </div>
          <div className="det-info">
            {app && <img className="app-icon lg" src={app.icon} alt={`${app.name} app icon`} width={72} height={72} />}
            <Title text={item.name} className="det-title" />
            <p className="cat-line">{item.category}</p>
            <div className="acts mt-4"><Badge status={item.status} />{app && <span className="badge plat">{app.platform}</span>}</div>
            <dl className="det-dl">
              <div><dt>Overview</dt><dd>{item.overview}</dd></div>
              <div><dt>Industry</dt><dd>{item.industry}</dd></div>
              {item.contribution?.length ? <div><dt>My contribution</dt><dd><ul>{item.contribution.map((c) => <li key={c}>{c}</li>)}</ul></dd></div> : null}
              {item.tech?.length ? <div><dt>{site ? "Platform" : "Technologies"}</dt><dd>{item.tech.map((t) => <span key={t} className="chip2">{t}</span>)}</dd></div> : null}
            </dl>
            <a className="pill" href={link} target="_blank" rel="noopener noreferrer">
              {site ? `Visit ${host(site.url)}` : app!.platform === "iOS" ? "View on the App Store" : "View on Google Play"} <span>↗</span>
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function Collection({ initial, onExit, onSimple, playing, onStopMusic }: {
  initial: CategoryId; onExit: () => void; onSimple: () => void; playing: boolean; onStopMusic: () => void;
}) {
  const [cat, setCat] = useState<CategoryId>(initial);
  const [detail, setDetail] = useState<Detail>(null);
  useEffect(() => setCat(initial), [initial]);
  const c = CATEGORIES.find((x) => x.id === cat)!;
  const close = useCallback(() => setDetail(null), []);
  const nav = useCallback((dir: number) => setDetail((d) => {
    if (!d) return d;
    const n = d.kind === "site" ? SITES.length : APPS.length;
    return { ...d, i: (d.i + dir + n) % n };
  }), []);

  return (
    <div className="col" data-cat={cat}>
      <div className="col-bg" aria-hidden><i className="b-web" /><i className="b-apps" /><i className="b-crm" /></div>
      <div className="col-in">
        <header className="col-top">
          <button type="button" className="pill pill-dark" onClick={onExit}>← Back to the desk</button>
          <p className="col-brand">K/V COLLECTION · 01</p>
          <div className="acts">
            {playing && <button type="button" className="pill pill-dark" onClick={onStopMusic}>♪ Lift the needle</button>}
            <button type="button" className="pill pill-dark" onClick={onSimple}>Simple view <span>↗</span></button>
          </div>
        </header>

        <div className="marquee" role="img" aria-label={`Industries: ${INDUSTRIES.join(", ")}`}>
          <div>{[...INDUSTRIES, ...INDUSTRIES].map((x, i) => <span key={i}>{x}</span>)}</div>
        </div>

        <section className="col-intro">
          <p className="kick">Selected work</p>
          <h1 className="col-h1">Complete digital products across web, mobile and backend systems.</h1>
        </section>

        <div className="carts" role="tablist" aria-label="Project categories">
          {CATEGORIES.map((x) => (
            <button key={x.id} type="button" role="tab" id={`tab-${x.id}`} aria-selected={cat === x.id} aria-controls="col-panel"
              className="ct" style={{ "--c": x.color } as React.CSSProperties}
              onClick={() => { setCat(x.id); window.history.replaceState(null, "", x.id === "web" ? "?view=projects" : `?view=projects&cat=${x.id}`); }}>
              <span className="ct-ridge" />
              <span className="ct-no">Cartridge {x.no}</span>
              <span className="ct-name">{x.name}</span>
              <span className="ct-count">{x.id === "crm" ? "Featured case study" : `${projectCount(x.id)} projects`}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.section key={cat} id="col-panel" role="tabpanel" aria-labelledby={`tab-${cat}`} className="col-panel"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.55, ease }}>
            {cat !== "crm" && (
              <div className="cat-head">
                <p className="kick">{c.no} — {cat === "web" ? `${SITES.length} live websites` : `${APPS.length} apps · iOS & Android`}</p>
                <Title text={c.name} className="cat-title" />
                <p className="cat-blurb">{c.blurb}</p>
              </div>
            )}
            {cat === "web" && <Websites onOpen={(i) => setDetail({ kind: "site", i })} />}
            {cat === "apps" && <Apps onOpen={(i) => setDetail({ kind: "app", i })} />}
            {cat === "crm" && <MillerStorm />}
          </motion.section>
        </AnimatePresence>

        <footer className="col-more">
          <p className="kick">Also worked on</p>
          <p>{MORE_PROJECTS.map(([name, what]) => <span key={name}><b>{name}</b>{what}</span>)}</p>
        </footer>
      </div>
      <AnimatePresence>{detail && <DetailView d={detail} onClose={close} onNav={nav} />}</AnimatePresence>
    </div>
  );
}
