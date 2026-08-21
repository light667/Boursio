import React from "react";
import { Award, CheckCircle2, Quote, Sparkles, Building, GraduationCap, ShieldCheck } from "lucide-react";

const SCHOLARSHIP_FOCUS = [
  {
    program: "Bourse d'Excellence Eiffel (Ministère des Affaires Étrangères)",
    destination: "Universités & Grandes Écoles (France 🇫🇷)",
    amount: "1 400 € / mois + Prise en charge voyage & protection sociale",
    criteria: "Moins de 25 ans (Master) ou 30 ans (Doctorat), dossier déposé via un établissement français.",
    advice: "La note de cadrage Eiffel exige un projet professionnel directement relié au développement du pays d'origine.",
  },
  {
    program: "Bourse Mastercard Foundation Scholars",
    destination: "Sciences Po Paris, McGill University, Cambridge",
    amount: "100% Frais de scolarité + Allocation mensuelle + Ordinateur",
    criteria: "Excellence académique, engagement communautaire et potentiel de leadership pour l'Afrique.",
    advice: "Les essais de leadership et la preuve d'impact social sont prépondérants dans la sélection finale.",
  },
  {
    program: "Chevening Scholarships (Gouvernement Britannique)",
    destination: "Universités au Royaume-Uni 🇬🇧 (Oxford, LSE, Imperial)",
    amount: "Financement intégral des frais universitaires + Allocation de subsistance",
    criteria: "Diplôme de premier cycle, 2 ans d'expérience professionnelle ou associative, projet clair.",
    advice: "La cohérence entre les 4 essais obligatoires et l'entretien à l'ambassade détermine l'attribution.",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>DIRECTIVES OFFICIELLES & PROGRAMMES MAJEURS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Critères & Exigences des <span className="gradient-text">Grands Programmes</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Boursio indexe et modélise les grilles d'évaluation officielles pour garantir la
            conformité absolue de vos dossiers.
          </p>
        </div>

        {/* Focus Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {SCHOLARSHIP_FOCUS.map((p, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card hover:border-primary/40 hover:shadow-glow transition-all"
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-bold text-foreground line-clamp-2">
                    {p.program}
                  </div>
                </div>

                <div className="text-xs font-medium text-primary flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 shrink-0" /> {p.destination}
                </div>

                {/* Amount */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs space-y-1">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">Financement Officiel :</div>
                  <div className="text-[11px] text-foreground">{p.amount}</div>
                </div>

                {/* Criteria */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-foreground text-[11px] uppercase tracking-wider">
                    Critères Clés :
                  </span>
                  <p className="text-muted-foreground text-xs leading-relaxed">{p.criteria}</p>
                </div>
              </div>

              {/* Expert Advice Note */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-[11px] text-muted-foreground italic bg-secondary/50 p-3 rounded-xl border border-border/60">
                  💡 <strong>Point d'attention IA :</strong> {p.advice}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Verified Mentor Focus Card */}
        <div className="mt-12 rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/ben_image.JPG"
              alt="DOH Kodzo Benjamin"
              className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/40 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display text-base font-bold text-foreground">
                  DOH Kodzo Benjamin
                </h4>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Mentor Référent Campus France
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ingénieur en Génie Mécanique • Spécialiste des candidatures universitaires et écoles d'ingénieurs en France.
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-secondary/80 px-4 py-2.5 rounded-xl border border-border shrink-0">
            Sessions visio disponibles dans l'application
          </div>
        </div>
      </div>
    </section>
  );
};
