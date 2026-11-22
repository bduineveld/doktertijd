import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/toekomst")({
  head: () => ({
    meta: [
      { title: "Toekomst — DokterTijd" },
      {
        name: "description",
        content:
          "Vooruitblik: wat nu al kan, wat in 2030 past en wat daarna nog uitwerking vraagt.",
      },
      { property: "og:title", content: "Toekomst — DokterTijd" },
    ],
  }),
  component: Toekomst,
});

/* Eén 'slide' voor de presentatie: een opkomende horizon met drie bogen. */

const W = 1600;
const H = 900;
const CX = W / 2;
const CY = H;

type Item = { r: number; hoek: number; tekst: string; sub?: string; onzeker?: boolean };

const BOGEN = [
  { r: 210, label: "nu" },
  { r: 420, label: "2030" },
  { r: 640, label: "later", onzeker: true },
] as const;

const ITEMS: Item[] = [
  { r: 210, hoek: 152, tekst: "plezier in het bouwen" },
  { r: 210, hoek: 28, tekst: "zelf praktijktools bouwen" },
  { r: 420, hoek: 148, tekst: "dossier samenvatten" },
  { r: 420, hoek: 32, tekst: "bewezen veilige keuzes" },
  { r: 640, hoek: 135, tekst: "complexe zorg", onzeker: true },
  { r: 640, hoek: 110, tekst: "eigen taal", sub: "Hallo · Merhaba · مرحبا · Cześć", onzeker: true },
  { r: 640, hoek: 70, tekst: "kwetsbare ouderen", onzeker: true },
  { r: 640, hoek: 45, tekst: "minder digitaal vaardig", onzeker: true },
];

/** Sterrenbeeld rechtsboven: het netwerk dat samen deelt. */
const STERREN = [
  [1250, 120],
  [1318, 82],
  [1392, 132],
  [1460, 92],
  [1512, 160],
  [1378, 196],
] as const;
const LIJNEN = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [2, 5],
  [4, 5],
] as const;

function punt(r: number, hoek: number) {
  const a = (hoek * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) };
}

function boog(r: number) {
  return `M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`;
}

function Toekomst() {
  const slide = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-ink px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div
          ref={slide}
          className="relative aspect-video w-full overflow-hidden rounded-2xl bg-paper"
          style={{
            boxShadow: "0 0 120px -30px oklch(0.42 0.045 165 / 55%), 0 0 0 1px oklch(1 0 0 / 6%)",
          }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Vooruitblik als horizon. Nu: plezier in het bouwen, zelf praktijktools bouwen. 2030: dossier samenvatten, bewezen veilige keuzes. Later: complexe zorg, eigen taal, kwetsbare ouderen, minder digitaal vaardigen. Rechtsboven: samen delen in het CMIO-netwerk."
          >
            <style>{`
              @keyframes tk-teken { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
              @keyframes tk-in { from { opacity: 0; } to { opacity: 1; } }
              .tk-boog { stroke-dasharray: 1; animation: tk-teken 1.4s ease-out both; }
              .tk-in { animation: tk-in 0.8s ease-out both; }
            `}</style>

            <defs>
              <radialGradient id="tk-gloed" cx="50%" cy="100%" r="75%">
                <stop offset="0%" stopColor="var(--sage-soft)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--paper)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Gloed van de opkomende horizon */}
            <rect x="0" y="0" width={W} height={H} fill="url(#tk-gloed)" />

            {/* Kern: wat nu al kan */}
            <path d={`${boog(210)} Z`} fill="var(--sage-soft)" className="tk-in" />

            {/* Bogen */}
            {BOGEN.map((b, i) =>
              "onzeker" in b ? (
                <path
                  key={b.label}
                  d={boog(b.r)}
                  fill="none"
                  stroke="var(--sage)"
                  strokeOpacity="0.45"
                  strokeWidth="2"
                  strokeDasharray="4 12"
                  strokeLinecap="round"
                  className="tk-in"
                  style={{ animationDelay: `${0.3 + i * 0.35}s` }}
                />
              ) : (
                <path
                  key={b.label}
                  d={boog(b.r)}
                  pathLength={1}
                  fill="none"
                  stroke="var(--sage)"
                  strokeWidth={i === 0 ? 3 : 2}
                  className="tk-boog"
                  style={{ animationDelay: `${0.3 + i * 0.35}s` }}
                />
              ),
            )}

            {/* Labels op de top van elke boog */}
            {BOGEN.map((b, i) => (
              <g key={b.label} className="tk-in" style={{ animationDelay: `${0.9 + i * 0.35}s` }}>
                <rect
                  x={CX - 52}
                  y={CY - b.r - 22}
                  width="104"
                  height="44"
                  rx="22"
                  fill={i === 0 ? "var(--sage)" : "var(--paper)"}
                  stroke="var(--sage)"
                  strokeOpacity={i === 2 ? 0.45 : 1}
                  strokeDasharray={i === 2 ? "4 6" : undefined}
                />
                <text
                  x={CX}
                  y={CY - b.r + 8}
                  textAnchor="middle"
                  className="font-serif"
                  fontSize="24"
                  fill={i === 0 ? "var(--paper)" : "var(--accent-foreground)"}
                >
                  {b.label}
                </text>
              </g>
            ))}

            {/* Steekwoorden */}
            {ITEMS.map((it, i) => {
              const p = punt(it.r, it.hoek);
              const links = it.hoek > 90;
              const dx = links ? -22 : 22;
              return (
                <g
                  key={it.tekst}
                  className="tk-in"
                  style={{ animationDelay: `${1.2 + i * 0.12}s` }}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="8"
                    fill={it.onzeker ? "var(--paper)" : "var(--sage)"}
                    stroke="var(--sage)"
                    strokeWidth="2"
                  />
                  <text
                    x={p.x + dx}
                    y={p.y + 8}
                    textAnchor={links ? "end" : "start"}
                    fontSize="25"
                    fill={it.onzeker ? "var(--muted-foreground)" : "var(--foreground)"}
                  >
                    {it.tekst}
                  </text>
                  {it.sub && (
                    <text
                      x={p.x + dx}
                      y={p.y - 30}
                      textAnchor={links ? "end" : "start"}
                      fontSize="19"
                      fill="var(--muted-foreground)"
                      fillOpacity="0.75"
                    >
                      {it.sub}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Sterrenbeeld: samen delen */}
            <g className="tk-in" style={{ animationDelay: "2.3s" }}>
              {LIJNEN.map(([a, b]) => (
                <line
                  key={`${a}-${b}`}
                  x1={STERREN[a][0]}
                  y1={STERREN[a][1]}
                  x2={STERREN[b][0]}
                  y2={STERREN[b][1]}
                  stroke="var(--sage)"
                  strokeOpacity="0.4"
                  strokeWidth="1.5"
                />
              ))}
              {STERREN.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i === 2 ? 7 : 5} fill="var(--sage)" />
              ))}
              <text
                x="1512"
                y="252"
                textAnchor="end"
                className="font-serif"
                fontSize="26"
                fill="var(--foreground)"
              >
                samen delen
              </text>
              <text x="1512" y="284" textAnchor="end" fontSize="19" fill="var(--muted-foreground)">
                AI-kanaal · CMIO-netwerk
              </text>
            </g>

            {/* Kop */}
            <text
              x="88"
              y="104"
              fontSize="17"
              letterSpacing="3"
              fill="var(--muted-foreground)"
              fontWeight="600"
            >
              DOKTERTIJD · VOORUITBLIK
            </text>
          </svg>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => slide.current?.requestFullscreen?.()}
            className="rounded-full border border-paper/20 px-4 py-1.5 text-[0.82rem] text-paper/60 hover:border-paper/50 hover:text-paper"
          >
            Volledig scherm
          </button>
        </div>
      </div>
    </div>
  );
}
