import React, { useState, useMemo } from "react";
import { Bourse, StudentProfile } from "@/lib/types";
import { rankBoursesForStudent } from "@/lib/matchingEngine";
import { toggleLikeScholarship } from "@/lib/supabase";
import {
  Sparkles,
  Heart,
  ExternalLink,
  Bot,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  MapPin,
  X,
  Info,
  ChevronRight,
  Crown,
} from "lucide-react";

interface RecommandationsViewProps {
  bourses: Bourse[];
  studentProfile: StudentProfile | null;
  likedBourseIds: string[];
  userId: string;
  onUpdateLikes: (likedIds: string[]) => void;
  onOpenProfileSetup: () => void;
}

export const RecommandationsView: React.FC<RecommandationsViewProps> = ({
  bourses,
  studentProfile,
  likedBourseIds,
  userId,
  onUpdateLikes,
  onOpenProfileSetup,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [fundingFilter, setFundingFilter] = useState<string>("ALL");
  const [selectedBourse, setSelectedBourse] = useState<Bourse | null>(null);
  const [showProModal, setShowProModal] = useState(false);
  const [proModalBourseTitle, setProModalBourseTitle] = useState("");

  // Rank scholarships with scoring engine
  const rankedBourses = useMemo(() => {
    return rankBoursesForStudent(bourses, studentProfile);
  }, [bourses, studentProfile]);

  // Filtered scholarships
  const filteredBourses = useMemo(() => {
    return rankedBourses.filter((b) => {
      // Search
      const matchesQuery =
        !searchQuery ||
        b.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.universite && b.universite.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Array.isArray(b.domaines) &&
          b.domaines.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())));

      // Level
      const matchesLevel =
        levelFilter === "ALL" ||
        (Array.isArray(b.niveau_etude) &&
          b.niveau_etude.some((l) => l.toLowerCase().includes(levelFilter.toLowerCase())));

      // Funding
      const matchesFunding =
        fundingFilter === "ALL" ||
        (b.financement && b.financement.toUpperCase() === fundingFilter);

      return matchesQuery && matchesLevel && matchesFunding;
    });
  }, [rankedBourses, searchQuery, levelFilter, fundingFilter]);

  const handleToggleLike = async (bourseId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowLiked = await toggleLikeScholarship(userId, bourseId);
    let newLikes: string[];
    if (isNowLiked) {
      newLikes = [...likedBourseIds, bourseId];
    } else {
      newLikes = likedBourseIds.filter((id) => id !== bourseId);
    }
    onUpdateLikes(newLikes);
  };

  const handleApplyWithAI = (bourseTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProModalBourseTitle(bourseTitle);
    setShowProModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Match Summary */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-secondary/40 to-primary/10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Algorithme de Scoring IA Actif
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Vos Recommandations de Bourses
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {studentProfile ? (
                <>
                  Comparaison effectuée pour{" "}
                  <span className="font-medium text-foreground">{studentProfile.fullName}</span> (
                  {studentProfile.studyLevel} en {studentProfile.studyField})
                </>
              ) : (
                "Bourses triées par pertinence générale. Complétez votre profil pour un matching personnalisé."
              )}
            </p>
          </div>

          {!studentProfile && (
            <button
              onClick={onOpenProfileSetup}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground shadow-glow hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" /> Configurer mon Profil Étudiant
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une bourse, université, domaine..."
            className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-4 w-4" /> Filtres:
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-xl border border-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">Tous les Niveaux</option>
            <option value="licence">Licence</option>
            <option value="master">Master</option>
            <option value="doctorat">Doctorat</option>
            <option value="recherche">Recherche</option>
          </select>

          <select
            value={fundingFilter}
            onChange={(e) => setFundingFilter(e.target.value)}
            className="rounded-xl border border-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">Tous les Financements</option>
            <option value="TOTAL">Totalement Financée (TOTAL)</option>
            <option value="PARTIEL">Partiellement Financée (PARTIEL)</option>
          </select>
        </div>
      </div>

      {/* Results Count & Match Status */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filteredBourses.length} bourses trouvées et ordonnées par pertinence</span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Algorithme à jour
        </span>
      </div>

      {/* Scholarships Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {filteredBourses.map((bourse) => {
          const isLiked = likedBourseIds.includes(bourse.id);
          const matchScore = bourse.matchScore || 50;

          return (
            <div
              key={bourse.id}
              onClick={() => setSelectedBourse(bourse)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/50 hover:shadow-glow cursor-pointer"
            >
              <div>
                {/* Header: Score Badge & Actions */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  {/* Match Percentage Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      matchScore >= 80
                        ? "bg-accent/15 text-accent border border-accent/30"
                        : matchScore >= 60
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{matchScore}% Match</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Like / Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(bourse.id, e)}
                      title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris (Notifications)"}
                      className={`rounded-full p-2 transition-transform hover:scale-110 ${
                        isLiked
                          ? "bg-rose-500/20 text-rose-500 border border-rose-500/40"
                          : "bg-secondary/80 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-500" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Title & University */}
                <h3 className="font-display text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {bourse.titre}
                </h3>

                {bourse.universite && (
                  <p className="mt-1 text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" /> {bourse.universite}
                  </p>
                )}

                {/* Badges / Domains & Levels */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {bourse.financement === "TOTAL" && (
                    <span className="rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                      Totalement Financée
                    </span>
                  )}
                  {bourse.africains_eligibles && (
                    <span className="rounded-md bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/30">
                      Afrique Éligible
                    </span>
                  )}
                  {Array.isArray(bourse.niveau_etude) &&
                    bourse.niveau_etude.slice(0, 2).map((lvl) => (
                      <span
                        key={lvl}
                        className="rounded-md bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-foreground uppercase"
                      >
                        {lvl}
                      </span>
                    ))}
                </div>

                {/* Description Snippet */}
                <p className="mt-3 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {bourse.description}
                </p>

                {/* Match Highlight Reasons */}
                {bourse.matchReasons && bourse.matchReasons.length > 0 && (
                  <div className="mt-4 rounded-xl border border-primary/10 bg-primary/5 p-2.5 space-y-1">
                    {bourse.matchReasons.slice(0, 2).map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-accent">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Footer & Action Buttons */}
              <div className="mt-6 border-t border-border/60 pt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {bourse.deadline_raw || bourse.deadline || "Date non spécifiée"}
                  </span>
                  {bourse.montant_bourse && (
                    <span className="font-semibold text-accent flex items-center gap-0.5">
                      <DollarSign className="h-3.5 w-3.5" /> {bourse.montant_bourse}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Direct Apply Button */}
                  <a
                    href={bourse.lien_candidature || bourse.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Postuler <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  {/* AI Agent Apply Button with PRO badge */}
                  <button
                    type="button"
                    onClick={(e) => handleApplyWithAI(bourse.titre, e)}
                    className="relative group/pro inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary/90 to-blue-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all overflow-hidden"
                  >
                    <Bot className="h-3.5 w-3.5 text-accent" /> Postuler avec l'Agent IA
                    {/* PRO Badge */}
                    <span className="absolute -top-1 -right-1 flex h-5 items-center gap-0.5 rounded-bl-lg rounded-tr-xl bg-gradient-to-r from-amber-400 to-amber-600 px-1.5 text-[9px] font-extrabold uppercase text-slate-950 shadow-sm">
                      <Crown className="h-2.5 w-2.5" /> PRO
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scholarship Detail Drawer Modal */}
      {selectedBourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-primary/20 bg-card p-6 shadow-2xl sm:p-8 space-y-6">
            <button
              onClick={() => setSelectedBourse(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent border border-accent/30">
                  {selectedBourse.matchScore}% Correspondance
                </span>
                {selectedBourse.financement === "TOTAL" && (
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    Bourse Totale
                  </span>
                )}
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {selectedBourse.titre}
              </h2>
              {selectedBourse.universite && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" /> {selectedBourse.universite}
                </p>
              )}
            </div>

            {/* Coverage & Perks */}
            {Array.isArray(selectedBourse.couverture) && selectedBourse.couverture.length > 0 && (
              <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-accent" /> Couverture Financière & Avantages
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {selectedBourse.couverture.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Criteria */}
            {Array.isArray(selectedBourse.criteres) && selectedBourse.criteres.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Critères d'Éligibilité
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {selectedBourse.criteres.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Description Complète
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedBourse.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => handleApplyWithAI(selectedBourse.titre)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-xs font-bold text-slate-950 shadow-glow"
              >
                <Crown className="h-4 w-4" /> Postuler avec Agent IA (Mode Pro)
              </button>

              <a
                href={selectedBourse.lien_candidature || selectedBourse.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Accéder au Site Officiel <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PRO Badge Modal (Disponible Bientôt) */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/30 bg-card p-6 text-center shadow-2xl sm:p-8 space-y-4">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-glow">
              <Crown className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                Option Pro Boursio
              </span>
              <h3 className="font-display text-xl font-bold text-foreground">
                Disponible très bientôt !
              </h3>
              {proModalBourseTitle && (
                <p className="text-xs font-medium text-primary line-clamp-1">
                  "{proModalBourseTitle}"
                </p>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              L'agent IA autonome de candidature automatisée soumettra vos formulaires, rédigera vos essais et vérifiera vos pièces justificatives automatiquement pour chaque bourse.
            </p>

            <div className="rounded-xl border border-border bg-secondary/50 p-3 text-left text-xs space-y-1.5 text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Bot className="h-4 w-4 text-accent" /> Fonctionnalités Pro en préparation :
              </div>
              <div>• Soumission automatisée des dossiers</div>
              <div>• Génération dynamique des pièces manquantes</div>
              <div>• Suivi direct par agent virtuel 24/7</div>
            </div>

            <button
              type="button"
              onClick={() => setShowProModal(false)}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 py-3 text-sm font-semibold text-white shadow-glow hover:opacity-90"
            >
              Compris, j'attends la version Pro !
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
