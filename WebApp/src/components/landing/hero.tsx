import React from "react";
import { ArrowRight, Globe, Sparkles, Award, ShieldCheck, CheckCircle2, Zap, Building } from "lucide-react";
import { PLAYSTORE_URL, APPSTORE_URL } from "@/lib/site";
import { useLang } from "@/hooks/use-lang";

interface HeroProps {
  onLaunchApp?: () => void;
}

const LIVE_TICKER_ITEMS = [
  { flag: "🇫🇷", label: "Bourse d'Excellence Eiffel (France)", amount: "1 400 € / mois", badge: "Excellence" },
  { flag: "🌍", label: "Mastercard Foundation Scholars", amount: "100% Pris en charge", badge: "Complet" },
  { flag: "🇬🇧", label: "Chevening Scholarships (UK)", amount: "Frais complets + Allocation", badge: "Prestige" },
  { flag: "🇯🇵", label: "Bourse Gouvernement Japonais (MEXT)", amount: "145 000 ¥ / mois", badge: "Asie" },
  { flag: "🇨🇦", label: "Bourses d'Exemption Québec (Canada)", amount: "Droits de scolarité québécois", badge: "Francophonie" },
  { flag: "🇩🇪", label: "Bourse DAAD Helmut-Schmidt (Allemagne)", amount: "934 € / mois + Assurance", badge: "Europe" },
  { flag: "🇫🇷", label: "Campus France & Écoles d'Ingénieurs", amount: "Mentorat DOH Kodzo Benjamin", badge: "Campus France" },
  { flag: "⚡", label: "Moteur Prédictif d'Admission IA", amount: "98% d'Optimisation", badge: "IA Boursio" },
];

export const Hero: React.FC<HeroProps> = ({ onLaunchApp }) => {
  const { lang, t } = useLang();
  const th = t.hero[lang];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden pt-28 pb-8">
      {/* Background layers & Grid Glow */}
      <div className="absolute inset-0 bg-grid opacity-100" />
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />

      {/* Atmospheric Glow Orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full opacity-[0.14] blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #0047AB 0%, #00c9a7 70%, transparent 100%)" }}
      />
      <div
        className="absolute top-1/3 left-[12%] w-[380px] h-[380px] rounded-full opacity-[0.09] blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #3b7fff 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 right-[10%] w-[360px] h-[360px] rounded-full opacity-[0.10] blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #00c9a7 0%, transparent 70%)" }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">

        {/* Main Headline — Staggered word-reveal animation */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          {/* Line 1: plain white words */}
          <span className="block overflow-hidden">
            {th.headline1.split(" ").map((word, i) => (
              <span
                key={i}
                className="inline-block mr-[0.25em] hero-word"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {word}
              </span>
            ))}
          </span>
          {/* Line 2: gradient words */}
          <span className="block mt-1 overflow-hidden">
            {th.headline2.split(" ").map((word, i) => (
              <span
                key={i}
                className="inline-block mr-[0.25em] gradient-text hero-word"
                style={{ animationDelay: `${(th.headline1.split(" ").length + i) * 90}ms` }}
              >
                {word}
              </span>
            ))}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-3xl text-base sm:text-xl text-muted-foreground leading-relaxed mb-10">
          {th.sub}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto mb-12">
          {/* Main Web App Launcher */}
          <button
            type="button"
            onClick={onLaunchApp}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 h-14 px-8 rounded-2xl font-bold text-base bg-gradient-to-r from-primary via-blue-600 to-teal-500 text-white shadow-glow-strong hover:shadow-glow hover:scale-[1.02] transition-all duration-200"
          >
            <Globe className="h-5 w-5" />
            <span>{th.launchWeb}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Quick Simulator Link */}
          <a
            href="#simulator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-6 rounded-2xl border border-border bg-card/80 hover:bg-secondary text-foreground text-sm font-semibold transition-all shadow-sm"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span>{th.simulatorBtn}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
