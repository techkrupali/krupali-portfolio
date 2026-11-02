// Decorative record player face. The arm swings and the record spins when `playing` is true (see .tt.on in globals.css).
export default function Turntable({ playing }: { playing: boolean }) {
  return (
    <div className={`tt ${playing ? "on" : ""}`}>
      <span className="tt-hinge l" /><span className="tt-hinge r" />
      <p className="tt-brand"><b>K/V</b>STEREO<span>DIRECT DRIVE · HIGH FIDELITY</span></p>
      <p className="tt-model">KV-01</p>
      <div className="tt-platter">
        <div className="tt-vinyl"><div className="tt-label"><span>K/V RECORDS</span><span>SIDE A · INTRO</span></div></div>
        <div className="tt-sheen" />
        <div className="tt-spindle" />
      </div>
      <svg className="tt-arm" viewBox="0 0 460 400" aria-hidden>
        <circle cx="398" cy="78" r="27" fill="#d2d2ce" stroke="#a5a5a0" strokeWidth="1.5" />
        <circle cx="398" cy="78" r="17" fill="#ebebe8" />
        <rect x="410" y="230" width="16" height="10" rx="2" fill="#9a9a96" />
        <g className="arm">
          <path d="M398 78 L398 50" stroke="#8a8a86" strokeWidth="5" />
          <rect x="386" y="18" width="24" height="34" rx="3" fill="#1f1f22" transform="rotate(-14 398 78)" />
          <path d="M398 78 L403 252 Q405 292 383 314" fill="none" stroke="#7e7e7a" strokeWidth="7" strokeLinecap="round" />
          <path d="M398 78 L403 252 Q405 292 383 314" fill="none" stroke="#ececea" strokeWidth="4" strokeLinecap="round" />
          <g transform="rotate(42 383 314)">
            <rect x="371" y="306" width="26" height="15" rx="2" fill="#26262a" />
            <rect x="373" y="319" width="10" height="5" rx="1" fill="#c0392b" />
          </g>
          <circle cx="398" cy="78" r="8" fill="#2a2a2e" />
          <circle cx="396" cy="76" r="2.5" fill="#6a6a70" />
        </g>
      </svg>
      <div className="tt-pitch"><span>PITCH</span></div>
      <div className="tt-ss" />
      <p className="tt-speed"><i />33<span>45</span></p>
    </div>
  );
}
