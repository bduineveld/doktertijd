import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BRIEFING_ALINEAS } from "@/components/morning-briefing";
import { KAMER, type KamerPatient } from "@/lib/spreekkamer-data";
import { FEITEN, STEMHINTS, WIJSZINNEN } from "@/lib/projectie-data";
import { KIND_LABEL, TASKS } from "@/lib/demo-data";
import { MAX_DELEGATIE_IDS, useMaxDelegatie } from "@/lib/max-delegatie";
import { bevat, matchVraag, useLuisteren } from "@/lib/luisteren";
import { TEMPO_MAX, TEMPO_MIN, spreekUit, stopSpraak, useTempo } from "@/lib/spraak";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spreekkamer-projectie — DokterTijd" },
      {
        name: "description",
        content:
          "Geen toetsenbord, geen dossier. De muur toont alleen wat nodig is; jij kijkt naar de patiënt en praat met je stem.",
      },
      { property: "og:title", content: "Spreekkamer-projectie — DokterTijd" },
      {
        property: "og:description",
        content: "De muur toont wat nodig is. Jij kijkt naar de patiënt.",
      },
    ],
  }),
  component: Projectie,
});

type Fase = "briefing" | "dag" | "wacht" | "consult" | "klaar";

const NACHTKAARTEN = [
  { label: "Opgenomen", naam: "A. Groot, 62", regels: ["Jouw verwijzing van gisteren", "Hartbewaking", "Geen actie nodig"] },
  { label: "Overleden", naam: "H. Visser, 71", regels: ["Thuis overleden vannacht", "HAP is bij de familie geweest", "Vanmiddag bel je de dochter"] },
  { label: "Palliatief · HAP", naam: "C. Prins, 78", regels: ["Contact met de huisartsenpost", "Extra morfine, pijn onder controle", "Geen visite nodig"] },
];

const DOKTERSTIJD_KINDS = ["fysiek", "video", "telefoon", "visite", "slechtnieuws"];
const TIJDEN = ["08:00", "08:18", "09:15", "11:10", "13:05", "15:10", "16:00", "16:45", "17:00"];

function Projectie() {
  const [maxDelegatie] = useMaxDelegatie();
  const [tempo, setTempo] = useTempo();
  const [fase, setFase] = useState<Fase>("briefing");
  const [alinea, setAlinea] = useState(-1);
  const [idx, setIdx] = useState(0);
  const [inKamer, setInKamer] = useState(false);
  const [antwoorden, setAntwoorden] = useState<{ id: number; vraag: string; antwoord: string }[]>([]);
  const [beleid, setBeleid] = useState(0);
  const [dokterZin, setDokterZin] = useState<string | null>(null);
  const [stemAan, setStemAan] = useState(true);
  const [commando, setCommando] = useState<string | null>(null);
  const teller = useRef(0);
  const gestopt = useRef(false);
  const commandoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Laat zichtbaar zien welk commando is opgepikt. */
  const voer = useCallback((label: string, fn: () => void) => {
    setCommando(label);
    if (commandoTimer.current) clearTimeout(commandoTimer.current);
    commandoTimer.current = setTimeout(() => setCommando(null), 2800);
    fn();
  }, []);

  const patient: KamerPatient | undefined = KAMER[idx];

  const afspraken = useMemo(() => {
    const verborgen = maxDelegatie ? (MAX_DELEGATIE_IDS as readonly string[]) : [];
    return TASKS.filter((t) => DOKTERSTIJD_KINDS.includes(t.kind) && !verborgen.includes(t.id)).slice(0, 9);
  }, [maxDelegatie]);

  useEffect(() => () => stopSpraak(), []);

  const zeg = useCallback(
    (tekst: string) => {
      if (stemAan) spreekUit(tekst);
    },
    [stemAan],
  );

  /** Briefing: alinea voor alinea, met markering op de muur. */
  const speelBriefing = useCallback(() => {
    gestopt.current = false;
    const rij = BRIEFING_ALINEAS;
    const volgende = (i: number) => {
      if (gestopt.current) return;
      if (i >= rij.length) {
        setAlinea(-1);
        naarDag();
        return;
      }
      setAlinea(i);
      spreekUit(rij[i]!, () => setTimeout(() => volgende(i + 1), 320));
    };
    volgende(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const naarDag = useCallback(() => {
    gestopt.current = true;
    stopSpraak();
    setAlinea(-1);
    setFase("dag");
    setTimeout(() => {
      if (!stemAan) return;
      spreekUit(WIJSZINNEN.dag, () => setTimeout(() => spreekUit(WIJSZINNEN.afspraken), 300));
    }, 500);
  }, [stemAan]);

  const naarWacht = useCallback(
    (i = idx) => {
      stopSpraak();
      gestopt.current = true;
      setFase("wacht");
      setInKamer(false);
      setAntwoorden([]);
      setBeleid(0);
      setDokterZin(null);
      const p = KAMER[i];
      if (!p) return;
      setTimeout(() => {
        if (stemAan) spreekUit(i === 0 ? WIJSZINNEN.wacht(p.naam) : WIJSZINNEN.wachtVolgende(p.naam));
      }, 450);
    },
    [idx, stemAan],
  );

  const laatBinnen = useCallback(() => {
    if (inKamer) return;
    setInKamer(true);
    setFase("consult");
    zeg(WIJSZINNEN.binnen);
  }, [inKamer, zeg]);

  const beantwoord = useCallback(
    (vraag: string) => {
      if (!patient) return;
      const gevonden = matchVraag(vraag, patient.vragen);
      const antwoord =
        gevonden?.antwoord ??
        "Dat staat niet in haar dossier. Ik zoek het na tijdens het consult en meld het als het van belang is.";
      teller.current += 1;
      setAntwoorden((a) => [...a.slice(-2), { id: teller.current, vraag: gevonden?.vraag ?? vraag, antwoord }]);
      zeg(antwoord);
    },
    [patient, zeg],
  );

  const legBeleidUit = useCallback(() => {
    if (!patient || beleid > 0) return;
    setDokterZin(patient.dokterZin);
    patient.beleid.forEach((_, i) => setTimeout(() => setBeleid(i + 1), 600 + i * 850));
    zeg(WIJSZINNEN.regelen);
  }, [patient, beleid, zeg]);

  const volgendePatient = useCallback(() => {
    stopSpraak();
    const n = idx + 1;
    if (n >= KAMER.length) {
      setFase("klaar");
      setInKamer(false);
      return;
    }
    setIdx(n);
    naarWacht(n);
  }, [idx, naarWacht]);

  /** Alles wat de dokter zegt komt hier binnen. Geen toetsenbord. */
  const opZin = useCallback(
    (tekst: string) => {
      // Overal bruikbaar
      if (bevat(tekst, ["stem uit", "stil", "mond dicht", "zwijg"])) {
        voer("Stem uit", () => {
          stopSpraak();
          setStemAan(false);
        });
        return;
      }
      if (bevat(tekst, ["stem aan", "praat weer"])) {
        voer("Stem aan", () => setStemAan(true));
        return;
      }
      if (bevat(tekst, ["sneller", "vlotter"])) {
        voer("Sneller praten", () => setTempo(tempo + 0.1));
        return;
      }
      if (bevat(tekst, ["langzamer", "rustiger praten", "trager"])) {
        voer("Langzamer praten", () => setTempo(tempo - 0.1));
        return;
      }
      if (bevat(tekst, ["opnieuw", "begin opnieuw", "van voren af"])) {
        voer("Opnieuw", () => {
          stopSpraak();
          setIdx(0);
          setAlinea(-1);
          setInKamer(false);
          setFase("briefing");
        });
        return;
      }

      if (fase === "briefing") {
        if (bevat(tekst, ["overslaan", "sla over", "verder", "door"])) voer("Overslaan", naarDag);
        else if (bevat(tekst, ["beluister", "briefing", "vertel", "lees voor"]))
          voer("Briefing beluisteren", speelBriefing);
        return;
      }
      if (fase === "dag") {
        if (
          bevat(tekst, [
            "verder", "eerste patiënt", "eerste patient", "begin", "start", "volgende patiënt",
            "volgende patient", "door",
          ])
        )
          voer("Naar de eerste patiënt", () => naarWacht(0));
        return;
      }
      if (fase === "wacht") {
        if (
          bevat(tekst, [
            "binnen", "hij is er", "ze is er", "hij komt", "volgende patiënt", "volgende patient",
            "laat maar", "laat hem", "laat haar", "start consult",
          ])
        )
          voer("Laat binnen", laatBinnen);
        return;
      }
      if (fase === "consult") {
        if (bevat(tekst, ["beleid", "leg het uit", "ik leg uit"])) {
          voer("Ik leg het beleid uit", legBeleidUit);
          return;
        }
        if (
          beleid > 0 &&
          bevat(tekst, ["volgende", "klaar", "patiënt gaat", "patient gaat", "afronden", "dank je wel"])
        ) {
          voer(idx + 1 < KAMER.length ? "Patiënt gaat" : "Spreekuur afronden", volgendePatient);
          return;
        }
        voer(`Vraag: ${tekst}`, () => beantwoord(tekst));
      }
    },
    [fase, beleid, idx, tempo, setTempo, voer, naarDag, speelBriefing, naarWacht, laatBinnen, legBeleidUit, beantwoord, volgendePatient],
  );

  const { steun, actief, transcript, fout, start, stop } = useLuisteren(opZin);

  // Meteen meeluisteren: Edge en Chrome vragen dan zelf om microfoontoegang.
  useEffect(() => {
    start();
  }, [start]);

  const hints =
    fase === "briefing"
      ? STEMHINTS.briefing
      : fase === "dag"
        ? STEMHINTS.dag
        : fase === "wacht"
          ? STEMHINTS.wacht
          : STEMHINTS.consult;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-ink px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Het geprojecteerde paneel op de muur */}
        <div
          className="animate-pop rounded-2xl border border-sage/30 bg-paper px-12 py-11"
          style={{ boxShadow: "0 0 120px -30px oklch(0.42 0.045 165 / 55%), 0 0 0 1px oklch(1 0 0 / 6%)" }}
        >
          <div className="flex items-baseline justify-between gap-6 border-b border-border pb-5">
            <span className="kicker">Projectie · spreekkamer</span>
            <button
              onClick={() => setStemAan((s) => (s ? (stopSpraak(), false) : true))}
              className="text-[0.8rem] text-muted-foreground underline underline-offset-4 hover:text-sage"
            >
              {stemAan ? "Stem aan" : "Stem uit"}
            </button>
          </div>

          {fase === "briefing" && (
            <section className="animate-enter pt-8">
              <h1 className="text-[2.4rem] leading-tight">Wat jij mag weten van vannacht</h1>
              <p className="mt-2 text-[1.05rem] text-muted-foreground">
                Geen inbox. Drie dingen die een mens je zou vertellen.
              </p>
              <div className="mt-8 space-y-3">
                {BRIEFING_ALINEAS.map((a, i) => (
                  <p
                    key={a}
                    className={`font-serif text-[1.35rem] leading-relaxed transition-colors duration-300 ${
                      alinea === i ? "text-foreground" : alinea > i ? "text-foreground/60" : "text-muted-foreground/60"
                    }`}
                  >
                    {a}
                  </p>
                ))}
              </div>
              <div className="mt-9 grid grid-cols-3 gap-4">
                {NACHTKAARTEN.map((k) => (
                  <div key={k.naam} className="rounded-xl border border-border bg-secondary/40 px-5 py-5">
                    <div className="kicker">{k.label}</div>
                    <div className="mt-1 font-serif text-[1.2rem]">{k.naam}</div>
                    <ul className="mt-2 space-y-1">
                      {k.regels.map((r) => (
                        <li key={r} className="text-[0.92rem] leading-snug text-muted-foreground">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={speelBriefing}
                  className="rounded-full bg-sage px-8 py-3.5 text-[1rem] font-semibold text-primary-foreground hover:opacity-90"
                >
                  Briefing beluisteren
                </button>
                <button
                  onClick={naarDag}
                  className="rounded-full border border-border px-7 py-3.5 text-[0.95rem] text-muted-foreground hover:bg-secondary"
                >
                  Overslaan
                </button>
                <span className="text-[0.85rem] text-muted-foreground">
                  of zeg: “beluisteren” · “overslaan”
                </span>
              </div>
            </section>
          )}

          {fase === "dag" && (
            <section className="animate-enter pt-8">
              <h1 className="text-[2.4rem] leading-tight">Hier zie je de samenvatting van deze dag.</h1>
              <div className="mt-7 grid grid-cols-3 gap-4">
                {[
                  { k: "Dokterstijd vandaag", v: `${afspraken.length} momenten` },
                  { k: "Vannacht autonoom", v: "47 gebeurtenissen" },
                  { k: "Beschermd", v: "Koffie · lunch · buiten" },
                ].map((c) => (
                  <div key={c.k} className="rounded-xl border border-sage/25 bg-sage-soft/50 px-5 py-4">
                    <div className="kicker">{c.k}</div>
                    <div className="mt-1 font-serif text-[1.4rem] text-accent-foreground">{c.v}</div>
                  </div>
                ))}
              </div>

              <h2 className="mt-10 text-[1.5rem]">Hier zie je de volgende afspraken.</h2>
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {afspraken.map((t, i) => (
                  <li key={t.id} className="flex items-baseline gap-5 py-3.5">
                    <span className="w-16 shrink-0 font-serif text-[1.1rem] text-muted-foreground">
                      {TIJDEN[i] ?? "—"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-serif text-[1.2rem]">{t.naam}</span>
                      <span className="ml-3 text-[0.95rem] text-muted-foreground">{t.titel}</span>
                    </span>
                    <span className="shrink-0 text-[0.82rem] text-muted-foreground">
                      {KIND_LABEL[t.kind]} · {t.duur}
                    </span>
                    {t.mensNodig && (
                      <span className="shrink-0 rounded-full bg-sage-soft px-3 py-1 text-[0.72rem] font-semibold text-accent-foreground">
                        MENS NODIG
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => naarWacht(0)}
                  className="rounded-full bg-sage px-8 py-3.5 text-[1rem] font-semibold text-primary-foreground hover:opacity-90"
                >
                  Naar de eerste patiënt
                </button>
                <span className="text-[0.85rem] text-muted-foreground">of zeg: “eerste patiënt”</span>
              </div>
            </section>
          )}

          {(fase === "wacht" || fase === "consult") && patient && (
            <section className="animate-enter pt-8">
              <div className="flex items-baseline justify-between gap-6">
                <div>
                  <h1 className="text-[2.6rem] leading-tight">
                    {patient.naam}, {patient.leeftijd}
                  </h1>
                  <p className="mt-1 text-[1.2rem] text-muted-foreground">{patient.reden}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-4 py-1.5 text-[0.8rem] font-semibold ${
                    inKamer ? "bg-sage text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {inKamer ? "Patiënt is in de kamer" : "Nog niet in de kamer"}
                </span>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-4">
                {(FEITEN[patient.id] ?? []).map((f) => (
                  <div key={f.label} className="rounded-xl border border-border bg-secondary/35 px-5 py-4">
                    <div className="kicker">{f.label}</div>
                    <div className="mt-1 font-serif text-[1.15rem] leading-snug">{f.waarde}</div>
                  </div>
                ))}
              </div>

              <p className="mt-7 border-l-2 border-sage/50 pl-5 font-serif text-[1.25rem] leading-relaxed text-foreground/85">
                {patient.briefing}
              </p>

              {fase === "wacht" && (
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={laatBinnen}
                    className="rounded-full bg-sage px-8 py-3.5 text-[1rem] font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Hij is er — laat binnen
                  </button>
                  <span className="text-[0.85rem] text-muted-foreground">of zeg: “binnen” · “hij is er”</span>
                </div>
              )}

              {fase === "consult" && (
                <>
                  {antwoorden.length > 0 && (
                    <div className="mt-8 space-y-3">
                      {antwoorden.map((a) => (
                        <div
                          key={a.id}
                          className="animate-enter rounded-2xl border border-sage/25 bg-sage-soft/60 px-7 py-5"
                        >
                          <div className="kicker mb-1">Jij vroeg: {a.vraag}</div>
                          <div className="font-serif text-[1.35rem] leading-relaxed text-accent-foreground">
                            {a.antwoord}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {dokterZin && (
                    <div className="animate-enter mt-8 ml-auto max-w-[80%] rounded-2xl border border-border bg-paper px-7 py-5 text-right">
                      <div className="kicker mb-1">Jij zegt</div>
                      <div className="font-serif text-[1.3rem] leading-relaxed">{dokterZin}</div>
                    </div>
                  )}

                  {beleid > 0 && (
                    <div className="mt-8">
                      <div className="kicker">{WIJSZINNEN.regelen}</div>
                      <div className="mt-3 space-y-2">
                        {patient.beleid.slice(0, beleid).map((r) => (
                          <div
                            key={r}
                            className="animate-enter rounded-xl border border-sage/25 bg-sage-soft/45 px-6 py-3.5 text-[1.05rem] text-accent-foreground"
                          >
                            ✓ {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-9 border-t border-border pt-6">
                    {beleid < patient.beleid.length ? (
                      <>
                        <div className="kicker mb-3">
                          Zeg het hardop — of tik een hint · zeg “ik leg het beleid uit”
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {patient.vragen.map((v) => (
                            <button
                              key={v.vraag}
                              onClick={() => beantwoord(v.vraag)}
                              className="rounded-full border border-border bg-paper px-5 py-2 text-[0.92rem] text-foreground/80 hover:bg-secondary"
                            >
                              {v.vraag}
                            </button>
                          ))}
                          <button
                            onClick={legBeleidUit}
                            className="rounded-full bg-sage px-6 py-2 text-[0.92rem] font-semibold text-primary-foreground hover:opacity-90"
                          >
                            Ik leg het beleid uit
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between gap-6">
                        <p className="text-[1rem] text-muted-foreground">
                          Alles is vastgelegd, verstuurd en ingepland. Jij voerde alleen het gesprek.
                          <span className="ml-1 text-muted-foreground/80">Of zeg: “volgende patiënt”.</span>
                        </p>
                        <button
                          onClick={volgendePatient}
                          className="shrink-0 rounded-full bg-sage px-7 py-3 text-[0.95rem] font-semibold text-primary-foreground hover:opacity-90"
                        >
                          {idx + 1 < KAMER.length ? "Patiënt gaat" : "Spreekuur afronden"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          )}

          {fase === "klaar" && (
            <section className="animate-enter pt-10 text-center">
              <h1 className="text-[2.2rem]">Spreekuur afgerond.</h1>
              <p className="mx-auto mt-3 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground">
                {KAMER.length} patiënten, geen scherm om in te typen, geen naregistratie. Brieven, dossierregels,
                afspraken en recepten zijn onderweg.
              </p>
              <button
                onClick={() => {
                  setIdx(0);
                  setFase("briefing");
                  setAlinea(-1);
                  setInKamer(false);
                }}
                className="mt-7 rounded-full border border-sage/40 px-7 py-3 text-[0.95rem] font-medium hover:bg-sage-soft"
              >
                ↻ Opnieuw
              </button>
            </section>
          )}

          <p className="mt-10 border-t border-border pt-5 text-center font-serif text-[1rem] text-muted-foreground">
            AI doet het werk. De dokter doet het dokteren.
          </p>
        </div>

        {/* Microfoon-pill onder de projectie */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => (actief ? stop() : start())}
            disabled={!steun}
            className={`flex items-center gap-3 rounded-full px-7 py-3 text-[0.95rem] font-semibold transition-colors ${
              actief
                ? "bg-sage text-primary-foreground"
                : "border border-sage/40 bg-paper/10 text-paper hover:bg-paper/20"
            } ${steun ? "" : "cursor-not-allowed opacity-40"}`}
          >
            {actief ? (
              <span className="flex items-end gap-[3px]" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-[3px] animate-pulse rounded-full bg-primary-foreground"
                    style={{ height: `${8 + ((i % 2) + 1) * 5}px`, animationDelay: `${i * 140}ms` }}
                  />
                ))}
              </span>
            ) : (
              <span className="h-2.5 w-2.5 rounded-full bg-sage" />
            )}
            {steun ? (actief ? "Ik luister…" : "Praat met de muur") : "Stem niet beschikbaar in deze browser"}
          </button>
          <div className="flex flex-wrap items-center gap-2">
            {[...hints, "“stem uit”", "“opnieuw”"].map((h) => (
              <button
                key={h}
                onClick={() => opZin(h.replace(/[“”]/g, ""))}
                className="rounded-full border border-paper/20 px-4 py-1.5 text-[0.82rem] text-paper/60 hover:border-paper/50 hover:text-paper"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
        {/* Spreektempo, live aanpasbaar */}
        <div className="mt-4 flex items-center justify-center gap-3 text-[0.85rem] text-paper/60">
          <span>Spreektempo</span>
          <button
            onClick={() => setTempo(tempo - 0.1)}
            aria-label="Langzamer praten"
            className="h-7 w-7 rounded-full border border-paper/25 text-paper/70 hover:border-paper/60 hover:text-paper"
          >
            −
          </button>
          <input
            type="range"
            min={TEMPO_MIN}
            max={TEMPO_MAX}
            step={0.05}
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            aria-label="Spreektempo"
            className="h-1 w-44 cursor-pointer accent-sage"
          />
          <button
            onClick={() => setTempo(tempo + 0.1)}
            aria-label="Sneller praten"
            className="h-7 w-7 rounded-full border border-paper/25 text-paper/70 hover:border-paper/60 hover:text-paper"
          >
            +
          </button>
          <span className="w-12 tabular-nums text-paper/80">{tempo.toFixed(2)}×</span>
          <span className="text-paper/35">of zeg: “sneller” / “langzamer”</span>
        </div>
        <p className="mt-3 min-h-[1.4rem] text-center text-[0.9rem] text-paper/55">
          {transcript ? `“${transcript}”` : actief ? "Zeg bijvoorbeeld een van de commando’s hierboven." : ""}
        </p>
        {commando && (
          <p className="animate-pop mx-auto mt-1 w-fit rounded-full bg-sage px-5 py-1.5 text-[0.85rem] font-semibold text-primary-foreground">
            ✓ Commando opgepikt — {commando}
          </p>
        )}
        {fout && <p className="mt-2 text-center text-[0.85rem] text-urgent-soft">{fout}</p>}
        {!steun && (
          <p className="mt-2 text-center text-[0.85rem] text-paper/45">
            Spraakherkenning werkt in Chrome of Edge. Firefox en Safari ondersteunen het niet — tik dan de hints.
          </p>
        )}
      </div>
    </div>
  );
}
