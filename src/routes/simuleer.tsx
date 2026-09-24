import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TaskCard } from "@/components/task-card";
import {
  BANNERS,
  BASE_SECONDS,
  BUCKETS,
  COUNTERS_END,
  COUNTERS_START,
  DAY_END,
  DAY_START,
  IDLE_NOTES,
  KIND_LABEL,
  OW_EVENTS,
  SEGMENTS,
  SIM_TASKS,
  TASKS_BY_ID,
  fmt,
  MAX_DELEGATIE_EVENTS,
} from "@/lib/demo-data";
import { MAX_DELEGATIE_IDS, useMaxDelegatie } from "@/lib/max-delegatie";

export const Route = createFileRoute("/simuleer")({
  head: () => ({
    meta: [
      { title: "Simuleer een dag — DokterTijd" },
      {
        name: "description",
        content:
          "Bekijk in twee minuten hoe 5.214 patiënten zorg krijgen terwijl de huisarts alleen wordt ingezet waar dat waarde toevoegt.",
      },
      { property: "og:title", content: "Een dag in 2030 — DokterTijd" },
      {
        property: "og:description",
        content: "Twee minuten. Een volledige huisartsendag. Alleen dokterstijd waar een dokter nodig is.",
      },
    ],
  }),
  component: Simuleer,
});

const MIN_PER_SEC = (DAY_END - DAY_START) / BASE_SECONDS;

function lerp(a: number, b: number, p: number) {
  return Math.round(a + (b - a) * p);
}

function Simuleer() {
  const [gestart, setGestart] = useState(false);
  const [tijd, setTijd] = useState(DAY_START);
  const [speelt, setSpeelt] = useState(false);
  const [snelheid, setSnelheid] = useState(1);
  const [scrubbing, setScrubbing] = useState(false);
  const [maxDelegatie] = useMaxDelegatie();
  const wasSpelend = useRef(false);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  const klaar = tijd >= DAY_END;

  useEffect(() => {
    if (!speelt) {
      last.current = 0;
      if (raf.current) cancelAnimationFrame(raf.current);
      return;
    }
    const tick = (now: number) => {
      if (!last.current) last.current = now;
      const dt = (now - last.current) / 1000;
      last.current = now;
      setTijd((t) => {
        const next = t + dt * MIN_PER_SEC * snelheid;
        if (next >= DAY_END) {
          setSpeelt(false);
          return DAY_END;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [speelt, snelheid]);

  const start = useCallback(() => {
    setGestart(true);
    setTijd(DAY_START);
    setSpeelt(true);
  }, []);

  const state = useMemo(() => {
    const t = tijd;
    const verborgen: readonly string[] = maxDelegatie ? MAX_DELEGATIE_IDS : [];
    const segmenten = SEGMENTS.filter((s) => !(s.taskId && verborgen.includes(s.taskId)));
    const owAlle = maxDelegatie
      ? [...OW_EVENTS, ...MAX_DELEGATIE_EVENTS].sort((a, b) => a.min - b.min)
      : OW_EVENTS;
    const actief = segmenten.find((s) => t >= s.start && t < s.end) ?? null;
    const afgerond = segmenten.filter((s) => s.end <= t);
    const afgehandeld = afgerond.filter((s) => s.taskId);
    const doneIds = new Set(afgehandeld.map((s) => s.taskId!));
    const taken = SIM_TASKS.filter((s) => s.appear <= t && !doneIds.has(s.id) && !verborgen.includes(s.id));
    const idle = [...IDLE_NOTES].reverse().find((n) => n.from <= t) ?? IDLE_NOTES[0]!;
    const banner = BANNERS.find((b) => t >= b.from && t < b.to) ?? null;
    const stream = owAlle.filter((e) => e.min <= t).slice().reverse();
    const p = (t - DAY_START) / (DAY_END - DAY_START);
    const extra = maxDelegatie ? MAX_DELEGATIE_EVENTS.filter((e) => e.min <= t).length : 0;
    const counters = {
      totaal: lerp(COUNTERS_START.totaal, COUNTERS_END.totaal, p) + extra,
      autonoom: lerp(COUNTERS_START.autonoom, COUNTERS_END.autonoom, p) + extra,
      geleerd: lerp(COUNTERS_START.geleerd, COUNTERS_END.geleerd, p),
      anderen: lerp(COUNTERS_START.anderen, COUNTERS_END.anderen, p),
      arts: lerp(COUNTERS_START.arts, COUNTERS_END.arts, p),
    };
    return { actief, afgehandeld, taken, idle, banner, stream, counters };
  }, [tijd, maxDelegatie]);

  if (!gestart) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-8 py-16 text-center">
        <h1 className="text-[2.4rem] leading-tight">Een dag in 2030</h1>
        <p className="mx-auto mt-4 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground">
          Bekijk in twee minuten hoe 5.214 patiënten zorg krijgen terwijl de huisarts alleen wordt ingezet waar dat
          waarde toevoegt.
        </p>
        <div>
          <button
            onClick={start}
            className="mt-10 rounded-md bg-sage px-8 py-4 font-serif text-[1.05rem] text-primary-foreground shadow-md transition-transform hover:-translate-y-[1px]"
          >
            ▶ Simuleer een werkdag
          </button>
        </div>
        <p className="mt-10 font-serif text-muted-foreground">Eén beslissing. De rest regelen wij.</p>
      </div>
    );
  }

  const nowTask = state.actief?.taskId ? TASKS_BY_ID[state.actief.taskId] : null;

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      {/* Transport */}
      <div className="paper-card sticky top-3 z-30 flex items-center gap-4 px-5 py-3">
        <button
          onClick={() => {
            if (klaar) {
              setTijd(DAY_START);
              setSpeelt(true);
            } else setSpeelt((s) => !s);
          }}
          className="h-10 w-10 shrink-0 rounded-full bg-sage text-primary-foreground transition-opacity hover:opacity-90"
          aria-label={klaar ? "Speel opnieuw" : speelt ? "Pauzeer" : "Speel"}
        >
          {klaar ? "↻" : speelt ? "❚❚" : "▶"}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min={DAY_START}
            max={DAY_END}
            step={1}
            value={Math.round(tijd)}
            onPointerDown={() => {
              wasSpelend.current = speelt;
              setScrubbing(true);
              setSpeelt(false);
            }}
            onPointerUp={() => {
              setScrubbing(false);
              if (wasSpelend.current && tijd < DAY_END) setSpeelt(true);
            }}
            onChange={(e) => setTijd(Number(e.target.value))}
            className="w-full accent-[oklch(0.42_0.045_165)]"
          />
          <div className="mt-1 flex justify-between text-[0.7rem] text-muted-foreground">
            <span>07:30</span>
            <span>{scrubbing ? "Scrubben…" : "Werkdag"}</span>
            <span>17:15</span>
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => setSnelheid(s)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                snelheid === s ? "bg-sage text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        <div className="ml-2 shrink-0 font-serif text-3xl tabular-nums tracking-tight text-foreground">
          {fmt(tijd)}
        </div>
      </div>

      {state.banner && (
        <div className="animate-enter mt-4 rounded-md border border-sage/30 bg-sage-soft px-5 py-3">
          <div className="font-serif text-[1.02rem] text-accent-foreground">{state.banner.tekst}</div>
          {state.banner.sub && <div className="text-[0.85rem] text-accent-foreground/80">{state.banner.sub}</div>}
        </div>
      )}

      <div className="mt-6 grid grid-cols-[1fr_360px] gap-8">
        {/* Links: dag van de dokter */}
        <div>
          {/* Afgehandeld strip */}
          <div className="rounded-md border border-border bg-secondary/70 px-4 py-3">
            <div className="kicker">Afgehandeld · {state.afgehandeld.length} patiënten</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {state.afgehandeld.length === 0 && (
                <span className="text-[0.82rem] text-muted-foreground">Nog geen contacten vandaag.</span>
              )}
              {state.afgehandeld.map((s) => {
                const t = TASKS_BY_ID[s.taskId!];
                if (!t) return null;
                return (
                  <span
                    key={s.taskId}
                    className="animate-pop rounded-full border border-border bg-paper px-3 py-1 text-[0.75rem] text-muted-foreground"
                  >
                    <span className="tabular-nums">{fmt(s.end)}</span> · {t.naam} · {KIND_LABEL[t.kind]}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Now card */}
          <div className="paper-card mt-4 px-6 py-5">
            {state.actief?.pauze ? (
              <>
                <div className="kicker">Beschermde tijd</div>
                <div className="mt-1 font-serif text-[1.3rem]">{state.actief.pauze.label}</div>
                <div className="text-[0.88rem] text-muted-foreground">{state.actief.pauze.sub}</div>
              </>
            ) : nowTask ? (
              <>
                <div className="kicker text-sage">Nu mee bezig</div>
                <div className="mt-1 font-serif text-[1.3rem]">
                  {nowTask.naam} · {KIND_LABEL[nowTask.kind]}
                </div>
                <div className="text-[0.88rem] text-muted-foreground">
                  {nowTask.duur} · {nowTask.titel}
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-sage transition-[width] duration-200"
                    style={{
                      width: `${Math.min(
                        100,
                        ((tijd - state.actief!.start) / (state.actief!.end - state.actief!.start)) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="kicker">{state.idle.kicker}</div>
                <div className="mt-1 font-serif text-[1.3rem]">{state.idle.titel}</div>
                <div className="text-[0.88rem] text-muted-foreground">{state.idle.sub}</div>
              </>
            )}
          </div>

          {/* Takenlijst */}
          <div className="mt-8 space-y-8">
            {BUCKETS.map((b) => {
              const items = state.taken.filter((s) => {
                const isActief = state.actief?.taskId === s.id;
                return isActief ? b.key === "nu" : s.bucket === b.key;
              });
              if (!items.length) return null;
              return (
                <section key={b.key}>
                  <div className="mb-3 flex items-center gap-4">
                    <h2 className="kicker text-[0.7rem]">{b.label}</h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-3">
                    {items.map((s) => {
                      const task = TASKS_BY_ID[s.id];
                      if (!task) return null;
                      return (
                        <TaskCard key={s.id} task={task} actief={state.actief?.taskId === s.id} />
                      );
                    })}
                  </div>
                </section>
              );
            })}
            {state.taken.length === 0 && (
              <div className="paper-card px-6 py-10 text-center">
                <p className="font-serif text-[1.2rem]">De lijst is leeg.</p>
                <p className="mt-2 text-[0.92rem] text-muted-foreground">
                  Geen inbox. Geen avondwerk. 5.214 patiënten kregen vandaag zorg — jij was er waar het ertoe deed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rechts: onder water */}
        <aside>
          <div className="kicker">Onder water · autonoom afgehandeld</div>
          <div className="mt-3 max-h-[70vh] space-y-2 overflow-y-auto pr-1">
            {state.stream.map((e) => (
              <div
                key={e.id}
                className={`animate-stream rounded-md border px-4 py-3 ${
                  e.highlight ? "border-sage bg-sage-soft" : "border-border bg-paper/70"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    {e.cat}
                  </span>
                  <span className="text-[0.72rem] tabular-nums text-muted-foreground">{fmt(e.min)}</span>
                </div>
                <div className="mt-1 text-[0.86rem] font-medium leading-snug text-foreground/90">{e.titel}</div>
                <div className="mt-0.5 text-[0.78rem] leading-snug text-muted-foreground">{e.detail}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Counters */}
      <div className="mt-10 grid grid-cols-5 gap-4 border-t border-border pt-6">
        {[
          ["Gebeurtenissen", state.counters.totaal],
          ["Autonoom afgehandeld", state.counters.autonoom],
          ["Via geleerd beleid", state.counters.geleerd],
          ["Andere professionals", state.counters.anderen],
          ["Door de huisarts", state.counters.arts],
        ].map(([label, v]) => (
          <div key={label as string}>
            <div className="font-serif text-2xl tabular-nums">{v as number}</div>
            <div className="text-[0.75rem] text-muted-foreground">{label as string}</div>
          </div>
        ))}
      </div>

      {klaar && (
        <div className="animate-enter mt-8 rounded-md border border-sage/30 bg-sage-soft px-6 py-6 text-center">
          <p className="font-serif text-[1.25rem] text-accent-foreground">
            312 gebeurtenissen. 263 autonoom. 25 keer was er een dokter nodig.
          </p>
          <p className="mt-2 text-[0.92rem] text-accent-foreground/85">
            Gemiddelde afhandeltijd onder water: 2m 06s. AI doet het werk. De dokter doet het dokteren.
          </p>
        </div>
      )}
    </div>
  );
}
