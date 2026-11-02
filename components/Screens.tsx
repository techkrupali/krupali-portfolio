import { HOME, MENU, Mode, Section } from "@/lib/content";
import { PROJECT_ROWS } from "@/lib/projects";

// What the console's screen shows while a section is open in the projected panel above it.
const PROJECTING: Record<Section, [string, string]> = {
  about: ["About", "About me."],
  exp: ["Experience", "Where I’ve built things."],
  stack: ["Tech stack", "My toolkit."],
  build: ["What I build", "Complete solutions."],
  contact: ["Contact", "Let’s build it."],
};

const Bar = ({ status }: { status: string }) => (
  <div className="lcd-bar"><span>K/V POCKET</span><span>{status}</span></div>
);

export function Screen({ mode, mi, pi, onPick, onRow }: {
  mode: Mode; mi: number; pi: number; onPick: (i: number) => void; onRow: (i: number) => void;
}) {
  if (mode === "home") return (
    <>
      <Bar status="READY" />
      <p className="lcd-kick">{HOME.kick}</p>
      <h2 className="lcd-title">{HOME.title}</h2>
      <p className="lcd-text">{HOME.text}</p>
      <div className="lcd-menu">
        {MENU.map(([id, label], i) => (
          <button key={id} type="button" className={`lcd-item ${i === mi ? "on" : ""}`} onClick={() => onPick(i)}>
            <span aria-hidden>{i === mi ? "▶" : ""}</span>{label}
          </button>
        ))}
      </div>
    </>
  );

  if (mode === "projects") return (
    <>
      <Bar status="PROJECTS" />
      <div className="lcd-head">
        <div><p className="lcd-kick">Select project</p><h2 className="lcd-title sm">Selected work.</h2></div>
        <span className="lcd-count">{pi + 1}/{PROJECT_ROWS.length}</span>
      </div>
      <div className="lcd-rows">
        {PROJECT_ROWS.map((r, i) => (
          <button key={r.id} type="button" className={`lcd-row ${i === pi ? "on" : ""}`} onClick={() => onRow(i)}>
            <span className="r1"><b>{i === pi ? "▶ " : ""}{r.name}</b><em>{r.action}</em></span>
            <span className="r2">{r.line}</span>
          </button>
        ))}
      </div>
    </>
  );

  const [status, title] = PROJECTING[mode];
  return (
    <>
      <Bar status={status.toUpperCase()} />
      <p className="lcd-kick">Now projecting</p>
      <h2 className="lcd-title">{title}</h2>
      <p className="lcd-text">Open above the console. Press B to close.</p>
      <div className="lcd-signal" aria-hidden><i /><i /><i /><i /><i /></div>
    </>
  );
}
