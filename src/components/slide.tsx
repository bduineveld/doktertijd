import { useRef, type ReactNode } from "react";

/** Vaste tekenmaat van elke slide (16:9). */
export const SLIDE_W = 1600;
export const SLIDE_H = 900;

/**
 * Gedeelde animaties voor slides:
 * - sl-in: rustig infaden
 * - sl-teken: lijn tekenen (gebruik met pathLength={1})
 * - sl-adem: langzaam ademen, voor een halo die 'tijd' uitbeeldt
 */
const SLIDE_CSS = `
  @keyframes sl-teken { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes sl-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes sl-adem { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
  .sl-teken { stroke-dasharray: 1; animation: sl-teken 1.4s ease-out both; }
  .sl-in { animation: sl-in 0.8s ease-out both; }
  .sl-adem { transform-box: fill-box; transform-origin: center; animation: sl-adem 5s ease-in-out infinite; }
`;

/** Eén presentatieslide: 16:9-kaart op een donkere achtergrond, met knop voor volledig scherm. */
export function Slide({ label, children }: { label: string; children: ReactNode }) {
  const kaart = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-ink px-6 py-6">
      {/* Breedte volgt ook de schermhoogte, zodat de hele slide onder het menu past (ook in 1280×720). */}
      <div
        className="mx-auto"
        style={{ width: "min(100%, 72rem, calc((100vh - 13rem) * 16 / 9))" }}
      >
        <div
          ref={kaart}
          className="relative aspect-video w-full overflow-hidden rounded-2xl bg-paper"
          style={{
            boxShadow: "0 0 120px -30px oklch(0.42 0.045 165 / 55%), 0 0 0 1px oklch(1 0 0 / 6%)",
          }}
        >
          <svg
            viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={label}
          >
            <style>{SLIDE_CSS}</style>
            {children}
          </svg>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => kaart.current?.requestFullscreen?.()}
            className="rounded-full border border-paper/20 px-4 py-1.5 text-[0.82rem] text-paper/60 hover:border-paper/50 hover:text-paper"
          >
            Volledig scherm
          </button>
        </div>
      </div>
    </div>
  );
}

/** Klein kopje linksboven, gelijk op elke slide. */
export function SlideKop({ children }: { children: ReactNode }) {
  return (
    <text
      x="88"
      y="104"
      fontSize="17"
      letterSpacing="3"
      fill="var(--muted-foreground)"
      fontWeight="600"
    >
      {children}
    </text>
  );
}
