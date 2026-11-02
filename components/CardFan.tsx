"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { APPS, CategoryId, MILLERSTORM, SITES } from "@/lib/projects";
import { DetailView } from "./Collection";

type Card = { key: string; name: string; cat: string; line: string; img: string; tint: string; kind: "ms" | "site" | "app"; i: number };
export const CARDS: Card[] = [
  { key: "ms", name: MILLERSTORM.name, cat: "Ongoing / CRM & enterprise", line: MILLERSTORM.full, img: MILLERSTORM.webShot, tint: "#7fd4ff", kind: "ms", i: 0 },
  ...SITES.map((s, i): Card => ({ key: s.id, name: s.name, cat: `Website / ${s.industry}`, line: s.category, img: s.shot, tint: "#f6c77c", kind: "site", i })),
  ...APPS.map((a, i): Card => ({ key: a.id, name: a.name, cat: `${a.platform} / ${a.industry}`, line: a.category, img: a.shots[0], tint: a.glow, kind: "app", i })),
];
export const FIRST_APP = 1 + SITES.length;
const pad = (n: number) => String(n).padStart(2, "0");

// "The K/V collection": every project as a foil trading card, fanned out over the blurred desk.
export default function CardFan({ start, onClose, onCollection }: { start: number; onClose: () => void; onCollection: (c: CategoryId) => void }) {
  const [at, setAt] = useState(start);
  const [det, setDet] = useState<{ kind: "site" | "app"; i: number } | null>(null);
  const n = CARDS.length, c = CARDS[at];
  const go = useCallback((d: number) => setAt((v) => (v + d + n) % n), [n]);
  const half = Math.floor(n / 2);
  const pull = useCallback(() => {
    const card = CARDS[at];
    if (card.kind === "ms") onCollection("crm");
    else setDet({ kind: card.kind, i: card.i });
  }, [at, onCollection]);

  useEffect(() => {
    if (det) return; // the detail view handles its own keys
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Enter") { e.preventDefault(); pull(); }
      else if (e.key === "Escape") onClose();
      else return;
      e.stopPropagation();
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [det, go, pull, onClose]);

  // Foil: a highlight and a rainbow sheen that follow the pointer across the front card.
  const foil = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`); el.style.setProperty("--my", `${y}%`);
    el.style.setProperty("--rx", `${(50 - y) / 7}deg`); el.style.setProperty("--ry", `${(x - 50) / 6}deg`);
  };
  const unfoil = (e: React.PointerEvent<HTMLElement>) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };

  return (
    <motion.div className="fan-wrap" role="dialog" aria-modal="true" aria-label="The K/V collection"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <header className="fan-top">
        <p>K/V COLLECTION<span> <i>/</i> SERIES 01</span></p>
        <div className="flex items-center gap-2">
          <button type="button" className="fan-chip" onClick={() => onCollection("web")}>Full collection ↗</button>
          <button type="button" className="fan-x" onClick={onClose} aria-label="Close">✕</button>
        </div>
      </header>
      <div className="fan-intro">
        <p className="fan-kick">Websites, apps and enterprise software.</p>
        <h2>The K/V collection.</h2>
        <p className="fan-sub">Move over a card for foil. Tap a card to explore.</p>
      </div>
      <div className="fan-stage">
        <div className="fan">
          {CARDS.map((card, i) => {
            const d = (((i - at) % n) + n + half) % n - half, ad = Math.abs(d); // wrap around so cards fan out on both sides
            return (
              <button key={card.key} type="button" className={`card ${d === 0 ? "on" : ""}`} aria-label={d === 0 ? `Open ${card.name}` : `Show ${card.name}`}
                style={{ "--d": d, "--ad": ad, "--tint": card.tint, zIndex: 50 - ad, opacity: ad > 5 ? 0 : 1 } as React.CSSProperties}
                onClick={() => (d === 0 ? pull() : setAt(i))} onPointerMove={d === 0 ? foil : undefined} onPointerLeave={d === 0 ? unfoil : undefined}>
                <span className="card-in">
                  <span className="card-top"><b>K/V ORIGINALS</b><i>✧</i></span>
                  <span className="card-name">{card.name}</span>
                  <span className="card-art"><img src={card.img} alt="" loading="lazy" /></span>
                  <span className="card-cat">{card.cat}</span>
                  <span className="card-foot"><span>SERIES 01</span><span>{pad(i + 1)} / {pad(n)}</span></span>
                </span>
                <span className="card-shine" aria-hidden />
              </button>
            );
          })}
        </div>
      </div>
      <div className="fan-info">
        <button type="button" className="fan-arrow" onClick={() => go(-1)} aria-label="Previous card">←</button>
        <div aria-live="polite">
          <p className="fan-count">{pad(at + 1)} / {pad(n)}</p>
          <p className="fan-name">{c.name}</p>
          <p className="fan-line">{c.line}</p>
        </div>
        <button type="button" className="fan-arrow" onClick={() => go(1)} aria-label="Next card">→</button>
      </div>
      <button type="button" className="fan-pull" onClick={pull}>{c.kind === "ms" ? "Open the case study" : "Pull this card"} <span aria-hidden>↗</span></button>
      <AnimatePresence>
        {det && (
          <div className="fan-det" style={{ "--acc": det.kind === "site" ? "#d9ef9f" : "#c58bff" } as React.CSSProperties}>
            <DetailView d={det} onClose={() => setDet(null)}
              onNav={(dir) => setDet((v) => v && { ...v, i: (v.i + dir + (v.kind === "site" ? SITES.length : APPS.length)) % (v.kind === "site" ? SITES.length : APPS.length) })} />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
