import React, { useState } from "react";
import { Check, Sparkles, Gift, Zap, Rocket, ShieldCheck, Smartphone, CreditCard } from "lucide-react";
import { SubscriptionPlan } from "@/lib/types";

interface PricingProps {
  onLaunchApp?: () => void;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onLaunchApp, onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      plan: "free" as SubscriptionPlan,
      name: "Gratuit",
      badge: "Découverte",
      price: "0 FCFA",
      period: "pour toujours",
      description: "Idéal pour explorer les bourses correspondantes et faire vos premiers pas.",
      features: [
        "Recommandation de bourses personnalisée",
        "Accès complet aux fiches de bourses",
        "Coach IA standard (10 questions/jour)",
        "Coffre-fort de documents de base",
        "Filtres de recherche essentiels",
      ],
      highlight: false,
      cta: "Commencer Gratuitement",
      ctaPrimary: false,
    },
    {
      plan: "pro" as SubscriptionPlan,
      name: "Pro Boursier",
      badge: "Essentiel",
      price: billingCycle === "yearly" ? "5 000 FCFA" : "500 FCFA",
      period: billingCycle === "yearly" ? "/ an (remise)" : "/ mois",
      description: "Pour préparer activement et optimiser tous vos dossiers de bourses.",
      features: [
        "Tout du plan Gratuit",
        "Générateur IA de Lettres de Motivation (illimité)",
        "Scoreur & Optimiseur de CV ATS",
        "Suivi de Candidatures Kanban complet",
        "Alertes Deadlines prioritaires",
        "Support technique prioritaire",
      ],
      highlight: false,
      cta: "S'abonner au Plan Pro",
      ctaPrimary: true,
    },
    {
      plan: "max" as SubscriptionPlan,
      name: "Max Réussite 98%",
      badge: "Recommandé 98%",
      price: billingCycle === "yearly" ? "9 000 FCFA" : "1 000 FCFA",
      period: billingCycle === "yearly" ? "/ an (remise)" : "/ mois",
      description: "L'arsenal complet avec accompagnement mentor et simulation d'entretiens.",
      features: [
        "Tout du plan Pro",
        "Accès direct au Hub de Mentors & Boursiers",
        "Simulateur oral d'entretien de jury IA",
        "Export illimité des dossiers de candidature",
        "Relecture approfondie de vos pièces",
        "Garantie d'accompagnement jusqu'à l'admission",
      ],
      highlight: true,
      cta: "Débloquer le Plan Max 98%",
      ctaPrimary: true,
    },
  ];

  const handlePlanAction = (p: SubscriptionPlan) => {
    if (onSelectPlan) {
      onSelectPlan(p);
    } else if (onLaunchApp) {
      onLaunchApp();
    }
  };

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>DES TARIFS ACCESSIBLES À TOUS LES ÉTUDIANTS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Investissez dans votre <span className="gradient-text">Avenir International</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Des formules claires, sans frais cachés, payables instantanément par Mobile Money ou Carte
            Bancaire.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Facturation Mensuelle
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Facturation Annuelle</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all ${
                p.highlight
                  ? "border-amber-500/60 bg-gradient-to-b from-amber-500/10 via-card to-card shadow-glow scale-[1.03] ring-1 ring-amber-500/30"
                  : "border-border bg-card shadow-card hover:border-border/80"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm">
                    <Sparkles className="h-3 w-3" /> Recommandé 98%
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {p.badge}
                  </span>
                  <span className="font-display text-lg font-bold text-foreground">{p.name}</span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                    {p.price}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{p.period}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{p.description}</p>

                <div className="pt-4 border-t border-border/60 space-y-3 mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                    Ce qui est inclus :
                  </span>
                  <ul className="space-y-2.5">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <div className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePlanAction(p.plan)}
                className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  p.highlight
                    ? "bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 shadow-glow font-black hover:opacity-90"
                    : p.ctaPrimary
                      ? "bg-primary text-white shadow-glow hover:opacity-90"
                      : "border border-border bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods Trust Banner */}
        <div className="mt-14 rounded-2xl border border-border bg-card/60 p-6 max-w-3xl mx-auto text-center space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Moyens de Paiement Acceptés
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1 bg-secondary/80 px-3 py-1.5 rounded-xl border border-border">
              <Smartphone className="h-3.5 w-3.5 text-blue-400" /> Wave
            </span>
            <span className="flex items-center gap-1 bg-secondary/80 px-3 py-1.5 rounded-xl border border-border">
              <Smartphone className="h-3.5 w-3.5 text-orange-500" /> Orange Money
            </span>
            <span className="flex items-center gap-1 bg-secondary/80 px-3 py-1.5 rounded-xl border border-border">
              <Smartphone className="h-3.5 w-3.5 text-yellow-500" /> MTN MoMo
            </span>
            <span className="flex items-center gap-1 bg-secondary/80 px-3 py-1.5 rounded-xl border border-border">
              <Smartphone className="h-3.5 w-3.5 text-emerald-500" /> TMoney / Flooz
            </span>
            <span className="flex items-center gap-1 bg-secondary/80 px-3 py-1.5 rounded-xl border border-border">
              <CreditCard className="h-3.5 w-3.5 text-primary" /> Visa / Mastercard
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
