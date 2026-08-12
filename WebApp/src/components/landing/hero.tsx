import { ArrowRight, Globe } from "lucide-react";
import { PLAYSTORE_URL, APPSTORE_URL } from "@/lib/site";

interface HeroProps {
  onLaunchApp?: () => void;
}

export function Hero({ onLaunchApp }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-100" />
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.10] blur-[120px]"
        style={{ background: "radial-gradient(ellipse, #0047AB 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 left-[20%] w-[320px] h-[320px] rounded-full opacity-[0.08] blur-[80px]"
        style={{ background: "radial-gradient(ellipse, #0066cc 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 right-[15%] w-[280px] h-[280px] rounded-full opacity-[0.08] blur-[80px]"
        style={{ background: "radial-gradient(ellipse, #00c9a7 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20 lg:py-28">
        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          <span className="block text-foreground">Trouvez les bourses d'études</span>
          <span className="block gradient-text mt-1">adaptées à votre profil.</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-base sm:text-xl text-muted-foreground leading-relaxed mb-12">
          Boursio est l'application mobile et web munie d'une IA intelligente qui vous recommande
          les bourses sur-mesure, rédigera et optimisera vos dossiers, et suivra vos candidatures
          jusqu'au succès.
        </p>

        {/* Action / Launch Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto mb-12">
          {/* Web Launcher */}
          <button
            type="button"
            onClick={onLaunchApp}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 h-14 px-8 rounded-2xl font-bold text-base gradient-cta text-white shadow-glow hover:shadow-glow-strong transition-all duration-200 hover:scale-[1.02]"
          >
            <Globe className="h-5 w-5" />
            <span>Lancer la version web</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Play Store Button */}
          <a
            href={PLAYSTORE_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 h-14 px-6 rounded-2xl border border-border bg-card/80 hover:bg-muted/60 text-foreground transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            {/* Google Play SVG Icon */}
            <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none">
              <path
                d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 01-.61-1.428V3.242c0-.555.227-1.057.61-1.428z"
                fill="#00D2FF"
              />
              <path
                d="M17.18 8.612l-3.388 3.388 3.388 3.388 3.83-2.176c.725-.412.725-1.988 0-2.4l-3.83-2.2z"
                fill="#FFD200"
              />
              <path
                d="M3.609 1.814L13.792 12l3.388-3.388L5.352 1.916a2.022 2.022 0 00-1.743-.102z"
                fill="#00F076"
              />
              <path
                d="M3.609 22.186a2.022 2.022 0 001.743-.102l11.828-6.696L13.792 12 3.609 22.186z"
                fill="#FF3A44"
              />
            </svg>
            <span className="font-display font-bold text-sm text-foreground">
              Boursio sur Play Store
            </span>
          </a>

          {/* App Store Button */}
          <a
            href={APPSTORE_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 h-14 px-6 rounded-2xl border border-border bg-card/80 hover:bg-muted/60 text-foreground transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            {/* Apple Store SVG Icon */}
            <svg className="h-6 w-6 shrink-0 fill-current text-foreground" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.12-1 .04-2.22.67-2.92 1.49-.62.73-1.17 1.89-1.02 3.03 1.12.09 2.27-.57 2.95-1.4" />
            </svg>
            <span className="font-display font-bold text-sm text-foreground">
              Boursio sur App Store
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
