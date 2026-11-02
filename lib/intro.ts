// Plays the spoken intro when the record is put on: the browser reads INTRO aloud in a female English voice,
// or plays INTRO_AUDIO if a recording is set. Either way, captions follow along line by line.
import { INTRO, INTRO_AUDIO } from "./content";

// Captions are one sentence each. Very long sentences are split once at a comma,
// because some browsers stop speaking in the middle of long sentences.
const splitLong = (s: string): string[] => {
  if (s.length <= 170) return [s];
  let best = -1;
  for (let i = s.indexOf(","); i !== -1; i = s.indexOf(",", i + 1)) if (best === -1 || Math.abs(i - s.length / 2) < Math.abs(best - s.length / 2)) best = i;
  return best === -1 ? [s] : [s.slice(0, best + 1), s.slice(best + 2)];
};
export const INTRO_LINES = INTRO.flatMap((p) => p.replace(/([.!?])\s+/g, "$1\n").split("\n")).flatMap(splitLong);

// How technical words should be pronounced (captions keep the original spelling).
const SAY: [RegExp, string][] = [
  [/\.js\b/g, " J S"], [/MongoDB/g, "Mongo D B"], [/PostgreSQL/g, "Postgres Q L"], [/MySQL/g, "My S Q L"],
  [/OpenAI/g, "Open A I"], [/\bAPIs\b/g, "A P Is"], [/\bAPI\b/g, "A P I"], [/\bAI\b/g, "A I"],
];
const speakable = (s: string) => SAY.reduce((t, [re, r]) => t.replace(re, r), s);

// Natural-sounding female English voices, best first: Edge's neural voices, Apple's premium voices,
// Google's voices in Chrome and Android, then the standard Apple and Windows voices.
const PREFERRED = [
  /Microsoft (Ava|Emma|Jenny|Aria|Michelle|Sonia|Libby|Natasha|Clara).*Natural/i,
  /\b(Ava|Zoe|Allison|Samantha|Susan|Serena|Kate|Nicky)\b.*\((Premium|Enhanced)\)/i,
  /^Google US English$/i,
  /Google UK English Female/i,
  /^(Samantha|Ava|Zoe|Allison|Susan|Nicky)\b/i,
  /Microsoft (Zira|Hazel|Susan|Heera|Catherine|Linda)/i,
  /^(Serena|Kate|Karen|Moira|Tessa|Fiona|Victoria)\b/i,
  /en[-_](us|gb).*female|female.*en[-_](us|gb)/i,
];
function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
  for (const re of PREFERRED) {
    const v = voices.find((x) => re.test(x.name) || re.test(`${x.lang} ${x.name}`));
    if (v) return v;
  }
  return voices.find((v) => /^en[-_]US/i.test(v.lang)) ?? voices[0] ?? null;
}
// Chrome loads its voice list lazily; asking early means it's ready by the time someone clicks.
export const warmVoices = () => { if ("speechSynthesis" in window) window.speechSynthesis.getVoices(); };

const RATE = 0.96; // a touch slower than default: clear and confident
const NEEDLE = 900; // ms until the tonearm lands (matches the CSS transition)

export function createIntro() {
  let alive = false;
  let timers: number[] = [];
  let audio: HTMLAudioElement | null = null;
  let queue: SpeechSynthesisUtterance[] = []; // kept referenced so Chrome doesn't drop queued lines

  const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };
  const stop = () => {
    alive = false;
    timers.forEach(clearTimeout); timers = [];
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    audio?.pause(); audio = null;
    queue = [];
  };

  return {
    stop,
    // Call from the click handler. onLine(i) fires as each caption line starts; onEnd when the intro finishes.
    start(onLine: (i: number) => void, onEnd: () => void) {
      stop();
      alive = true;
      const done = () => { if (alive) { stop(); onEnd(); } };
      // Captions only, used when the browser can't speak.
      const captionsFrom = (from: number, delay: number) => {
        let t = delay;
        for (let i = from; i < INTRO_LINES.length; i++) { const k = i; later(() => alive && onLine(k), t); t += INTRO_LINES[i].split(" ").length * 380 + 250; }
        later(done, t + 400);
      };

      if (INTRO_AUDIO) {
        const a = (audio = new Audio(INTRO_AUDIO));
        const total = INTRO_LINES.reduce((n, l) => n + l.length, 0);
        let acc = 0;
        const ends = INTRO_LINES.map((l) => (acc += l.length) / total);
        a.ontimeupdate = () => {
          if (!alive || !a.duration) return;
          const i = ends.findIndex((e) => a.currentTime / a.duration <= e);
          onLine(i === -1 ? INTRO_LINES.length - 1 : i);
        };
        a.onended = done;
        later(() => { if (alive) a.play().catch(() => captionsFrom(0, 0)); }, NEEDLE);
        return;
      }

      const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
      if (!synth) return captionsFrom(0, NEEDLE);
      // iOS only lets a page start speaking from inside a tap, so say something silent right away.
      const unlock = new SpeechSynthesisUtterance(" ");
      unlock.volume = 0;
      synth.speak(unlock);

      let fellBack = false;
      const speakAll = () => {
        if (!alive) return;
        const voice = pickVoice();
        queue = INTRO_LINES.map((line, i) => {
          const u = new SpeechSynthesisUtterance(speakable(line));
          if (voice) u.voice = voice;
          u.lang = voice?.lang ?? "en-US";
          u.rate = RATE;
          u.pitch = 1;
          u.onstart = () => { if (alive) onLine(i); };
          if (i === INTRO_LINES.length - 1) u.onend = done;
          u.onerror = (e) => {
            if (!alive || fellBack || e.error === "interrupted" || e.error === "canceled") return;
            fellBack = true; // the voice failed (e.g. offline): keep going with captions only
            synth.cancel();
            captionsFrom(i, 0);
          };
          return u;
        });
        queue.forEach((u) => synth.speak(u));
      };
      later(() => {
        if (synth.getVoices().length) return speakAll();
        synth.addEventListener("voiceschanged", speakAll, { once: true });
        later(() => { synth.removeEventListener("voiceschanged", speakAll); if (alive && !queue.length) speakAll(); }, 1200);
      }, NEEDLE);
    },
  };
}
