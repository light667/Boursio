import React from "react";
import {
  Target,
  Sparkles,
  Bot,
  FileCheck,
  LayoutDashboard,
  Users,
  Award,
  Zap,
  ArrowRight,
} from "lucide-react";

export const Features: React.FC = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Zap className="h-3.5 w-3.5" />
            <span>TECHNOLOGIE & EXPÉRIENCE DE POINTE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Tout ce qu'il Faut pour Décrocher votre <span className="gradient-text">Financement</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Une suite complète d'outils intelligents conçue pour éliminer le stress des recherches et
            maximiser vos chances d'admission internationale.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          {/* Bento Item 1: AI Matcher (Large 7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                Matching Algorithmique Ultra-Ciblé
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Fini les heures passées à chercher au hasard. Notre algorithme croise votre moyenne,
                votre filière, votre nationalité et votre niveau d'études pour ne vous afficher que les
                bourses où vos chances d'admission sont réelles.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-primary/20 bg-secondary/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Calcul automatique du Match Score :</span>
                <span className="text-primary font-black">98% Pertinence</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-emerald-400 w-[98%]" />
              </div>
            </div>
          </div>

          {/* Bento Item 2: AI Motivation Letter Studio (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Générateur de Lettres d'Élite
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Une lettre de motivation percutante rédigée en 30 secondes selon les directives
                académiques strictes des universités internationales et comités de bourses.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-border/80 bg-secondary/30 p-3 text-[11px] text-muted-foreground italic">
              "Bénéficier de cette bourse me permettra de me consacrer pleinement à la recherche..."
            </div>
          </div>

          {/* Bento Item 3: Application Kanban Tracker (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Suivi Actif Kanban
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pilotez chaque candidature étape par étape : pièces obligatoires, calendrier de clôture
                et relances automatiques.
              </p>
            </div>
          </div>

          {/* Bento Item 4: Verified Mentorship (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Mentorat d'Alumni
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Échangez en direct avec des lauréats des bourses Eiffel, Chevening et Mastercard pour
                des simulations d'oraux et relectures de dossiers.
              </p>
            </div>
          </div>

          {/* Bento Item 5: Security & Document Locker (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Coffre-Fort Sécurisé
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stockez en toute sécurité vos passeports, actes de nationalité, relevés de notes et
                diplômes pour postuler en 1 clic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
