import React, { useState, useMemo } from "react";
import { getAllBourses } from "@/lib/boursesData";
import { Bourse } from "@/lib/types";
import { Search, MapPin, Calendar, DollarSign, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface ScholarshipExplorerDemoProps {
  onLaunchApp?: () => void;
}

export const ScholarshipExplorerDemo: React.FC<ScholarshipExplorerDemoProps> = ({ onLaunchApp }) => {
  const [filterRegion, setFilterRegion] = useState("ALL");
  const [query, setQuery] = useState("");

  const allBourses = useMemo(() => getAllBourses(), []);

  const filtered = useMemo(() => {
    return allBourses
      .filter((b) => {
        const dest = Array.isArray(b.pays_destination)
          ? b.pays_destination.join(" ")
          : b.pays_destination || "";
        const domains = Array.isArray(b.domaines) ? b.domaines.join(" ") : b.domaines || "";
        const univ = b.universite || "";

        const matchQuery =
          !query ||
          b.titre.toLowerCase().includes(query.toLowerCase()) ||
          univ.toLowerCase().includes(query.toLowerCase()) ||
          dest.toLowerCase().includes(query.toLowerCase()) ||
          domains.toLowerCase().includes(query.toLowerCase());

        const matchRegion =
          filterRegion === "ALL" ||
          (filterRegion === "FR" && dest.toLowerCase().includes("france")) ||
          (filterRegion === "CA" && dest.toLowerCase().includes("canada")) ||
          (filterRegion === "UK" && (dest.toLowerCase().includes("royaume") || dest.toLowerCase().includes("uk"))) ||
          (filterRegion === "ASIA" && (dest.toLowerCase().includes("japon") || dest.toLowerCase().includes("chine") || dest.toLowerCase().includes("corée")));

        return matchQuery && matchRegion;
      })
      .slice(0, 6);
  }, [allBourses, query, filterRegion]);

  return (
    <section id="scholarships" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>EXPLORATEUR EN TEMPS RÉEL</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Plus de <span className="gradient-text">500 Bourses Officielles</span> Vérifiées
            </h2>
            
          </div>

          <button
            type="button"
            onClick={onLaunchApp}
            className="inline-flex items-center gap-2 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border px-5 py-3 text-xs font-bold text-foreground transition-all shrink-0"
          >
            <span>Voir tout le catalogue ({allBourses.length})</span>
            <ArrowRight className="h-4 w-4 text-primary" />
          </button>
        </div>

        {/* Filters and search bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 mb-8 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrer par bourse, université, pays, filière..."
              className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "Toutes les destinations" },
              { id: "FR", label: "France 🇫🇷" },
              { id: "CA", label: "Canada 🇨🇦" },
              { id: "UK", label: "UK 🇬🇧" },
              { id: "ASIA", label: "Asie 🇯🇵" },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterRegion(btn.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  filterRegion === btn.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => {
            const destLabel = Array.isArray(b.pays_destination)
              ? b.pays_destination.join(", ")
              : b.pays_destination || "International";

            const levelLabel = Array.isArray(b.niveau_etude)
              ? b.niveau_etude.join(", ")
              : b.niveau_etude || "Tous niveaux";

            return (
              <div
                key={b.id}
                onClick={onLaunchApp}
                className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/50 hover:shadow-glow transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {b.financement === "TOTAL" ? "100% Totalement Financée" : "Financement Partiel"}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-black text-primary">
                      Officielle
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {b.titre}
                  </h3>

                  <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      {b.universite || "Établissements partenaires"} • {destLabel}
                    </span>
                  </p>

                  <div className="mt-4 rounded-2xl border border-border/80 bg-secondary/50 p-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Montant :
                      </span>
                      <span className="font-bold text-foreground text-[11px] text-right truncate max-w-[170px]">
                        {b.montant_bourse || "Allocation complète"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" /> Clôture :
                      </span>
                      <span className="font-semibold text-foreground text-[11px]">
                        {b.deadline || "Consulter le calendrier"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Niveaux : <strong className="text-foreground">{levelLabel}</strong>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    Postuler via IA <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
