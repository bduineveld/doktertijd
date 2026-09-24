import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { MAX_DELEGATIE_TOAST, useMaxDelegatie } from "@/lib/max-delegatie";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Pagina niet gevonden</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Deze pagina bestaat niet of is verplaatst.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Naar de spreekkamer
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Deze pagina laadde niet
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Probeer het opnieuw.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DokterTijd" },
      {
        name: "description",
        content: "Dokterstijd alleen waar een dokter nodig is.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const HOOFD = { to: "/", label: "Spreekkamer" } as const;

const NAV = [
  { to: "/werkdag", label: "Mijn werkdag" },
  { to: "/simuleer", label: "Simuleer een dag" },
  { to: "/onder-water", label: "Onder water" },
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [maxDelegatie, zet] = useMaxDelegatie();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-border bg-paper/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-8 py-4">
            <Link to="/" className="flex items-baseline gap-3">
              <span className="font-serif text-xl tracking-tight text-foreground">DokterTijd</span>
              <span className="hidden text-[0.8rem] text-muted-foreground xl:inline">
                5.000 patiënten. Dokterstijd alleen waar een dokter nodig is.
              </span>
            </Link>
            <div className="flex items-center gap-5">
              <nav className="flex items-center gap-1">
                <Link
                  to={HOOFD.to}
                  className="rounded-md px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-secondary"
                  activeProps={{
                    className:
                      "rounded-md px-3 py-1.5 text-sm bg-sage-soft text-accent-foreground font-semibold",
                  }}
                  activeOptions={{ exact: true }}
                >
                  {HOOFD.label}
                </Link>
                <span className="mx-1 h-4 w-px bg-border" />
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="rounded-md px-2.5 py-1 text-[0.78rem] text-muted-foreground/70 transition-colors hover:bg-secondary hover:text-muted-foreground"
                    activeProps={{
                      className: "rounded-md px-2.5 py-1 text-[0.78rem] bg-secondary text-foreground font-medium",
                    }}
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                role="switch"
                aria-checked={maxDelegatie}
                onClick={() => {
                  const nieuw = !maxDelegatie;
                  zet(nieuw);
                  if (nieuw) setToast(MAX_DELEGATIE_TOAST);
                }}
                className={`flex max-w-[16rem] items-center gap-3 rounded-2xl border px-4 py-2 text-left transition-colors ${
                  maxDelegatie ? "border-sage/40 bg-sage-soft" : "border-border bg-paper hover:bg-secondary"
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-[0.82rem] font-semibold leading-tight text-foreground">
                    Volledig autonoom
                  </span>
                  <span className="mt-0.5 block text-[0.72rem] leading-snug text-muted-foreground">
                    {maxDelegatie
                      ? "Geen overlegjes, geen foto's. Alleen zorg die een mens nét nodig heeft."
                      : "AI legt fotobeoordelingen en korte overlegjes nog aan je voor."}
                  </span>
                </span>
                <span
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                    maxDelegatie ? "bg-sage" : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper shadow transition-all ${
                      maxDelegatie ? "left-[1.15rem]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>

        <footer className="border-t border-border bg-paper/60">
          <div className="mx-auto max-w-6xl px-8 py-5 text-[0.78rem] text-muted-foreground">
            DokterTijd — dokterstijd alleen waar een dokter nodig is. · Fictieve hackathondemo · geen echte
            patiëntgegevens.
          </div>
        </footer>

        {toast && (
          <div className="animate-pop fixed bottom-8 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-sage px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}
