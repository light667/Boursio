import { Search, FileText, Bell, BarChart3, MessageSquare, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Matching IA de bourses",
    description:
      "Notre algorithme analyse votre profil académique et vous propose les bourses avec les meilleures chances de succès — parmi plus de 500 programmes internationaux.",
    accent: "primary",
  },
  {
    icon: FileText,
    title: "Rédaction assistée",
    description:
      "Générez des lettres de motivation, essays et personal statements percutants. L'IA adapte le ton et le contenu à chaque programme et université.",
    accent: "accent",
  },
  {
    icon: Bell,
    title: "Alertes personnalisées",
    description:
      "Ne ratez plus aucune deadline. Recevez des notifications ciblées sur les nouvelles bourses correspondant à votre profil et les dates limites importantes.",
    accent: "primary",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord complet",
    description:
      "Suivez l'avancement de chaque candidature en temps réel. Visualisez vos statistiques, vos points forts et les axes d'amélioration de votre dossier.",
    accent: "accent",
  },
  {
    icon: MessageSquare,
    title: "Coaching IA 24/7",
    description:
      "Posez vos questions à tout moment. L'assistant IA vous guide sur les exigences de chaque bourse, la rédaction, les entretiens et les démarches administratives.",
    accent: "primary",
  },
  {
    icon: Zap,
    title: "Candidature rapide",
    description:
      "Pré-remplissez automatiquement vos formulaires grâce à votre profil centralisé. Ce qui prenait des heures ne prend plus que quelques minutes.",
    accent: "accent",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">
            Fonctionnalités
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground max-w-2xl">
            Tout ce dont vous avez besoin
            <span className="gradient-text"> pour décrocher votre bourse.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl text-base leading-relaxed">
            Une plateforme unique qui remplace des heures de recherche, de rédaction et de suivi
            par une expérience fluide et intelligente.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isAccent = feature.accent === "accent";
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/25 transition-all duration-200 hover:shadow-card border-glow-hover"
              >
                {/* Icon */}
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${
                    isAccent
                      ? "bg-accent/10 text-accent"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <h3 className="font-display font-semibold text-base text-foreground mb-2 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}