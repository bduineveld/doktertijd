import { useEffect, useState } from "react";
import { KIND_LABEL, type Task } from "@/lib/demo-data";

type Fase = "overzicht" | "verbinden" | "gesprek" | "klaar";

const CONTACT_KINDS = ["telefoon", "video", "fysiek", "visite", "slechtnieuws"];

const VERBIND_TEKST: Record<string, string> = {
  telefoon: "Bellen…",
  video: "Verbinding maken…",
  fysiek: "Patiënt wordt binnengeroepen…",
  visite: "Onderweg…",
  slechtnieuws: "Moment van rust…",
};

const FOLLOWUP: string[] = [
    "Besluit vastgelegd in dossier",
    "Patiënt geïnformeerd in eigen taalniveau",
    "Vervolgcontact ingepland",
    "Monitoring geactiveerd",
    "Vangnetinstructies verstuurd",
  "Terugkoppeling aan betrokken zorgverleners",
];

export function TaskDetail({
  task,
  onClose,
  onDecision,
  onDelegate,
}: {
  task: Task;
  onClose: () => void;
  onDecision: (t: Task, keuze: string) => void;
  onDelegate?: () => void;
}) {
  const isContact = CONTACT_KINDS.includes(task.kind) && !!task.contact;
  const [fase, setFase] = useState<Fase>(isContact ? "overzicht" : "overzicht");
  const [gekozen, setGekozen] = useState<string | null>(null);
  const [gevolg, setGevolg] = useState<string | null>(null);
  const [checklist, setChecklist] = useState(0);
  const [delegatie, setDelegatie] = useState<"vraag" | "ja" | "nee" | null>(null);

  useEffect(() => {
    if (fase !== "verbinden") return;
    const t = setTimeout(() => setFase("gesprek"), 1400);
    return () => clearTimeout(t);
  }, [fase]);

  useEffect(() => {
    if (!gekozen) return;
    const items = FOLLOWUP;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setChecklist(i);
      if (i >= items.length) {
        clearInterval(iv);
        if (task.id === "jansen") setTimeout(() => setDelegatie("vraag"), 500);
      }
    }, 260);
    return () => clearInterval(iv);
  }, [gekozen, task.id]);

  function kies(label: string, g: string) {
    setGekozen(label);
    setGevolg(g);
    onDecision(task, label);
  }

  const toonKeuzes = task.choices && (!isContact || fase === "gesprek");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/35 p-6 backdrop-blur-[2px]">
      <div className="animate-pop paper-card my-6 w-full max-w-3xl p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="kicker">{KIND_LABEL[task.kind]} · {task.duur}</div>
            <h2 className="mt-1 text-2xl">
              {task.naam}
              {task.leeftijd ? <span className="text-muted-foreground">, {task.leeftijd}</span> : null}
            </h2>
            <p className="mt-1 text-[0.95rem] text-foreground/85">{task.titel}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1 text-sm text-muted-foreground hover:bg-secondary"
          >
            Sluiten
          </button>
        </div>

        {/* Waarom jij nu */}
        <div className="mt-6 rounded-md border border-sage/30 bg-sage-soft/60 p-5">
          <div className="kicker text-accent-foreground">Waarom jij nu</div>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-accent-foreground">{task.waaromJij}</p>
        </div>

        {/* SBAR */}
        {task.sbar && (
          <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border">
            {(
              [
                ["Situatie", task.sbar.s],
                ["Background", task.sbar.b],
                ["Assessment", task.sbar.a],
                ["Recommendation", task.sbar.r],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[150px_1fr] gap-4 bg-paper px-5 py-3">
                <div className="kicker pt-[3px]">{k}</div>
                <div className="text-[0.92rem] leading-relaxed text-foreground/90">{v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Briefing (slechtnieuws) */}
        {task.briefing && (
          <div className="mt-6 space-y-px overflow-hidden rounded-md border border-border bg-border">
            {task.briefing.map((b) => (
              <div key={b.kop} className="grid grid-cols-[190px_1fr] gap-4 bg-paper px-5 py-4">
                <div className="kicker pt-[3px]">{b.kop}</div>
                <div className="text-[0.92rem] leading-relaxed text-foreground/90">{b.tekst}</div>
              </div>
            ))}
          </div>
        )}

        {task.voorbereid && (
          <div className="mt-6 rounded-md border border-border bg-secondary/50 p-5">
            <div className="kicker">Wat besproken moet worden</div>
            <ul className="mt-3 space-y-2">
              {task.voorbereid.map((v) => (
                <li key={v} className="flex gap-3 text-[0.92rem] text-foreground/90">
                  <span className="text-sage">—</span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact flow */}
        {isContact && task.contact && (
          <div className="mt-6 rounded-md border border-border bg-paper p-5">
            <div className="kicker">Doel van het contact</div>
            <p className="mt-2 text-[0.95rem] text-foreground/90">{task.contact.doel}</p>

            {fase === "overzicht" && (
              <button
                onClick={() => setFase("verbinden")}
                className="mt-5 rounded-md bg-sage px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
              >
                {task.contact.startLabel}
              </button>
            )}

            {fase === "verbinden" && (
              <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-sage" />
                {VERBIND_TEKST[task.kind] ?? "Verbinden…"}
              </div>
            )}

            {(fase === "gesprek" || fase === "klaar") && (
              <div className="mt-5 animate-enter">
                <div className="flex items-center gap-2 text-sm font-semibold text-sage">
                  <span className="inline-block h-2 w-2 rounded-full bg-sage" />
                  {fase === "gesprek" ? "In gesprek" : "Contact afgerond"}
                </div>
                <ul className="mt-3 space-y-2">
                  {task.contact.punten.map((p) => (
                    <li key={p} className="flex gap-3 text-[0.92rem] text-foreground/90">
                      <span className="text-sage">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
                {fase === "gesprek" && !task.choices && (
                  <button
                    onClick={() => {
                      setFase("klaar");
                      onDecision(task, "Contact afgerond");
                    }}
                    className="mt-5 rounded-md bg-sage px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Afronden
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Keuzes */}
        {toonKeuzes && !gekozen && (
          <div className="mt-6">
            <div className="kicker">Jouw beslissing</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {task.choices!.map((c) => (
                <button
                  key={c.label}
                  onClick={() => kies(c.label, c.gevolg)}
                  className="rounded-md border border-sage/40 bg-paper px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-[1px] hover:bg-sage-soft"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {gekozen && (
          <div className="mt-6 animate-enter rounded-md border border-sage/30 bg-sage-soft/50 p-5">
            <div className="kicker text-accent-foreground">Gekozen: {gekozen}</div>
            <p className="mt-2 text-[0.92rem] text-accent-foreground">{gevolg}</p>
            <div className="mt-4 space-y-1.5">
              {FOLLOWUP.slice(0, checklist).map((f) => (
                <div key={f} className="animate-enter flex items-center gap-2 text-[0.88rem] text-accent-foreground">
                  <span className="text-sage">✓</span>
                  {f}
                </div>
              ))}
            </div>

            {delegatie === "vraag" && (
              <div className="animate-enter mt-5 rounded-md border border-border bg-paper p-4">
                <p className="text-[0.92rem] text-foreground/90">
                  Je koos in 14 vergelijkbare situaties 13 keer hetzelfde. Voortaan zelfstandig afhandelen?
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => {
                      setDelegatie("ja");
                      onDelegate?.();
                    }}
                    className="rounded-md bg-sage px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Ja, zelfstandig
                  </button>
                  <button
                    onClick={() => setDelegatie("nee")}
                    className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                  >
                    Nee, blijf vragen
                  </button>
                </div>
              </div>
            )}
            {delegatie === "ja" && (
              <p className="animate-enter mt-4 font-serif text-[1rem] text-sage">
                Delegatieprofiel bijgewerkt — vergelijkbare gevallen verschijnen voortaan alleen onder water.
              </p>
            )}
            {delegatie === "nee" && (
              <p className="animate-enter mt-4 text-[0.9rem] text-muted-foreground">
                Goed — deze situatie blijft aan jou voorgelegd worden.
              </p>
            )}

            <button
              onClick={onClose}
              className="mt-5 rounded-md border border-border bg-paper px-4 py-2 text-sm text-foreground hover:bg-secondary"
            >
              Klaar
            </button>
          </div>
        )}

        {fase === "klaar" && !task.choices && (
          <button
            onClick={onClose}
            className="mt-6 rounded-md border border-border bg-paper px-4 py-2 text-sm text-foreground hover:bg-secondary"
          >
            Klaar
          </button>
        )}
      </div>
    </div>
  );
}
