// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// `npm run build:static` prerenders every route to plain HTML in dist/client so the
// site can be served by any static web server (Apache on doktertijd.dokterbart.nl).
// The app has no server functions, so nothing is lost by skipping the Node/Cloudflare server.
const staticBuild = process.env.DEPLOY_TARGET === "static";

export default defineConfig({
  nitro: staticBuild ? false : undefined,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(staticBuild && {
      prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true },
    }),
  },
});
