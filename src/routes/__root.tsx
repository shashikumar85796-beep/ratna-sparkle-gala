import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ScrollProgressBar } from "../components/site/ScrollProgressBar";
import { BackToTop } from "../components/site/BackToTop";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-gold-gradient">404</h1>
        <h2 className="mt-4 text-xl font-cinzel text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has wandered off the red carpet.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-gold">Return Home</Link>
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
        <h1 className="text-xl font-cinzel text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold">Try again</button>
          <a href="/" className="btn-outline-gold">Go home</a>
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
      { title: "BCS Ratna Award — India's Premier Broadcasting & Media Award" },
      { name: "description", content: "BCS Ratna Award by Aavishkar Media Group — celebrating excellence in Broadcasting, Cable, Satellite, Digital Media & Technology since 2010." },
      { name: "author", content: "Aavishkar Media Group" },
      { property: "og:title", content: "BCS Ratna Award — India's Premier Broadcasting & Media Award" },
      { property: "og:description", content: "BCS Ratna Award by Aavishkar Media Group — celebrating excellence in Broadcasting, Cable, Satellite, Digital Media & Technology since 2010." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BCS Ratna Award — India's Premier Broadcasting & Media Award" },
      { name: "twitter:description", content: "BCS Ratna Award by Aavishkar Media Group — celebrating excellence in Broadcasting, Cable, Satellite, Digital Media & Technology since 2010." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1f88fe8a-51e6-4dad-85e5-68992a285137/id-preview-7c085b68--842dc612-2d6a-4b54-aac0-3cbf19abb1a5.lovable.app-1780548443441.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1f88fe8a-51e6-4dad-85e5-68992a285137/id-preview-7c085b68--842dc612-2d6a-4b54-aac0-3cbf19abb1a5.lovable.app-1780548443441.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Cinzel+Decorative:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProgressBar />
      <Outlet />
      <BackToTop />
    </QueryClientProvider>
  );
}
