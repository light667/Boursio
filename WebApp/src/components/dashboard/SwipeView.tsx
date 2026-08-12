import React, { useState, useRef } from "react";
import { Bourse, StudentProfile } from "@/lib/types";
import { toggleLikeScholarship } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Heart,
  X,
  Sparkles,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  ExternalLink,
  RotateCcw,
  Percent,
  CheckCircle2,
  Bookmark,
  Award,
} from "lucide-react";

interface SwipeViewProps {
  bourses: Bourse[];
  studentProfile: StudentProfile | null;
  likedBourseIds: string[];
  userId: string;
  onUpdateLikes: (likedIds: string[]) => void;
  onSwitchToGrid?: () => void;
}

export const SwipeView: React.FC<SwipeViewProps> = ({
  bourses,
  studentProfile,
  likedBourseIds,
  userId,
  onUpdateLikes,
  onSwitchToGrid,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  const startPos = useRef({ x: 0, y: 0 });

  const remainingBourses = bourses.slice(currentIndex);
  const currentBourse = remainingBourses[0];

  // Touch and Mouse handlers for smooth swipe gesture
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    setSwipeDirection(null);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });

    if (dx > 60) setSwipeDirection("right");
    else if (dx < -60) setSwipeDirection("left");
    else setSwipeDirection(null);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 100) {
      handleSwipeRight();
    } else if (dragOffset.x < -100) {
      handleSwipeLeft();
    } else {
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    }
  };

  const handleSwipeLeft = () => {
    setSwipeDirection("left");
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    }, 250);
  };

  const handleSwipeRight = async () => {
    if (!currentBourse) return;
    setSwipeDirection("right");

    if (userId && !likedBourseIds.includes(currentBourse.id)) {
      const isLiked = await toggleLikeScholarship(userId, currentBourse.id);
      if (isLiked) {
        onUpdateLikes([...likedBourseIds, currentBourse.id]);
      }
    }

    toast.success(`" ${currentBourse.titre} " ajoutée à vos coups de cœur ! ❤️`);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    }, 250);
  };

  const handleResetStack = () => {
    setCurrentIndex(0);
    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
  };

  if (!currentBourse || remainingBourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto space-y-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <Sparkles className="h-10 w-10 animate-bounce" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Toutes les recommandations ont été parcourues !
        </h2>
        <p className="text-xs text-muted-foreground">
          Vous avez examiné les {bourses.length} bourses disponibles. Retrouvez vos bourses enregistrées dans l'onglet **Alertes** ou réinitialisez le Swipe.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetStack}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4" /> Recommencer le Swipe
          </button>
          {onSwitchToGrid && (
            <button
              type="button"
              onClick={onSwitchToGrid}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary"
            >
              Vue Liste / Grille
            </button>
          )}
        </div>
      </div>
    );
  }

  const matchScore = currentBourse.matchScore ?? 85;
  const isLiked = likedBourseIds.includes(currentBourse.id);

  // Dynamic card rotation & transform based on drag
  const rotation = dragOffset.x * 0.08;
  const opacity = 1 - Math.min(Math.abs(dragOffset.x) / 500, 0.4);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-foreground">
            Swipe Match & Apply ({currentIndex + 1} / {bourses.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToGrid && (
            <button
              type="button"
              onClick={onSwitchToGrid}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Afficher la Grille
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stacked Cards Area */}
      <div className="relative h-[530px] w-full touch-none select-none">
        {/* Next Card Preview in Background */}
        {remainingBourses[1] && (
          <div className="absolute inset-0 scale-[0.95] translate-y-3 opacity-60 rounded-3xl border border-border bg-card shadow-lg pointer-events-none p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Prochaine Bourse</span>
              <h3 className="text-lg font-bold text-foreground mt-1">{remainingBourses[1].titre}</h3>
            </div>
          </div>
        )}

        {/* Current Interactive Card */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotation}deg)`,
            opacity: opacity,
            transition: isDragging ? "none" : "transform 0.3s ease, opacity 0.3s ease",
          }}
          className={`absolute inset-0 rounded-3xl border-2 bg-card p-6 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing transition-colors ${
            swipeDirection === "right"
              ? "border-emerald-500/80 bg-emerald-500/5"
              : swipeDirection === "left"
              ? "border-rose-500/80 bg-rose-500/5"
              : "border-border"
          }`}
        >
          {/* Swipe Feedback Overlay Badges */}
          {swipeDirection === "right" && (
            <div className="absolute top-6 left-6 rounded-xl border-2 border-emerald-500 bg-emerald-500/20 px-4 py-2 font-display text-lg font-extrabold text-emerald-600 dark:text-emerald-400 rotate-[-12deg] z-20 shadow-md">
              AIME / MATCH ❤️
            </div>
          )}
          {swipeDirection === "left" && (
            <div className="absolute top-6 right-6 rounded-xl border-2 border-rose-500 bg-rose-500/20 px-4 py-2 font-display text-lg font-extrabold text-rose-600 dark:text-rose-400 rotate-[12deg] z-20 shadow-md">
              PASSER ❌
            </div>
          )}

          {/* Card Header Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                  <span>{matchScore}% Compatible</span>
                </div>
                {currentBourse.financement && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                    {currentBourse.financement}
                  </span>
                )}
              </div>

              {currentBourse.deadline && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Calendar className="h-3 w-3" />
                  <span>{currentBourse.deadline}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h2 className="font-display text-xl font-extrabold text-foreground leading-snug">
                {currentBourse.titre}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground font-medium">
                {currentBourse.universite && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-primary" /> {currentBourse.universite}
                  </span>
                )}
                {currentBourse.pays_destination && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />{" "}
                    {Array.isArray(currentBourse.pays_destination)
                      ? currentBourse.pays_destination.join(", ")
                      : currentBourse.pays_destination}
                  </span>
                )}
              </div>
            </div>

            {/* Description Snippet */}
            <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed bg-secondary/30 p-3 rounded-xl border border-border/50">
              {currentBourse.description || "Bourse d'étude internationale disponible pour les étudiants répondant aux critères d'excellence académique."}
            </p>

            {/* Key advantages chips */}
            {currentBourse.avantages && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-foreground">Avantages inclus :</span>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(currentBourse.avantages)
                    ? currentBrapheneAvantages(currentBourse.avantages)
                    : [currentBourse.avantages]
                  ).slice(0, 3).map((av, idx) => (
                    <span key={idx} className="rounded-lg bg-card px-2.5 py-1 text-[10px] font-semibold text-primary border border-primary/20">
                      ✨ {av}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Details & Apply link */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-mono">
              Source: {currentBourse.source || "Boursio Index"}
            </span>

            {currentBourse.url && (
              <a
                href={currentBourse.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Lien Officiel <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Swipe Action Buttons Bar */}
      <div className="flex items-center justify-center gap-6 pt-2">
        <button
          type="button"
          onClick={handleSwipeLeft}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-500/30 bg-card text-rose-500 shadow-md hover:bg-rose-500 hover:text-white transition-all hover:scale-110 active:scale-95"
          title="Passer (Swipe Gauche)"
        >
          <X className="h-7 w-7" />
        </button>

        <button
          type="button"
          onClick={handleResetStack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:bg-secondary hover:text-foreground transition-all"
          title="Réinitialiser"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleSwipeRight}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-glow hover:opacity-90 transition-all hover:scale-110 active:scale-95"
          title="Aimer (Swipe Droit)"
        >
          <Heart className="h-7 w-7 fill-white" />
        </button>
      </div>
    </div>
  );
};

function currentBrapheneAvantages(av: any): string[] {
  if (Array.isArray(av)) return av;
  if (typeof av === "string") {
    try {
      const parsed = JSON.parse(av);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [av];
    }
  }
  return [];
}
