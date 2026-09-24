import { useEffect, useState } from "react";
/** Kleine helper rond de Web Speech API (nl-NL, natuurlijk tempo). */

/** Stemmen die duidelijk natuurlijker klinken dan de standaard eSpeak-stem. */
const VOORKEUR = [
  "google nederlands",
  "google nl",
  "microsoft fenna",
  "microsoft colette",
  "microsoft maarten",
  "xander",
  "ellen",
  "claire",
  "lotte",
  "nederlands",
];

const ROBOT = ["espeak", "pico", "compact", "festival", "flite"];

function score(v: SpeechSynthesisVoice) {
  const naam = `${v.name} ${v.voiceURI}`.toLowerCase();
  if (ROBOT.some((r) => naam.includes(r))) return -1;
  let s = 0;
  const i = VOORKEUR.findIndex((p) => naam.includes(p));
  if (i >= 0) s += 100 - i;
  // Netwerkstemmen (niet 'localService') zijn vrijwel altijd neuraal en natuurlijk.
  if (!v.localService) s += 40;
  if (naam.includes("natural") || naam.includes("neural") || naam.includes("premium") || naam.includes("enhanced"))
    s += 60;
  if (v.lang?.toLowerCase() === "nl-nl") s += 10;
  return s;
}

/** Kies de meest natuurlijke beschikbare Nederlandse stem. */
export function kiesStem(): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined") return undefined;
  const alle = window.speechSynthesis?.getVoices?.() ?? [];
  const nl = alle.filter((v) => v.lang?.toLowerCase().startsWith("nl"));
  if (!nl.length) return undefined;
  return [...nl].sort((a, b) => score(b) - score(a))[0];
}

/** Warm de stemmenlijst op; sommige browsers laden die asynchroon. */
export function laadStemmen(onKlaar?: () => void) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  if (synth.getVoices().length) {
    onKlaar?.();
    return;
  }
  const handler = () => {
    synth.removeEventListener("voiceschanged", handler);
    onKlaar?.();
  };
  synth.addEventListener("voiceschanged", handler);
}

/* ---------- Spreektempo (live aanpasbaar) ---------- */

const TEMPO_KEY = "doktertijd-tempo";
const TEMPO_EVENT = "doktertijd-tempo-change";
export const TEMPO_MIN = 0.8;
export const TEMPO_MAX = 2;
const TEMPO_STANDAARD = 1.3;

let tempo = TEMPO_STANDAARD;
if (typeof window !== "undefined") {
  const opgeslagen = Number(window.localStorage.getItem(TEMPO_KEY));
  if (Number.isFinite(opgeslagen) && opgeslagen >= TEMPO_MIN && opgeslagen <= TEMPO_MAX) tempo = opgeslagen;
}

export function getTempo() {
  return tempo;
}

/** Zet het spreektempo direct; lopende zinnen volgen bij de volgende zin. */
export function setTempo(waarde: number) {
  tempo = Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, Math.round(waarde * 20) / 20));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TEMPO_KEY, String(tempo));
    window.dispatchEvent(new CustomEvent(TEMPO_EVENT, { detail: tempo }));
  }
  return tempo;
}

export function opTempoWijziging(fn: (t: number) => void) {
  if (typeof window === "undefined") return () => {};
  const h = (e: Event) => fn((e as CustomEvent<number>).detail);
  window.addEventListener(TEMPO_EVENT, h);
  return () => window.removeEventListener(TEMPO_EVENT, h);
}

/* ---------- Eigen stem herkennen (anti-loop) ---------- */

let laatstSprak = 0;

/**
 * True zolang de synthese praat (plus een korte nagalm), zodat de
 * spraakherkenning niet op de eigen stem reageert en in een loop belandt.
 */
export function spraakBezig() {
  if (typeof window === "undefined") return false;
  const synth = window.speechSynthesis;
  if (!synth) return false;
  if (synth.speaking || synth.pending) {
    laatstSprak = Date.now();
    return true;
  }
  return Date.now() - laatstSprak < 900;
}

/** Zet tekst om in natuurlijker spraak: adempauzes en minder monotone prosodie. */
export function stemInstellingen(u: SpeechSynthesisUtterance) {
  const stem = kiesStem();
  if (stem) u.voice = stem;
  u.lang = "nl-NL";
  u.rate = tempo;
  u.pitch = 1.02;
  u.volume = 1;
  laatstSprak = Date.now();
}

/** Splits een alinea in korte zinnen, zodat er echte adempauzes ontstaan. */
export function zinnen(tekst: string): string[] {
  return tekst
    .split(/(?<=[.!?…])\s+/)
    .map((z) => z.trim())
    .filter(Boolean);
}

export function spreekUit(tekst: string, onEnd?: () => void) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) {
    onEnd?.();
    return;
  }
  synth.cancel();

  const delen = zinnen(tekst);
  if (!delen.length) {
    onEnd?.();
    return;
  }

  const spreekDeel = (i: number) => {
    if (i >= delen.length) {
      onEnd?.();
      return;
    }
    const u = new SpeechSynthesisUtterance(delen[i]!);
    stemInstellingen(u);
    u.onend = () => setTimeout(() => spreekDeel(i + 1), 140);
    u.onerror = () => onEnd?.();
    synth.speak(u);
  };

  if (synth.getVoices().length) spreekDeel(0);
  else laadStemmen(() => spreekDeel(0));
}

export function stopSpraak() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}

/** React-hook om het tempo live te lezen en te zetten. */
export function useTempo(): [number, (t: number) => void] {
  const [t, setT] = useState(getTempo());
  useEffect(() => opTempoWijziging(setT), []);
  return [t, (w: number) => setT(setTempo(w))];
}
