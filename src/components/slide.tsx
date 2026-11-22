import { useEffect, useRef, type ReactNode } from "react";

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

/**
 * Eén presentatieslide, schermvullend zoals de openingspagina: geen menu, geen kader.
 * De tekening blijft 16:9 en schaalt mee; bij een andere verhouding vult papier de rest.
 * Toets F zet volledig scherm aan of uit. Met onderaan={true} staat de tekening op de
 * onderrand (voor een horizon), anders in het midden.
 */
export function Slide({
  label,
  onderaan = false,
  children,
}: {
  label: string;
  onderaan?: boolean;
  children: ReactNode;
}) {
  const scherm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opToets = (e: KeyboardEvent) => {
      if (e.key !== "f" && e.key !== "F") return;
      if (document.fullscreenElement) void document.exitFullscreen?.();
      else void scherm.current?.requestFullscreen?.();
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, []);

  return (
    <div ref={scherm} className="h-screen w-full overflow-hidden bg-paper">
      <svg
        viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
        preserveAspectRatio={onderaan ? "xMidYMax meet" : "xMidYMid meet"}
        className="block h-full w-full"
        role="img"
        aria-label={label}
      >
        <style>{SLIDE_CSS}</style>
        {children}
      </svg>
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
