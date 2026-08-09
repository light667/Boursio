import { Check, Sparkles } from "lucide-react";
import { PRICING_PLANS } from "./data";
import { APP_URL } from "@/lib/site";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">
            Offres & Tarifs
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Des tarifs accessibles à tous,{" "}
            <span className="gradient-text">sans aucun engagement.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            Commencez gratuitement avec l'accès aux recommandations et à l'analyse, puis passez au plan Pro ou Max selon vos besoins.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                plan.highlight
                  ? "border-primary/50 bg-gradient-to-b from-primary/10 via-card to-card shadow-[0_0_50px_rgba(59,127,255,0.18)] scale-[1.02]"
                  : "border-border bg-card/70 hover:border-border/80"
              }`}
            >
              {/* Highlight badge */}
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-glow">
                    <Sparkles className="h-3 w-3" />
                    Offre Max Illimitée
                  </span>
                </div>
              )}

              <div>
                {/* Plan header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">
                      {plan.badge}
                    </span>
                    <span className="font-display font-semibold text-lg text-foreground">
                      {plan.name}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
                </div>

                {/* Features list */}
                <div className="pt-4 border-t border-border/50 mb-8">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                    Inclus dans ce plan :
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-accent/20 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-accent" />
                        </div>
                        <span className="text-sm text-muted-foreground leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA button */}
              <a
                href={APP_URL}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center h-12 rounded-2xl text-sm font-bold transition-all ${
                  plan.ctaPrimary
                    ? "gradient-cta text-white shadow-glow hover:shadow-glow-strong hover:scale-[1.01]"
                    : "border border-border text-foreground hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Guarantee note */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          Paiements sécurisés par Mobile Money (Wave, Orange Money, MTN MoMo, Moov) et Carte bancaire. Sans engagement.
        </div>
      </div>
    </section>
  );
}