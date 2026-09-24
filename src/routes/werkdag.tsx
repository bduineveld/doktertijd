import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MorningBriefing } from "@/components/morning-briefing";
import { TaskCard } from "@/components/task-card";
import { TaskDetail } from "@/components/task-detail";
import { BUCKETS, MICRO_TOAST, TASKS, type Task } from "@/lib/demo-data";
import { MAX_DELEGATIE_IDS, useMaxDelegatie } from "@/lib/max-delegatie";

export const Route = createFileRoute("/werkdag")({
  head: () => ({
    meta: [
      { title: "Mijn werkdag — DokterTijd" },
      {
        name: "description",
        content:
          "Je ziet niet alle zorg. Alleen de zorg waarvoor jij nodig bent. De werkdag van een huisarts met 5.214 patiënten in 2030.",
      },
      { property: "og:title", content: "Mijn werkdag — DokterTijd" },
      {
        property: "og:description",
        content: "Je ziet niet alle zorg. Alleen de zorg waarvoor jij nodig bent.",
      },
    ],
  }),
  component: Werkdag,
});

function Werkdag() {
  const [open, setOpen] = useState<Task | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [gedaan, setGedaan] = useState<string[]>([]);
  const [gedelegeerd, setGedelegeerd] = useState(false);
  const [briefing, setBriefing] = useState(false);
  const [maxDelegatie] = useMaxDelegatie();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const verborgen = maxDelegatie ? (MAX_DELEGATIE_IDS as readonly string[]) : [];
  const zichtbaar = TASKS.filter((t) => !verborgen.includes(t.id));

  return (
    <div className="mx-auto max-w-4xl px-8 py-14">
      <header>
        <h1 className="text-[2.1rem] leading-tight">Goedemorgen, dokter.</h1>
        <p className="mt-2 text-[1.05rem] text-foreground/80">
          5.214 patiënten zijn aan jouw zorg toevertrouwd.
        </p>
        <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
          Dit vraagt vandaag jouw aandacht. Onder water zijn vannacht al{" "}
          <span className="font-semibold text-sage">38 gebeurtenissen</span> afgehandeld — zonder inbox.{" "}
          <Link to="/onder-water" className="underline underline-offset-4 hover:text-sage">
            Bekijk wat er gebeurde
          </Link>
          .
        </p>
        <button
          onClick={() => setBriefing(true)}
          className="mt-3 text-[0.85rem] text-sage underline underline-offset-4 hover:opacity-80"
        >
          Ochtendbriefing opnieuw
        </button>
        <p className="mt-6 border-l-2 border-sage/50 pl-4 font-serif text-[1.05rem] text-foreground/85">
          Je ziet niet meer alle zorg. Je ziet alleen de zorg waarvoor jij nodig bent.
        </p>
      </header>

      {maxDelegatie && (
        <div className="animate-enter mt-8 rounded-md border border-sage/30 bg-sage-soft/60 px-5 py-4 text-[0.92rem] text-accent-foreground">
          <strong className="font-semibold">Volledig autonoom: je ziet geen overlegjes of foto's.</strong> — {MAX_DELEGATIE_IDS.length} items zijn zelfstandig afgehandeld en{" "}
          <Link to="/onder-water" className="underline underline-offset-4">
            staan onder water
          </Link>
          . Fysieke consulten, visites, slechtnieuws, de belafspraak na overlijden en alles met MENS NODIG blijven
          staan.
        </div>
      )}

      {gedelegeerd && (
        <div className="animate-enter mt-8 rounded-md border border-sage/30 bg-sage-soft/60 px-5 py-4 text-[0.92rem] text-accent-foreground">
          Delegatieprofiel bijgewerkt. Een vergelijkbare buikpijncasus verscheen vanmiddag niet op jouw lijst —{" "}
          <Link to="/onder-water" className="underline underline-offset-4">
            hij staat onder water
          </Link>
          .
        </div>
      )}

      <div className="mt-12 space-y-12">
        {BUCKETS.map((b) => {
          const items = zichtbaar.filter((t) => t.bucket === b.key);
          if (!items.length) return null;
          return (
            <section key={b.key}>
              <div className="mb-4 flex items-center gap-4">
                <h2 className="kicker text-[0.72rem]">{b.label}</h2>
                <div className="h-px flex-1 bg-border" />
                <span className="text-[0.75rem] text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.map((t) => (
                  <TaskCard key={t.id} task={t} gedaan={gedaan.includes(t.id)} onClick={() => setOpen(t)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-16 border-t border-border pt-8 text-center font-serif text-[1.05rem] text-muted-foreground">
        Niet alles wat zorg is, hoeft dokterstijd te kosten.
      </p>

      {briefing && <MorningBriefing maxDelegatie={maxDelegatie} onClose={() => setBriefing(false)} />}

      {open && (
        <TaskDetail
          task={open}
          onClose={() => setOpen(null)}
          onDecision={(t) => {
            setGedaan((g) => (g.includes(t.id) ? g : [...g, t.id]));
            setToast(MICRO_TOAST);
          }}
          onDelegate={() => setGedelegeerd(true)}
        />
      )}

      {toast && (
        <div className="animate-pop fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-sage px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
