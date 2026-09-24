import { KIND_LABEL, type Task } from "@/lib/demo-data";

const KIND_ICON: Record<string, string> = {
  fysiek: "◉",
  video: "▢",
  telefoon: "☏",
  visite: "⌂",
  beslissing: "✓",
  foto: "◐",
  slechtnieuws: "✦",
  pauze: "•",
};

export function TaskCard({
  task,
  onClick,
  actief,
  gedaan,
}: {
  task: Task;
  onClick?: () => void;
  actief?: boolean;
  gedaan?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "paper-card animate-enter block w-full text-left transition-all duration-200",
        "px-5 py-4 hover:-translate-y-[1px] hover:shadow-md",
        actief ? "border-l-[5px] border-l-sage ring-1 ring-sage/25" : "",
        task.urgent ? "border-l-[5px] border-l-urgent" : "",
        gedaan ? "opacity-50" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <span className="mt-[2px] text-base text-sage/70">{KIND_ICON[task.kind]}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-[1.05rem] text-foreground">
              {task.naam}
              {task.leeftijd ? <span className="text-muted-foreground">, {task.leeftijd}</span> : null}
            </span>
            {actief && (
              <span className="rounded-full bg-sage px-2 py-[2px] text-[0.65rem] font-semibold tracking-wide text-primary-foreground">
                Nu
              </span>
            )}
            {task.mensNodig && (
              <span className="rounded-full bg-sage-soft px-2 py-[2px] text-[0.65rem] font-semibold tracking-wide text-accent-foreground">
                Mens nodig
              </span>
            )}
            {task.urgent && (
              <span className="rounded-full bg-urgent-soft px-2 py-[2px] text-[0.65rem] font-semibold tracking-wide text-urgent">
                Urgent
              </span>
            )}
          </div>
          <p className="mt-1 text-[0.95rem] leading-snug text-foreground/90">{task.titel}</p>
          <p className="mt-1 text-[0.82rem] leading-snug text-muted-foreground">{task.sub}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">
            {KIND_LABEL[task.kind]}
          </div>
          <div className="mt-1 font-serif text-[0.95rem] text-foreground/80">{task.duur}</div>
        </div>
      </div>
    </button>
  );
}
