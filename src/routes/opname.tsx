import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/opname")({
  head: () => ({
    meta: [{ title: "Opname — DokterTijd" }, { name: "robots", content: "noindex" }],
  }),
  component: Opname,
});

/*
 * Opnamemodus voor de demovideo: de hele site draait in een kader van exact 16:9.
 * Het kader is een iframe, zodat de site daarbinnen precies 1280×720 (of 1920×1080)
 * 'ziet' — schermhoogte, volledig scherm en meldingen werken dan als in een echt venster.
 * Neem alleen het kader op; de balk eronder valt buiten beeld.
 */

const MATEN = {
  "720": { w: 1280, h: 720 },
  "1080": { w: 1920, h: 1080 },
} as const;
type Maat = keyof typeof MATEN;

const PAGINAS = [
  { pad: "/", label: "Start" },
  { pad: "/aanleiding", label: "Aanleiding" },
  { pad: "/spreekkamer", label: "Spreekkamer" },
  { pad: "/werkdag", label: "Mijn werkdag" },
  { pad: "/simuleer", label: "Simuleer" },
  { pad: "/onder-water", label: "Onder water" },
  { pad: "/toekomst", label: "Toekomst" },
] as const;

const BALK_H = 96;

function Opname() {
  const [maat, setMaat] = useState<Maat>("720");
  // pad = waar het kader mee start; huidig = waar je binnen het kader naartoe hebt geklikt.
  const [pad, setPad] = useState("/");
  const [huidig, setHuidig] = useState("/");
  // Pas na het inlezen van het adres mag de adresbalk worden bijgewerkt.
  const [ingelezen, setIngelezen] = useState(false);
  const [herstart, setHerstart] = useState(0);
  // Laadmoment als kenmerk in het kaderadres: zo haalt de browser altijd de nieuwste versie
  // van de pagina op, ook als hij een oude kopie bewaard heeft (een harde refresh ververst
  // alleen de buitenste pagina, niet wat er in het kader staat).
  const [vers, setVers] = useState("");
  const [venster, setVenster] = useState({ w: 0, h: 0, dpr: 1 });
  const frame = useRef<HTMLIFrameElement>(null);

  // Begininstellingen uit het adres: /opname?maat=1080&pad=/aanleiding
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get("maat");
    if (m === "720" || m === "1080") setMaat(m);
    const begin = p.get("pad");
    if (begin?.startsWith("/") && !begin.startsWith("/opname")) {
      setPad(begin);
      setHuidig(begin);
    }
    setVers(Date.now().toString(36));
    setIngelezen(true);
  }, []);

  // Volg het doorklikken binnen het kader (zelfde domein, dus het pad is leesbaar).
  useEffect(() => {
    const t = setInterval(() => {
      try {
        const p = frame.current?.contentWindow?.location.pathname;
        // Tijdens laden staat er even 'about:blank' in het kader; dat negeren.
        if (p?.startsWith("/") && !p.startsWith("/opname"))
          setHuidig(p.length > 1 ? p.replace(/\/$/, "") : p);
      } catch {
        /* kader nog aan het laden */
      }
    }, 400);
    return () => clearInterval(t);
  }, []);

  // Houd de adresbalk gelijk, zodat herladen terugkomt op dezelfde pagina en maat.
  useEffect(() => {
    if (!ingelezen) return;
    const p = new URLSearchParams({ maat, pad: huidig });
    window.history.replaceState(null, "", `/opname?${p.toString()}`);
  }, [ingelezen, maat, huidig]);

  useEffect(() => {
    const meet = () =>
      setVenster({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio });
    meet();
    window.addEventListener("resize", meet);
    return () => window.removeEventListener("resize", meet);
  }, []);

  const { w, h } = MATEN[maat];
  const past = venster.w === 0 || (venster.w >= w && venster.h >= h + BALK_H);
  const opnameW = Math.round(w * venster.dpr);
  const opnameH = Math.round(h * venster.dpr);

  const ga = (nieuw: string) => {
    setPad(nieuw);
    setHuidig(nieuw);
    setHerstart((n) => n + 1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink">
      <div className="relative" style={{ width: w, height: h }}>
        {ingelezen && (
          <iframe
            ref={frame}
            key={`${pad}-${herstart}`}
            // Met slash: de server stuurt '/pagina' anders via een http-redirect door,
            // en die blokkeert de browser binnen een https-pagina (kader blijft leeg).
            src={`${pad === "/" ? pad : `${pad}/`}?v=${vers}-${herstart}`}
            title="DokterTijd in opnamekader"
            width={w}
            height={h}
            allow="microphone; autoplay; fullscreen"
            className="block border-0 bg-paper"
            // Direct toetsen (Enter op de openingspagina) naar de site sturen.
            onLoad={(e) => e.currentTarget.contentWindow?.focus()}
          />
        )}
        {/* Hoekmarkeringen net buiten het kader, om de opnameselectie op te richten. */}
        {(
          ["-left-3 -top-3", "-right-3 -top-3", "-left-3 -bottom-3", "-right-3 -bottom-3"] as const
        ).map((plek) => (
          <span
            key={plek}
            aria-hidden
            className={`pointer-events-none absolute h-2 w-2 rounded-full bg-paper/25 ${plek}`}
          />
        ))}
      </div>

      <div
        className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-2 pt-5 text-[0.8rem] text-paper/55"
        style={{ minHeight: BALK_H - 20 }}
      >
        <div className="flex items-center gap-1">
          {PAGINAS.map((p) => (
            <button
              key={p.pad}
              type="button"
              onClick={() => ga(p.pad)}
              className={`rounded-full px-3 py-1 transition-colors ${
                huidig === p.pad ? "bg-paper/15 text-paper" : "hover:bg-paper/10 hover:text-paper"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className={past ? "" : "text-amber-300"}>
            {past
              ? `kader ${w}×${h} · opname ${opnameW}×${opnameH} px`
              : `venster te klein (${venster.w}×${venster.h}) — maak het groter of zet de browser op volledig scherm`}
          </span>
          <div className="flex rounded-full border border-paper/20 p-0.5">
            {(Object.keys(MATEN) as Maat[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMaat(m)}
                className={`rounded-full px-3 py-0.5 ${
                  maat === m ? "bg-paper/20 text-paper" : "hover:text-paper"
                }`}
              >
                {m}p
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
