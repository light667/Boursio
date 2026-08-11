import React from "react";
import { Users, Info, UserCheck } from "lucide-react";
import logo from "@/assets/logo.png";

export const MentoratView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Boursio" className="h-10 w-10 object-contain shrink-0" />
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Mentorat
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Mise en relation directe avec des mentors et anciens boursiers internationaux.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State - Zero Mentors Currently */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-card space-y-4 max-w-2xl mx-auto my-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary p-3">
          <UserCheck className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-foreground">
            Aucun mentor disponible pour le moment
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            Le programme de mentorat individuel est en cours d'activation. Les profils vérifiés d'anciens boursiers (Eiffel, Rhodes, Chevening, MEXT, Mastercard Foundation) seront bientôt disponibles pour des sessions d'accompagnement direct.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-secondary/50 p-4 text-left text-xs text-muted-foreground space-y-2 w-full max-w-md">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Info className="h-4 w-4 text-primary shrink-0" /> Que fera votre mentor ?
          </div>
          <div>• Relecture approfondie de vos lettres de motivation et CV</div>
          <div>• Conseils pour les démarches administratives et de visa</div>
          <div>• Simulation d'entretien de sélection avant les jurys officiels</div>
        </div>
      </div>
    </div>
  );
};
