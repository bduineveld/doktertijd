import { useCallback, useEffect, useRef, useState } from "react";
import { laadStemmen, stemInstellingen, zinnen } from "@/lib/spraak";

export const BRIEFING_ALINEAS = [
  "Goeiemorgen, dokter.",
  "Vandaag wordt geen drukke dag. Je ziet alleen wat jouw aandacht vraagt.",
  "Drie dingen van vannacht.",
  "Mevrouw Groot, die je gisteren naar de cardioloog hebt ingestuurd, is vannacht opgenomen. Ze ligt op de hartbewaking. Jij hoeft nu niets te doen.",
  "Meneer Visser is vannacht thuis overleden. De huisartsenpost heeft de familie gezien. Ik heb vanmiddag een belafspraak met de dochter klaargezet. Dat gesprek automatiseer ik niet.",
  "En mevrouw Prins, voor wie jij de palliatieve zorg doet, heeft vannacht contact gehad met de huisartsenpost. Extra morfine, pijn onder controle. Geen visite nodig.",
  "Verder zijn vannacht zevenenveertig zorggebeurtenissen autonoom afgehandeld. Je ziet ze onder water. Niet in je werkdag.",
];

const KAARTEN = [
  {
    label: "Opgenomen",
    naam: "A. Groot, 62",
    regels: ["Jouw verwijzing van gisteren", "Hartbewaking", "Geen actie nodig"],
  },
  {
    label: "Overleden",
    naam: "H. Visser, 71",
    regels: ["Thuis overleden vannacht", "HAP is bij de familie geweest", "Vanmiddag bel je de dochter"],
  },
  {
    label: "Palliatief · HAP",
    naam: "C. Prins, 78",
    regels: ["Contact met de huisartsenpost", "Extra morfine, pijn onder controle", "Geen visite nodig"],
  },
];

type Status = "idle" | "spreekt" | "pauze" | "klaar" | "geblokkeerd";

const MAX_DELEGATIE_ZIN =
  "Je hebt mij volledig autonoom laten werken. Foto's en overlegjes zie je vandaag niet.";

export function MorningBriefing({
  onClose,
  maxDelegatie = false,
}: {
  onClose: () => void;
  maxDelegatie?: boolean;
}) {
  const alineas = maxDelegatie ? [...BRIEFING_ALINEAS, MAX_DELEGATIE_ZIN] : BRIEFING_ALINEAS;
  const alineasRef = useRef(alineas);
  alineasRef.current = alineas;
  const [status, setStatus] = useState<Status>("idle");
  const [index, setIndex] = useState(-1);
  const gestopt = useRef(false);

  const spreek = useCallback((vanaf = 0) => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) {
      setStatus("geblokkeerd");
      return false;
    }
    gestopt.current = false;
    synth.cancel();
    setStatus("spreekt");

    const zegVanaf = (i: number) => {
      if (gestopt.current) return;
      if (i >= alineasRef.current.length) {
        setStatus("klaar");
        return;
      }
      setIndex(i);
      const delen = zinnen(alineasRef.current[i]!);

      const zegDeel = (d: number) => {
        if (gestopt.current) return;
        if (d >= delen.length) {
          setTimeout(() => zegVanaf(i + 1), 280);
          return;
        }
        const u = new SpeechSynthesisUtterance(delen[d]!);
        stemInstellingen(u);
        u.onend = () => {
          if (gestopt.current) return;
          setTimeout(() => zegDeel(d + 1), 140);
        };
        u.onerror = () => {
          if (!gestopt.current) setStatus("geblokkeerd");
        };
        synth.speak(u);
      };

      zegDeel(0);
    };

    if (synth.getVoices().length) zegVanaf(vanaf);
    else laadStemmen(() => zegVanaf(vanaf));
    return true;
  }, []);

  // Automatisch proberen; als de browser dat niet toestaat, wordt
  // "Briefing beluisteren" de primaire knop.
  useEffect(() => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) {
      setStatus("geblokkeerd");
      return;
    }
    const t = setTimeout(() => spreek(0), 400);
    const check = setTimeout(() => {
      if (!synth.speaking && !synth.pending) {
        gestopt.current = true;
        synth.cancel();
        setStatus((s) => (s === "klaar" ? s : "geblokkeerd"));
        setIndex(-1);
      }
    }, 1800);
    return () => {
      clearTimeout(t);
      clearTimeout(check);
    };
  }, [spreek]);

  // Stop spraak bij sluiten of navigatie naar een ander scherm.
  useEffect(() => {
    return () => {
      gestopt.current = true;
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  function pauzeer() {
    const synth = window.speechSynthesis;
    if (status === "spreekt") {
      synth.pause();
      setStatus("pauze");
    } else if (status === "pauze") {
      synth.resume();
      setStatus("spreekt");
    }
  }

  function stop() {
    gestopt.current = true;
    window.speechSynthesis?.cancel();
    setStatus("klaar");
  }

  function sluit() {
    gestopt.current = true;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/35 p-6 backdrop-blur-[2px]">
      <div className="animate-pop paper-card my-8 w-full max-w-3xl p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="kicker">Ochtendbriefing · gesproken</div>
            <h2 className="mt-1 text-2xl">Wat jij mag weten van vannacht</h2>
            <p className="mt-1 text-[0.9rem] text-muted-foreground">
              Dit is geen inbox. Dit is wat een mens je zou vertellen — de rest bleef onder water.
            </p>
          </div>
          <button
            onClick={sluit}
            className="shrink-0 rounded-md border border-border px-3 py-1 text-sm text-muted-foreground hover:bg-secondary"
          >
            Overslaan
          </button>
        </div>

        {/* Transcript */}
        <div className="mt-7 space-y-3">
          {alineas.map((a, i) => (
            <p
              key={a}
              className={`font-serif text-[1.05rem] leading-relaxed transition-colors duration-300 ${
                index === i && (status === "spreekt" || status === "pauze")
                  ? "text-foreground"
                  : index > i || status === "klaar"
                    ? "text-foreground/70"
                    : "text-muted-foreground/70"
              }`}
            >
              {a}
            </p>
          ))}
        </div>

        {/* Kaarten */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {KAARTEN.map((k) => (
            <div key={k.naam} className="rounded-md border border-border bg-secondary/40 px-4 py-4">
              <div className="kicker">{k.label}</div>
              <div className="mt-1 font-serif text-[1.02rem]">{k.naam}</div>
              <ul className="mt-2 space-y-1">
                {k.regels.map((r) => (
                  <li key={r} className="text-[0.82rem] leading-snug text-muted-foreground">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bediening */}
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          {(status === "idle" || status === "geblokkeerd" || status === "klaar") && (
            <button
              onClick={() => spreek(0)}
              className="rounded-md bg-sage px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {status === "klaar" ? "Opnieuw beluisteren" : "Briefing beluisteren"}
            </button>
          )}
          {(status === "spreekt" || status === "pauze") && (
            <>
              <button
                onClick={pauzeer}
                className="rounded-md border border-sage/40 bg-paper px-5 py-2.5 text-sm font-medium hover:bg-sage-soft"
              >
                {status === "pauze" ? "Hervatten" : "Pauzeren"}
              </button>
              <button
                onClick={stop}
                className="rounded-md border border-border px-5 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
              >
                Stoppen
              </button>
            </>
          )}
          <button
            onClick={sluit}
            className="rounded-md border border-border px-5 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
          >
            Overslaan
          </button>

          <span className="ml-auto text-[0.8rem] text-muted-foreground">
            {status === "spreekt" && "Wordt voorgelezen…"}
            {status === "pauze" && "Gepauzeerd"}
            {status === "klaar" && "Briefing afgerond"}
            {status === "geblokkeerd" && "Je browser wacht op een klik — druk op Briefing beluisteren."}
          </span>
        </div>
      </div>
    </div>
  );
}
