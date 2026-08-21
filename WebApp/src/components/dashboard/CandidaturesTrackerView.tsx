import React, { useState, useEffect } from "react";
import { ScholarshipApplication, ApplicationStatus, Bourse, DocumentType } from "@/lib/types";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  Award,
  XCircle,
  Trash2,
  CheckSquare,
  Square,
  FileText,
  Building,
  MapPin,
  Sparkles,
} from "lucide-react";

interface CandidaturesTrackerViewProps {
  userId: string;
  likedBourses: Bourse[];
  onOpenCoach?: () => void;
}

const STATUS_COLUMNS: {
  status: ApplicationStatus;
  label: string;
  color: string;
  badgeBg: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    status: "draft",
    label: "À Préparer",
    color: "text-muted-foreground",
    badgeBg: "bg-secondary border-border",
    icon: Clock,
  },
  {
    status: "in_progress",
    label: "En Rédaction",
    color: "text-blue-500",
    badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-500",
    icon: FileText,
  },
  {
    status: "submitted",
    label: "Dossier Déposé",
    color: "text-purple-500",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-500",
    icon: Send,
  },
  {
    status: "interview",
    label: "Entretien Jury",
    color: "text-amber-500",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-500",
    icon: UserCheck,
  },
  {
    status: "accepted",
    label: "Bourse Obtenue 🎉",
    color: "text-emerald-500",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-500 font-bold",
    icon: Award,
  },
];

const DEFAULT_CHECKLIST: { id: string; label: string; requiredDocType?: DocumentType }[] = [
  { id: "c1", label: "Certificat de Nationalité / CNI", requiredDocType: "Nationalité" },
  { id: "c2", label: "Passeport en cours de validité", requiredDocType: "Passeport" },
  { id: "c3", label: "Relevés de notes officiels & Bulletins", requiredDocType: "Relevé de notes" },
  { id: "c4", label: "Curriculum Vitae (Format International)", requiredDocType: "CV" },
  { id: "c5", label: "Lettre de Motivation personnalisée", requiredDocType: "Lettre de motivation" },
  { id: "c6", label: "Diplôme officiel ou Attestation de succès", requiredDocType: "Diplôme" },
];

export const CandidaturesTrackerView: React.FC<CandidaturesTrackerViewProps> = ({
  userId,
  likedBourses,
  onOpenCoach,
}) => {
  const storageKey = `boursio_applications_${userId || "guest"}`;
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedBourseId, setSelectedBourseId] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customUniv, setCustomUniv] = useState("");
  const [customDeadline, setCustomDeadline] = useState("");
  const [activeAppDetail, setActiveAppDetail] = useState<ScholarshipApplication | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setApplications(JSON.parse(raw));
      } else {
        // Initial sample application if user has liked bourses
        if (likedBourses.length > 0) {
          const sample: ScholarshipApplication = {
            id: `app_${Date.now()}`,
            userId: userId || "guest",
            bourseId: likedBourses[0].id,
            bourseTitre: likedBourses[0].titre,
            universite: likedBourses[0].universite || "Université d'Accueil",
            country: Array.isArray(likedBourses[0].pays_destination)
              ? likedBourses[0].pays_destination[0]
              : likedBourses[0].pays_destination || "International",
            deadline: likedBourses[0].deadline_raw || likedBourses[0].deadline || "Prochainement",
            status: "in_progress",
            checklist: DEFAULT_CHECKLIST.map((item, i) => ({
              ...item,
              completed: i < 2,
            })),
            notes: "Candidature en cours de constitution. Relire la lettre de motivation avec le Coach IA.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setApplications([sample]);
          localStorage.setItem(storageKey, JSON.stringify([sample]));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [userId, likedBourses]);

  const saveApplications = (updated: ScholarshipApplication[]) => {
    setApplications(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    let title = customTitle;
    let univ = customUniv;
    let deadline = customDeadline;
    let country = "International";

    if (selectedBourseId) {
      const b = likedBourses.find((item) => item.id === selectedBourseId);
      if (b) {
        title = b.titre;
        univ = b.universite || univ;
        deadline = b.deadline_raw || b.deadline || deadline;
        country = Array.isArray(b.pays_destination) ? b.pays_destination[0] : b.pays_destination || country;
      }
    }

    if (!title.trim()) {
      toast.error("Veuillez renseigner le nom de la bourse ciblée.");
      return;
    }

    const newApp: ScholarshipApplication = {
      id: `app_${Date.now()}`,
      userId: userId || "guest",
      bourseId: selectedBourseId || "custom",
      bourseTitre: title.trim(),
      universite: univ.trim() || undefined,
      country,
      deadline: deadline || "À définir",
      status: "draft",
      checklist: DEFAULT_CHECKLIST.map((item) => ({ ...item, completed: false })),
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveApplications([newApp, ...applications]);
    setShowNewModal(false);
    setSelectedBourseId("");
    setCustomTitle("");
    setCustomUniv("");
    setCustomDeadline("");
    toast.success(`Dossier "${newApp.bourseTitre}" ajouté à votre tableau de suivi !`);
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    const updated = applications.map((app) =>
      app.id === appId ? { ...app, status: newStatus, updatedAt: new Date().toISOString() } : app,
    );
    saveApplications(updated);
    if (activeAppDetail?.id === appId) {
      setActiveAppDetail({ ...activeAppDetail, status: newStatus });
    }
    toast.info("Statut de la candidature mis à jour.");
  };

  const handleToggleChecklistItem = (appId: string, itemId: string) => {
    const updated = applications.map((app) => {
      if (app.id !== appId) return app;
      const updatedChecklist = app.checklist.map((c) =>
        c.id === itemId ? { ...c, completed: !c.completed } : c,
      );
      return { ...app, checklist: updatedChecklist, updatedAt: new Date().toISOString() };
    });
    saveApplications(updated);
    if (activeAppDetail?.id === appId) {
      const activeUpdated = updated.find((a) => a.id === appId);
      if (activeUpdated) setActiveAppDetail(activeUpdated);
    }
  };

  const handleDeleteApplication = (appId: string, title: string) => {
    if (confirm(`Voulez-vous vraiment retirer la candidature "${title}" de votre suivi ?`)) {
      const updated = applications.filter((app) => app.id !== appId);
      saveApplications(updated);
      if (activeAppDetail?.id === appId) setActiveAppDetail(null);
      toast.info("Candidature retirée du suivi.");
    }
  };

  const getCompletionPercentage = (app: ScholarshipApplication) => {
    if (!app.checklist || app.checklist.length === 0) return 0;
    const completed = app.checklist.filter((c) => c.completed).length;
    return Math.round((completed / app.checklist.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary shrink-0">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Suivi Actif des Candidatures
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Pilotez chaque dossier étape par étape, complétez vos pièces obligatoires et maximisez vos chances de succès.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-glow hover:opacity-90 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" /> Nouvelle Candidature
          </button>
        </div>
      </div>

      {/* Applications Pipeline Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {STATUS_COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.status);
          const ColIcon = col.icon;

          return (
            <div
              key={col.status}
              className="rounded-2xl border border-border bg-secondary/30 p-3 space-y-3 min-h-[450px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <ColIcon className={`h-4 w-4 ${col.color}`} />
                  <span>{col.label}</span>
                </div>
                <span className="rounded-full bg-card px-2 py-0.5 text-[11px] font-bold text-muted-foreground border border-border">
                  {colApps.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3">
                {colApps.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl p-3">
                    Aucun dossier
                  </div>
                ) : (
                  colApps.map((app) => {
                    const percent = getCompletionPercentage(app);
                    return (
                      <div
                        key={app.id}
                        onClick={() => setActiveAppDetail(app)}
                        className="group relative cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 hover:shadow-md transition-all space-y-3"
                      >
                        <div className="space-y-1">
                          <h4 className="font-display text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {app.bourseTitre}
                          </h4>
                          {app.universite && (
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                              <Building className="h-3 w-3 shrink-0 text-primary" /> {app.universite}
                            </p>
                          )}
                        </div>

                        {/* Completion Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                            <span>Dossier : {percent}%</span>
                            <span>{app.checklist.filter((c) => c.completed).length}/{app.checklist.length} pièces</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                percent === 100 ? "bg-emerald-500" : "bg-primary"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        {/* Deadline badge & status */}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-primary" /> {app.deadline}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Application */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Ajouter un Dossier au Suivi
            </h3>

            <form onSubmit={handleCreateApplication} className="space-y-4">
              {likedBourses.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Choisir parmi vos bourses sauvegardées :
                  </label>
                  <select
                    value={selectedBourseId}
                    onChange={(e) => setSelectedBourseId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">-- Saisie libre ou autre bourse --</option>
                    {likedBourses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.titre} ({b.universite || "International"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Intitulé de la Bourse *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="ex: Bourse Eiffel 2026, Mastercard Foundation McGill..."
                  className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Établissement / Université
                  </label>
                  <input
                    type="text"
                    value={customUniv}
                    onChange={(e) => setCustomUniv(e.target.value)}
                    placeholder="ex: Sorbonne Université, Oxford..."
                    className="w-full rounded-xl border border-border bg-input px-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Date Limite de Dépôt
                  </label>
                  <input
                    type="text"
                    value={customDeadline}
                    onChange={(e) => setCustomDeadline(e.target.value)}
                    placeholder="ex: 15 Janvier 2026"
                    className="w-full rounded-xl border border-border bg-input px-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:opacity-90"
                >
                  Créer le Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Application Detail & Checklist */}
      {activeAppDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                  Dossier de Candidature
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mt-2">
                  {activeAppDetail.bourseTitre}
                </h3>
                {activeAppDetail.universite && (
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Building className="h-3.5 w-3.5 text-primary" /> {activeAppDetail.universite}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveAppDetail(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary"
              >
                ✕
              </button>
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Étape Actuelle du Dossier :
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_COLUMNS.map((col) => (
                  <button
                    key={col.status}
                    type="button"
                    onClick={() => handleStatusChange(activeAppDetail.id, col.status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      activeAppDetail.status === col.status
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist of Required Documents */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-emerald-500" /> Pièces Justificatives Obligatoires
                </h4>
                <span className="text-xs font-extrabold text-primary">
                  {getCompletionPercentage(activeAppDetail)}% Prêt
                </span>
              </div>

              <div className="space-y-2">
                {activeAppDetail.checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklistItem(activeAppDetail.id, item.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      item.completed
                        ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.completed ? (
                        <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${item.completed ? "line-through opacity-80" : ""}`}>
                        {item.label}
                      </span>
                    </div>

                    {item.requiredDocType && (
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-md font-semibold text-muted-foreground">
                        {item.requiredDocType}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => handleDeleteApplication(activeAppDetail.id, activeAppDetail.bourseTitre)}
                className="inline-flex items-center gap-1.5 text-xs text-destructive hover:underline"
              >
                <Trash2 className="h-4 w-4" /> Supprimer ce dossier
              </button>

              <div className="flex gap-2">
                {onOpenCoach && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAppDetail(null);
                      onOpenCoach();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Rédiger avec le Coach IA
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveAppDetail(null)}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-glow"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
