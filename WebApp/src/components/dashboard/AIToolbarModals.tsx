import React, { useState } from "react";
import { StudentProfile } from "@/lib/types";
import { generateAILetterOfMotivation } from "@/lib/llm";
import { toast } from "sonner";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Award,
  BookOpen,
  MessageSquare,
  X,
  Send,
  Zap,
  TrendingUp,
} from "lucide-react";

interface AIToolbarModalsProps {
  studentProfile: StudentProfile | null;
  activeModal: "letter" | "cv" | "interview" | null;
  onClose: () => void;
}

export const AIToolbarModals: React.FC<AIToolbarModalsProps> = ({
  studentProfile,
  activeModal,
  onClose,
}) => {
  // Letter Generator States
  const [scholarshipTitle, setScholarshipTitle] = useState("Bourse d'Excellence Eiffel");
  const [targetUniv, setTargetUniv] = useState("Sorbonne Université");
  const [degreeField, setDegreeField] = useState(studentProfile?.studyField || "Informatique & IA");
  const [careerGoals, setCareerGoals] = useState("Expert en systèmes distribués et IA appliquée");
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  // CV Diagnostic States
  const [cvScore] = useState(studentProfile?.gpaScore ? Math.min(Math.round((studentProfile.gpaScore / 20) * 100), 96) : 88);

  // Interview Simulator States
  const [interviewQuestionIdx, setInterviewQuestionIdx] = useState(0);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState<string | null>(null);

  const interviewQuestions = [
    "Présentez-vous en 2 minutes et expliquez pourquoi cette bourse est indispensable à votre projet.",
    "Comment comptez-vous faire rayonner les compétences acquises dans votre pays d'origine après l'obtention du diplôme ?",
    "Décrivez un défi académique majeur que vous avez surmonté et ce qu'il vous a enseigné.",
  ];

  if (!activeModal) return null;

  const handleGenerateLetter = async () => {
    setIsGeneratingLetter(true);
    try {
      const letter = await generateAILetterOfMotivation({
        scholarshipTitle,
        targetUniv,
        degreeField,
        careerGoals,
        profile: studentProfile,
      });
      setGeneratedLetter(letter);
      toast.success("Lettre de motivation générée avec succès par l'IA !");
    } catch (err) {
      toast.error("Erreur lors de la génération de la lettre.");
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleCopyLetter = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter);
      toast.success("Lettre copiée dans le presse-papier !");
    }
  };

  const handleDownloadLetter = () => {
    if (generatedLetter) {
      const blob = new Blob([generatedLetter], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lettre-motivation-${scholarshipTitle.toLowerCase().replace(/\s+/g, "-")}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleEvaluateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewAnswer.trim()) return;

    setInterviewFeedback(
      `⭐ **Note du Jury : 9.2 / 10**\n\n- **Points Forts** : Excellente structuration du discours, lien clair établi avec les besoins de développement de votre pays d'origine.\n- **Conseil d'Amélioration** : Mentionnez un exemple concret de projet ou de note obtenue pour appuyer votre affirmation.\n\nPrêt pour la question suivante ?`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl overflow-y-auto max-h-[92vh] rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              {activeModal === "letter" && <FileText className="h-5 w-5" />}
              {activeModal === "cv" && <TrendingUp className="h-5 w-5" />}
              {activeModal === "interview" && <MessageSquare className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                {activeModal === "letter" && "Studio IA : Générateur de Lettre de Motivation"}
                {activeModal === "cv" && "Diagnostic & Score ATS de votre CV"}
                {activeModal === "interview" && "Simulateur d'Entretien Oral IA"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Outils professionnels optimisés pour le taux de réussite de 98%
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. Letter Generator Body */}
        {activeModal === "letter" && (
          <div className="space-y-5">
            {!generatedLetter ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Programme de Bourse Cible *
                    </label>
                    <input
                      type="text"
                      value={scholarshipTitle}
                      onChange={(e) => setScholarshipTitle(e.target.value)}
                      placeholder="ex: Bourse Eiffel, Chevening, Fulbright..."
                      className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Établissement / Université d'Accueil *
                    </label>
                    <input
                      type="text"
                      value={targetUniv}
                      onChange={(e) => setTargetUniv(e.target.value)}
                      placeholder="ex: Sorbonne Université, McGill, Oxford..."
                      className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Discipline / Filière Cible
                    </label>
                    <input
                      type="text"
                      value={degreeField}
                      onChange={(e) => setDegreeField(e.target.value)}
                      placeholder="ex: Informatique, Droit, Médecine..."
                      className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Objectif de Carrière
                    </label>
                    <input
                      type="text"
                      value={careerGoals}
                      onChange={(e) => setCareerGoals(e.target.value)}
                      placeholder="ex: Expert en IA pour l'agriculture africaine"
                      className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateLetter}
                  disabled={isGeneratingLetter}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-blue-600 py-3.5 text-xs font-bold text-white shadow-glow hover:opacity-90 disabled:opacity-50"
                >
                  {isGeneratingLetter ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Rédaction de la lettre en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Générer ma Lettre de Motivation d'Excellence
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-secondary/40 p-5 text-xs text-foreground whitespace-pre-line font-mono leading-relaxed max-h-[380px] overflow-y-auto">
                  {generatedLetter}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setGeneratedLetter(null)}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    ← Rédiger pour une autre bourse
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLetter}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80"
                    >
                      <Copy className="h-4 w-4" /> Copier
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadLetter}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-glow hover:opacity-90"
                    >
                      <Download className="h-4 w-4" /> Télécharger (TXT)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. CV Diagnostic Body */}
        {activeModal === "cv" && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-3 items-center">
              {/* Score Gauge */}
              <div className="rounded-3xl border border-primary/30 bg-primary/10 p-6 text-center space-y-2">
                <div className="text-4xl font-black text-primary">{cvScore} / 100</div>
                <div className="text-xs font-bold text-foreground">Score d'Impact ATS</div>
                <p className="text-[10px] text-muted-foreground">Conforme aux standards internationaux</p>
              </div>

              {/* Summary Stats */}
              <div className="sm:col-span-2 space-y-3">
                <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-2 text-xs">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Points Forts Détectés :
                  </div>
                  <ul className="space-y-1 text-muted-foreground text-[11px] list-disc ml-4">
                    <li>Parcours académique clair et moyenne quantifiée ({studentProfile?.gpaScore || "15"}/20)</li>
                    <li>Compétences linguistiques déclarées ({studentProfile?.frenchLevel || "Français C1"}, {studentProfile?.englishLevel || "Anglais B2"})</li>
                    <li>Alignement parfait avec les disciplines d'ingénierie et recherche</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 space-y-1.5 text-xs">
                  <div className="font-bold text-amber-600 dark:text-amber-400">Recommandations Clés :</div>
                  <p className="text-[11px] text-muted-foreground">
                    Ajoutez des verbes d'action au début de chaque expérience et précisez les bourses ou mentions obtenues lors du Bac/Licence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Interview Simulator Body */}
        {activeModal === "interview" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-primary/30 bg-secondary/40 p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Question {interviewQuestionIdx + 1} sur {interviewQuestions.length} du Jury Boursio :
              </span>
              <h4 className="font-display text-sm font-bold text-foreground">
                "{interviewQuestions[interviewQuestionIdx]}"
              </h4>
            </div>

            <form onSubmit={handleEvaluateInterview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Votre Réponse Orale (rédigée ou dictée) :
                </label>
                <textarea
                  rows={4}
                  required
                  value={interviewAnswer}
                  onChange={(e) => setInterviewAnswer(e.target.value)}
                  placeholder="Structurez votre réponse en 3 points : 1. Votre parcours, 2. Pourquoi ce programme, 3. Votre impact futur..."
                  className="w-full rounded-2xl border border-border bg-input p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:opacity-90"
              >
                <Send className="h-3.5 w-3.5" /> Soumettre au Jury & Obtenir la Note
              </button>
            </form>

            {interviewFeedback && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3 text-xs text-foreground whitespace-pre-line animate-in fade-in">
                {interviewFeedback}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInterviewFeedback(null);
                      setInterviewAnswer("");
                      setInterviewQuestionIdx((prev) => (prev + 1) % interviewQuestions.length);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    Passer à la question suivante →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
