import { createFileRoute } from "@tanstack/react-router";
import { SLIDE_W, Slide, SlideKop } from "@/components/slide";

export const Route = createFileRoute("/aanleiding")({
  head: () => ({
    meta: [
      { title: "Aanleiding" },
      {
        name: "description",
        content:
          "Aanleiding en ambitie: twee keer zoveel patiënten, en tijd voor de zorg die ertoe doet.",
      },
      { property: "og:title", content: "Aanleiding" },
    ],
  }),
  component: Aanleiding,
});

/*
 * Eén 'slide': links veel vragen (2× zoveel patiënten), in het midden een smalle
 * doorgang, rechts een paar contacten met ruim de tijd eromheen.
 */

const CX = SLIDE_W / 2;
const MIDDEN_Y = 520;

/** Veld van patiëntvragen: de linkerhelft is de huidige praktijk, de rechterhelft het dubbele. */
const KOLOMMEN = 14;
const RIJEN = 9;
const STAP = 34;
const VELD_X = 150;
const VELD_Y = MIDDEN_Y - ((RIJEN - 1) * STAP) / 2;

const VELD = Array.from({ length: KOLOMMEN * RIJEN }, (_, i) => {
  const kol = i % KOLOMMEN;
  const rij = Math.floor(i / KOLOMMEN);
  // Kleine, vaste verschuiving zodat het geen strak raster wordt (gelijk bij server en browser).
  const jx = Math.sin(i * 12.9898) * 5;
  const jy = Math.cos(i * 78.233) * 5;
  return {
    x: VELD_X + kol * STAP + jx,
    y: VELD_Y + rij * STAP + jy,
    extra: kol >= KOLOMMEN / 2,
    i,
  };
});
const VELD_RECHTS = VELD_X + (KOLOMMEN - 1) * STAP;

/** De contacten waar de dokter echt voor nodig is. */
const CONTACTEN = [
  { x: 1040, y: 400 },
  { x: 1250, y: 470 },
  { x: 1450, y: 390 },
  { x: 1130, y: 640 },
  { x: 1360, y: 650 },
];

const DOORGANG_X = 820;
const INSTROOM_Y = [380, 450, MIDDEN_Y, 590, 660];

function Aanleiding() {
  return (
    <Slide label="Aanleiding en ambitie. Centrale vraag: als we opnieuw konden beginnen, met AI. Links een veld van patiëntvragen: twee keer zoveel patiënten. Via een smalle doorgang gaan alleen enkele contacten door, met ruim tijd eromheen: tijd voor wat ertoe doet. Onderaan: zelf tastbaar gemaakt, zonder programmeerkennis.">
      <defs>
        <radialGradient id="al-halo">
          <stop offset="0%" stopColor="var(--sage-soft)" stopOpacity="1" />
          <stop offset="70%" stopColor="var(--sage-soft)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--sage-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Centrale vraag */}
      <text
        x={CX}
        y="218"
        textAnchor="middle"
        className="font-serif sl-in"
        fontSize="54"
        fill="var(--foreground)"
      >
        Als we opnieuw konden beginnen…
      </text>
      <text
        x={CX}
        y="266"
        textAnchor="middle"
        fontSize="17"
        letterSpacing="3"
        fontWeight="600"
        fill="var(--muted-foreground)"
        className="sl-in"
        style={{ animationDelay: "0.4s" }}
      >
        HUISARTSENZORG · ICT · AI
      </text>

      {/* Veld: 2× zoveel patiënten */}
      {VELD.map((d) => (
        <circle
          key={d.i}
          cx={d.x}
          cy={d.y}
          r="6"
          fill={d.extra ? "var(--paper)" : "var(--sage)"}
          fillOpacity={d.extra ? 1 : 0.55}
          stroke="var(--sage)"
          strokeOpacity={d.extra ? 0.6 : 0}
          strokeWidth="1.5"
          className="sl-in"
          style={{ animationDelay: `${0.6 + (d.i % KOLOMMEN) * 0.06}s` }}
        />
      ))}
      <text
        x={(VELD_X + VELD_RECHTS) / 2}
        y={VELD_Y + (RIJEN - 1) * STAP + 78}
        textAnchor="middle"
        fontSize="26"
        fill="var(--foreground)"
        className="sl-in"
        style={{ animationDelay: "1.4s" }}
      >
        2× zoveel patiënten
      </text>

      {/* Instroom naar de smalle doorgang */}
      {INSTROOM_Y.map((y, i) => (
        <path
          key={y}
          d={`M ${VELD_RECHTS + 24} ${y} C ${VELD_RECHTS + 120} ${y}, ${DOORGANG_X - 110} ${MIDDEN_Y}, ${DOORGANG_X - 14} ${MIDDEN_Y}`}
          pathLength={1}
          fill="none"
          stroke="var(--sage)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          className="sl-teken"
          style={{ animationDelay: `${1.5 + i * 0.08}s` }}
        />
      ))}

      {/* Doorgang */}
      <rect
        x={DOORGANG_X - 12}
        y={MIDDEN_Y - 62}
        width="24"
        height="124"
        rx="12"
        fill="var(--paper)"
        stroke="var(--sage)"
        strokeWidth="2"
        className="sl-in"
        style={{ animationDelay: "1.9s" }}
      />

      {/* Uitstroom naar de contacten */}
      {CONTACTEN.map((c, i) => (
        <path
          key={`${c.x}-${c.y}`}
          d={`M ${DOORGANG_X + 14} ${MIDDEN_Y} C ${DOORGANG_X + 120} ${MIDDEN_Y}, ${c.x - 140} ${c.y}, ${c.x} ${c.y}`}
          pathLength={1}
          fill="none"
          stroke="var(--sage)"
          strokeOpacity="0.5"
          strokeWidth="2"
          className="sl-teken"
          style={{ animationDelay: `${2.1 + i * 0.1}s` }}
        />
      ))}

      {/* Contacten met ruim tijd eromheen */}
      {CONTACTEN.map((c, i) => (
        <g key={`c-${c.x}`} className="sl-in" style={{ animationDelay: `${2.5 + i * 0.12}s` }}>
          <circle
            cx={c.x}
            cy={c.y}
            r="78"
            fill="url(#al-halo)"
            className="sl-adem"
            style={{ animationDelay: `${i * 0.9}s` }}
          />
          <circle cx={c.x} cy={c.y} r="11" fill="var(--sage)" />
        </g>
      ))}
      <text
        x="1245"
        y={VELD_Y + (RIJEN - 1) * STAP + 78}
        textAnchor="middle"
        fontSize="26"
        fill="var(--foreground)"
        className="sl-in"
        style={{ animationDelay: "3.1s" }}
      >
        tijd voor wat ertoe doet
      </text>

      {/* Onderaan: zelf bouwen */}
      <text
        x={CX}
        y="840"
        textAnchor="middle"
        fontSize="19"
        fill="var(--muted-foreground)"
        className="sl-in"
        style={{ animationDelay: "3.4s" }}
      >
        zelf tastbaar gemaakt — zonder programmeerkennis
      </text>

      <SlideKop>AANLEIDING</SlideKop>
    </Slide>
  );
}
