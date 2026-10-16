import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    dedupe: ["zod"],
  },
  ssr: {
    // Bundle Zod so Better Auth's Zod 4 APIs (.loose) are not
    // resolved to a different copy at function runtime.
    noExternal: ["zod"],
  },
  server: {
    host: "127.0.0.1",
    port: 43127,
    strictPort: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    netlify({
      // Local preview does not need the Deno edge emulator.
      dev: { edgeFunctions: { enabled: false } },
    }),
  ],
});

export default config;
