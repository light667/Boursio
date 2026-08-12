import { Check, Globe, Zap, Shield } from "lucide-react";

const POINTS = [
  {
    icon: Globe,
    title: "Pensé pour l'Afrique",
    desc: "Optimisé pour les connexions lentes, conçu pour les étudiants du continent.",
  },
  {
    icon: Zap,
    title: "Rapide et fluide",
    desc: "Une expérience premium, sans friction, sur mobile comme sur desktop.",
  },
  {
    icon: Shield,
    title: "Données protégées",
    desc: "Vos informations restent confidentielles et sécurisées à chaque étape.",
  },
] as const;

const BENEFITS = [
  "Bourses internationales en un clic",
  "Coaching IA personnalisé",
  "Accompagnement de A à Z",
] as const;

export function Why() {
  return (
    <section id="why" className="px-4 py-24 bg-hero-glow">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-sm text-secondary font-medium mb-3 uppercase tracking-wider">
            Pourquoi Boursio
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Une mission claire :{" "}
            <span className="gradient-text">démocratiser l&apos;accès aux bourses</span>
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Chaque année, des milliers d&apos;étudiants brillants passent à côté de bourses faute
            d&apos;information ciblée ou d&apos;outils de candidature adaptés. Boursio change
            définitivement la donne.
          </p>
          <ul className="space-y-3">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {POINTS.map((point) => (
            <div
              key={point.title}
              className="glass rounded-2xl p-6 flex gap-4 hover:translate-x-1 transition"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                <point.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
