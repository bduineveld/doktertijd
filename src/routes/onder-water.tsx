import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MAX_DELEGATIE_EVENTS, OW_CATS, OW_EVENTS, fmt, type OWCat } from "@/lib/demo-data";
import { useMaxDelegatie } from "@/lib/max-delegatie";

export const Route = createFileRoute("/onder-water")({
  head: () => ({
    meta: [
      { title: "Onder water — DokterTijd" },
      {
        name: "description",
        content:
          "Het volledige spoor van zorg die vannacht en vandaag autonoom werd afgehandeld — zonder dat er dokterstijd aan te pas kwam.",
      },
      { property: "og:title", content: "Onder water — DokterTijd" },
      {
        property: "og:description",
        content: "Niet alles wat zorg is, hoeft dokterstijd te kosten.",
      },
    ],
  }),
  component: OnderWater,
});

function OnderWater() {
  const [filter, setFilter] = useState<OWCat | "alles">("alles");
  const [maxDelegatie] = useMaxDelegatie();
  const alle = maxDelegatie ? [...OW_EVENTS, ...MAX_DELEGATIE_EVENTS].sort((a, b) => a.min - b.min) : OW_EVENTS;
  const events = alle.filter((e) => filter === "alles" || e.cat === filter).slice().reverse();
  const nacht = events.filter((e) => e.nacht);
  const dag = events.filter((e) => !e.nacht);

  return (
    <div className="mx-auto max-w-4xl px-8 py-14">
      <h1 className="text-[2.1rem] leading-tight">Niet alles wat zorg is, hoeft dokterstijd te kosten.</h1>
      <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">
        Volledig spoor van wat de agents zelfstandig deden voor 5.214 patiënten. Populatiezorg staat hier als
        uitgevoerde actie — niet als taak die eerst langs de huisarts ging.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {OW_CATS.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`rounded-full border px-4 py-1.5 text-[0.82rem] transition-colors ${
              filter === c.key
                ? "border-sage bg-sage text-primary-foreground"
                : "border-border bg-paper text-muted-foreground hover:bg-secondary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {[
        ["Vandaag", dag],
        ["Vannacht", nacht],
      ].map(([label, list]) => {
        const items = list as typeof events;
        if (!items.length) return null;
        return (
          <section key={label as string} className="mt-10">
            <div className="mb-4 flex items-center gap-4">
              <h2 className="kicker">{label as string}</h2>
              <div className="h-px flex-1 bg-border" />
              <span className="text-[0.75rem] text-muted-foreground">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.map((e) => (
                <div
                  key={e.id}
                  className={`animate-enter paper-card px-5 py-4 ${e.highlight ? "border-sage bg-sage-soft" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="kicker">{e.cat}</span>
                    <span className="text-[0.75rem] tabular-nums text-muted-foreground">{fmt(e.min)}</span>
                  </div>
                  <div className="mt-1.5 font-serif text-[1.05rem] text-foreground">{e.titel}</div>
                  <div className="mt-1 text-[0.88rem] leading-relaxed text-muted-foreground">{e.detail}</div>
                  {e.highlight && (
                    <div className="mt-3 rounded-md border border-sage/40 bg-paper/70 px-4 py-2 text-[0.82rem] text-accent-foreground">
                      Geleerd beleid · 14:32 — dit kwam bewust niet op de lijst van de huisarts.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <p className="mt-16 border-t border-border pt-8 text-center font-serif text-[1.05rem] text-muted-foreground">
        Eén beslissing. De rest regelen wij.
      </p>
    </div>
  );
}
