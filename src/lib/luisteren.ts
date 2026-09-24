/** Spraakherkenning (nl-NL) via de Web Speech API. Geen toetsenbord nodig. */
import { useCallback, useEffect, useRef, useState } from "react";
import { spraakBezig } from "@/lib/spraak";

type Herkenner = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

function maakHerkenner(): Herkenner | null {
  if (typeof window === "undefined") return null;
  const C =
    (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null;
  if (!C) return null;
  const r: Herkenner = new C();
  r.lang = "nl-NL";
  r.continuous = true;
  r.interimResults = true;
  return r;
}

export function useLuisteren(onZin: (tekst: string) => void) {
  const [steun, setSteun] = useState(false);
  const [actief, setActief] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [fout, setFout] = useState<string | null>(null);
  const ref = useRef<Herkenner | null>(null);
  const wil = useRef(false);
  const cb = useRef(onZin);
  cb.current = onZin;

  useEffect(() => {
    setSteun(
      typeof window !== "undefined" &&
        Boolean((window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition),
    );
    return () => {
      wil.current = false;
      ref.current?.abort();
      ref.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (ref.current) return;
    setFout(null);
    const r = maakHerkenner();
    if (!r) {
      setSteun(false);
      return;
    }
    ref.current = r;
    wil.current = true;
    r.onresult = (e: any) => {
      // Negeer alles wat binnenkomt terwijl de agent zelf praat: anders
      // hoort de microfoon de eigen stem en herhaalt hij zichzelf eindeloos.
      if (spraakBezig()) return;
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const res = e.results[i];
        const tekst = String(res[0]?.transcript ?? "").trim();
        if (res.isFinal) {
          setTranscript(tekst);
          if (tekst) cb.current(tekst);
        } else {
          interim += ` ${tekst}`;
        }
      }
      if (interim.trim()) setTranscript(interim.trim());
    };
    r.onerror = (e: any) => {
      const soort = String(e?.error ?? "");
      if (soort === "no-speech" || soort === "aborted") return;
      if (soort === "not-allowed" || soort === "service-not-allowed") {
        wil.current = false;
        setFout("Microfoon geweigerd — geef deze pagina toegang tot je microfoon.");
      } else if (soort === "audio-capture") {
        wil.current = false;
        setFout("Geen microfoon gevonden.");
      } else if (soort === "network") {
        setFout("Spraakherkenning kreeg geen verbinding met de herkenningsdienst.");
      }
    };

    r.onend = () => {
      // Browsers stoppen vanzelf; zolang de dokter luistert, herstarten we.
      if (!wil.current) {
        setActief(false);
        return;
      }
      try {
        r.start();
      } catch {
        setActief(false);
      }
    };
    try {
      r.start();
      setActief(true);
    } catch {
      setActief(false);
    }
  }, []);

  const stop = useCallback(() => {
    wil.current = false;
    ref.current?.stop();
    ref.current = null;
    setActief(false);
  }, []);

  return { steun, actief, transcript, fout, start, stop, setTranscript };
}

const STOPWOORDEN = new Set([
  "de","het","een","is","zijn","haar","hij","zij","wat","was","hoe","mag","ik","je","jij",
  "en","of","van","voor","met","bij","op","in","te","er","nog","al","dat","die","dit","heeft",
  "had","wordt","worden","om","naar","zo","ook","niet","wel","wanneer","waar","welke","laatste",
]);

function woorden(t: string): string[] {
  return t
    .toLowerCase()
    .replace(/[^a-zà-ÿ0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWOORDEN.has(w));
}

/**
 * Kies de best passende vraag op basis van woordoverlap.
 * De vraag telt dubbel; woorden uit het antwoord tellen mee, zodat
 * "wat was zijn laatste kalium" ook de nierfunctie-uitslag vindt.
 */
export function matchVraag<T extends { vraag: string; antwoord?: string }>(
  gezegd: string,
  opties: T[],
): T | undefined {
  const g = woorden(gezegd);
  if (!g.length) return undefined;
  const overlap = (bron: string[]) =>
    bron.filter((x) => g.some((y) => y.startsWith(x.slice(0, 5)) || x.startsWith(y.slice(0, 5)))).length;
  let beste: T | undefined;
  let score = 0;
  for (const o of opties) {
    const s = overlap(woorden(o.vraag)) * 2 + overlap(woorden(o.antwoord ?? ""));
    if (s > score) {
      score = s;
      beste = o;
    }
  }
  return score >= 1 ? beste : undefined;
}


export function bevat(tekst: string, woordenlijst: string[]): boolean {
  const t = tekst.toLowerCase();
  return woordenlijst.some((w) => t.includes(w));
}
