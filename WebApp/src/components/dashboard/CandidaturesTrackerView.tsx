import React, { useState, useEffect } from "react";
import { ScholarshipApplication, ApplicationStatus, Bourse, DocumentType } from "@/lib/types";
import { toast } from "sonner";
import { useLang } from "@/hooks/use-lang";
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

export const CandidaturesTrackerView: React.FC<CandidaturesTrackerViewProps> = ({
  userId,
  likedBourses,
  onOpenCoach,
}) => {
  const { lang, t } = useLang();
  const tc = t.dashboard[lang].candidatures;

  const storageKey = `boursio_applications_${userId || "guest"}`;
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedBourseId, setSelectedBourseId] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customUniv, setCustomUniv] = useState("");
  const [customDeadline, setCustomDeadline] = useState("");
  const [activeAppDetail, setActiveAppDetail] = useState<ScholarshipApplication | null>(null);

  const STATUS_COLUMNS: {
    status: ApplicationStatus;
    label: string;
    color: string;
    badgeBg: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      status: "draft",
      label: tc.columns.toPrepare,
      color: "text-muted-foreground",
      badgeBg: "bg-secondary border-border",
      icon: Clock,
    },
    {
      status: "in_progress",
      label: tc.columns.drafting,
      color: "text-blue-500",
      badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-500",
      icon: FileText,
    },
    {
      status: "submitted",
      label: tc.columns.submitted,
      color: "text-purple-500",
      badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-500",
      icon: Send,
    },
    {
      status: "interview",
      label: tc.columns.interview,
      color: "text-amber-500",
      badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-500",
      icon: UserCheck,
    },
    {
      status: "accepted",
      label: tc.columns.accepted,
      color: "text-emerald-500",
      badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-500 font-bold",
      icon: Award,
    },
  ];

  const DEFAULT_CHECKLIST: { id: string; label: string; requiredDocType?: DocumentType }[] = [
    { id: "c1", label: lang === "fr" ? "Certificat de Nationalité / CNI" : "Nationality Certificate / ID Card", requiredDocType: "Nationalité" },
    { id: "c2", label: lang === "fr" ? "Passeport en cours de validité" : "Valid Passport", requiredDocType: "Passeport" },
    { id: "c3", label: lang === "fr" ? "Relevés de notes officiels & Bulletins" : "Official Academic Transcripts", requiredDocType: "Relevé de notes" },
    { id: "c4", label: lang === "fr" ? "Curriculum Vitae (Format International)" : "Curriculum Vitae (International ATS Format)", requiredDocType: "CV" },
    { id: "c5", label: lang === "fr" ? "Lettre de Motivation personnalisée" : "Personalized Motivation Letter", requiredDocType: "Lettre de motivation" },
    { id: "c6", label: lang === "fr" ? "Diplôme officiel ou Attestation de succès" : "Official Degree or Completion Certificate", requiredDocType: "Diplôme" },
  ];

  // Load from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setApplications(JSON.parse(raw));
      } else {
        // Initial state with Eiffel if liked, or empty clean state
        const initial: ScholarshipApplication[] = [
          {
            id: "app_1",
            userId: userId || "guest",
            bourseId: "eiffel-2026",
            bourseTitre: "Bourse d'Excellence Eiffel (Campus France)",
            universite: "Sorbonne Université & Grandes Écoles",
            country: "France 🇫🇷",
            status: "in_progress",
            deadline: "Janvier 2026",
            notes: "Vérifier la convention de l'établissement d'accueil avant le dépôt.",
            checklist: DEFAULT_CHECKLIST.map((c) => ({
              ...c,
              completed: c.id === "c1" || c.id === "c2" || c.id === "c4",
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setApplications(initial);
        localStorage.setItem(storageKey, JSON.stringify(initial));
      }
    } catch {
      setApplications([]);
    }
  }, [storageKey, userId]);

  const saveApplications = (updated: ScholarshipApplication[]) => {
    setApplications(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving applications:", err);
    }
  };

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    let title = customTitle.trim();
    let univ = customUniv.trim();
    let deadline = customDeadline.trim();
    let bourseId = "custom";
    let country = "International";

    if (selectedBourseId) {
      const b = likedBourses.find((item) => item.id === selectedBourseId);
      if (b) {
        title = b.titre;
        univ = b.universite || "";
        deadline = b.deadline || "";
        bourseId = b.id;
        country = Array.isArray(b.pays_destination)
          ? b.pays_destination.join(", ")
          : b.pays_destination || "International";
      }
    }

    if (!title) {
      toast.error(lang === "fr" ? "Veuillez renseigner le nom de la bourse." : "Please enter scholarship name.");
      return;
    }

    const newApp: ScholarshipApplication = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: userId || "guest",
      bourseId,
      bourseTitre: title,
      universite: univ,
      country,
      status: "draft",
      deadline: deadline || "2026",
      checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c, completed: false })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newApp, ...applications];
    saveApplications(updated);
    setShowNewModal(false);
    setSelectedBourseId("");
    setCustomTitle("");
    setCustomUniv("");
    setCustomDeadline("");
    toast.success(lang === "fr" ? "Candidature ajoutée à votre suivi !" : "Application added to tracker!");
  };

  const handleUpdateStatus = (appId: string, newStatus: ApplicationStatus) => {
    const updated = applications.map((a) =>
      a.id === appId
        ? { ...a, status: newStatus, updatedAt: new Date().toISOString() }
        : a,
    );
    saveApplications(updated);
    if (activeAppDetail?.id === appId) {
      setActiveAppDetail({ ...activeAppDetail, status: newStatus });
    }
    toast.success(lang === "fr" ? "Statut mis à jour !" : "Status updated!");
  };

  const handleToggleChecklist = (appId: string, checkId: string) => {
    const updated = applications.map((a) => {
      if (a.id !== appId) return a;
      const updatedChecklist = a.checklist.map((c) =>
        c.id === checkId ? { ...c, completed: !c.completed } : c,
      );
      return { ...a, checklist: updatedChecklist, updatedAt: new Date().toISOString() };
    });
    saveApplications(updated);

    if (activeAppDetail?.id === appId) {
      const curr = updated.find((a) => a.id === appId);
      if (curr) setActiveAppDetail(curr);
    }
  };

  const handleDeleteApplication = (appId: string) => {
    const updated = applications.filter((a) => a.id !== appId);
    saveApplications(updated);
    setActiveAppDetail(null);
    toast.success(lang === "fr" ? "Candidature retirée du suivi." : "Application removed from tracker.");
  };

  const getCompletionPercentage = (app: ScholarshipApplication) => {
    if (!app.checklist || app.checklist.length === 0) return 0;
    const completedCount = app.checklist.filter((c) => c.completed).length;
    return Math.round((completedCount / app.checklist.length) * 100);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>{tc.title}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {tc.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {tc.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-glow hover:opacity-90 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" /> {tc.addApplication}
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
                    {tc.emptyState}
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
                            <span>{lang === "fr" ? "Dossier :" : "Progress:"} {percent}%</span>
                            <span>{app.checklist.filter((c) => c.completed).length}/{app.checklist.length} {lang === "fr" ? "pièces" : "files"}</span>
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

                        <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-amber-500" /> {app.deadline}
                          </span>
                          <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            {lang === "fr" ? "Gérer →" : "Manage →"}
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

      {/* New Application Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-foreground">
                {tc.modal.addTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-4">
              {likedBourses.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {tc.modal.selectScholarship}
                  </label>
                  <select
                    value={selectedBourseId}
                    onChange={(e) => {
                      setSelectedBourseId(e.target.value);
                      if (e.target.value) {
                        const b = likedBourses.find((item) => item.id === e.target.value);
                        if (b) {
                          setCustomTitle(b.titre);
                          setCustomUniv(b.universite || "");
                          setCustomDeadline(b.deadline || "");
                        }
                      }
                    }}
                    className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {likedBourses.map((b) => {
                      const dest = Array.isArray(b.pays_destination) ? b.pays_destination[0] : b.pays_destination;
                      return (
                        <option key={b.id} value={b.id}>
                          {b.titre} ({b.universite || dest || "International"})
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  {tc.modal.manualScholarship}
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Ex: Bourse Chevening UK 2026"
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {tc.modal.targetUniv}
                  </label>
                  <input
                    type="text"
                    value={customUniv}
                    onChange={(e) => setCustomUniv(e.target.value)}
                    placeholder="Ex: Oxford University"
                    className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {tc.modal.deadline}
                  </label>
                  <input
                    type="text"
                    value={customDeadline}
                    onChange={(e) => setCustomDeadline(e.target.value)}
                    placeholder="Ex: 15 Novembre 2025"
                    className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {tc.modal.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:opacity-90"
                >
                  {tc.modal.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Detail & Checklist Drawer Modal */}
      {activeAppDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="space-y-1">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  {lang === "fr" ? "Gestion du dossier" : "Application Management"}
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {activeAppDetail.bourseTitre}
                </h3>
                {activeAppDetail.universite && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-primary" /> {activeAppDetail.universite}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveAppDetail(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Change Status Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                {lang === "fr" ? "Étape actuelle dans le pipeline :" : "Current stage in pipeline:"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {STATUS_COLUMNS.map((col) => {
                  const isCurrent = activeAppDetail.status === col.status;
                  return (
                    <button
                      key={col.status}
                      type="button"
                      onClick={() => handleUpdateStatus(activeAppDetail.id, col.status)}
                      className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                        isCurrent
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {col.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checklist of Mandatory Documents */}
            <div className="space-y-3 rounded-2xl border border-border bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {lang === "fr" ? "Checklist des Pièces Obligatoires" : "Mandatory Documents Checklist"}
                </h4>
                <span className="text-xs font-bold text-primary">
                  {getCompletionPercentage(activeAppDetail)}% {lang === "fr" ? "complété" : "completed"}
                </span>
              </div>

              <div className="space-y-2">
                {activeAppDetail.checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(activeAppDetail.id, item.id)}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                      item.completed
                        ? "border-emerald-500/30 bg-emerald-500/10 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
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
                      <span className="rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground shrink-0 border border-border">
                        {item.requiredDocType}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Help Chip */}
            {onOpenCoach && (
              <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>{lang === "fr" ? "Besoin d'aide pour rédiger ou relire votre dossier ?" : "Need help writing or reviewing your application?"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAppDetail(null);
                    onOpenCoach();
                  }}
                  className="rounded-xl bg-primary px-3 py-1.5 font-bold text-white shadow-sm hover:opacity-90 shrink-0"
                >
                  {lang === "fr" ? "Ouvrir le Coach IA" : "Open AI Coach"}
                </button>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => handleDeleteApplication(activeAppDetail.id)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> {lang === "fr" ? "Supprimer de mon suivi" : "Delete application"}
              </button>

              <button
                type="button"
                onClick={() => setActiveAppDetail(null)}
                className="rounded-xl bg-secondary px-5 py-2 text-xs font-bold text-foreground hover:bg-secondary/80"
              >
                {lang === "fr" ? "Fermer" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
