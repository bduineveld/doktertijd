import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DokterTijd — de werkdag van een huisarts in 2030" },
      {
        name: "description",
        content: "Een toekomstverkenning van de werkdag van een huisarts in 2030.",
      },
      { property: "og:title", content: "DokterTijd" },
      { property: "og:description", content: "De werkdag van een huisarts in 2030." },
    ],
  }),
  component: Opening,
});

/** Openingsbeeld: alleen de naam, één regel en een kleine startknop. */
function Opening() {
  const navigate = useNavigate();

  // Enter of spatie start ook, handig tijdens een opname.
  useEffect(() => {
    const opToets = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate({ to: "/spreekkamer" });
      }
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-paper px-6">
      <div className="animate-enter flex flex-col items-center text-center">
        <svg viewBox="0 0 32 32" className="h-11 w-11" aria-hidden>
          <rect width="32" height="32" rx="8" fill="var(--sage)" />
          <path
            d="M16 9v14M9 16h14"
            stroke="var(--paper)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
        <h1 className="mt-7 font-serif text-[clamp(3.5rem,9vw,6.5rem)] leading-none tracking-tight text-foreground">
          DokterTijd
        </h1>
        <p className="mt-5 text-[clamp(1.1rem,2vw,1.4rem)] text-muted-foreground">
          De werkdag van een huisarts in 2030
        </p>
        <Link
          to="/spreekkamer"
          className="mt-12 rounded-full border border-sage/40 px-7 py-2.5 text-[0.95rem] font-medium text-accent-foreground transition-colors hover:bg-sage-soft"
          style={{ animationDelay: "0.6s" }}
        >
          Start
        </Link>
      </div>
      <p className="kicker absolute bottom-8">
        Toekomstverkenning · gebouwd in twee dagen tijdens de hackathon
      </p>
    </div>
  );
}
