import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/page";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flow Weaver — Node-based automations for developers" },
      {
        name: "description",
        content:
          "Design, version, and ship node-based automations. Immutable versions, run history, and a JSON-first graph model built for developers.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONT_HREF },
    ],
  }),
  component: LandingPage,
});
