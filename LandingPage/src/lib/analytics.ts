export function trackCTA(label: string) {
  if (typeof window === "undefined") return;

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props: Record<string, string> }) => void;
  };

  w.gtag?.("event", "cta_click", { event_label: label });
  w.plausible?.("CTA Click", { props: { label } });
}
