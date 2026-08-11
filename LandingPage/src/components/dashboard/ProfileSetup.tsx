import React, { useState, useEffect } from "react";
import { StudentProfile } from "@/lib/types";
import { saveProfileToSupabase, getProfileFromSupabase } from "@/lib/supabase";
import {
  User,
  GraduationCap,
  Languages as LanguagesIcon,
  Award,
  Check,
  Save,
  ArrowRight,
  Globe,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  Camera,
  Upload,
} from "lucide-react";
import logo from "@/assets/logo.png";

interface ProfileSetupProps {
  userId: string;
  onProfileSaved: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({
  userId,
  onProfileSaved,
  initialProfile,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State - Real values without pre-filled fake defaults
  const [fullName, setFullName] = useState(initialProfile?.fullName || "");
  const [dateOfBirth, setDateOfBirth] = useState(initialProfile?.dateOfBirth || "");
  const [countryOfOrigin, setCountryOfOrigin] = useState(initialProfile?.countryOfOrigin || "");
  const [countryOfResidence, setCountryOfResidence] = useState(initialProfile?.countryOfResidence || "");
  const [studyLevel, setStudyLevel] = useState(initialProfile?.studyLevel || "Licence 3");
  const [targetDegree, setTargetDegree] = useState(initialProfile?.targetDegree || "Master");
  const [studyField, setStudyField] = useState(initialProfile?.studyField || "");
  const [university, setUniversity] = useState(initialProfile?.university || "");
  const [gpaScore, setGpaScore] = useState<string>(
    initialProfile?.gpaScore ? String(initialProfile.gpaScore) : ""
  );
  const [lastDegreeGpa, setLastDegreeGpa] = useState<string>(
    initialProfile?.lastDegreeGpa ? String(initialProfile.lastDegreeGpa) : ""
  );
  const [cvUrl, setCvUrl] = useState(initialProfile?.cvUrl || "");
  const [photoUrl, setPhotoUrl] = useState(initialProfile?.photoUrl || "");

  const [languages, setLanguages] = useState<{ language: string; level: any }[]>(
    initialProfile?.languages || [
      { language: "Français", level: "Bilingue" },
      { language: "Anglais", level: "Intermédiaire" },
    ]
  );

  useEffect(() => {
    if (!initialProfile && userId) {
      getProfileFromSupabase(userId).then((prof) => {
        if (prof) {
          setFullName(prof.fullName || "");
          setDateOfBirth(prof.dateOfBirth || "");
          setCountryOfOrigin(prof.countryOfOrigin || "");
          setCountryOfResidence(prof.countryOfResidence || "");
          setStudyLevel(prof.studyLevel || "Licence 3");
          setTargetDegree(prof.targetDegree || "Master");
          setStudyField(prof.studyField || "");
          setUniversity(prof.university || "");
          setGpaScore(prof.gpaScore ? String(prof.gpaScore) : "");
          setLastDegreeGpa(prof.lastDegreeGpa ? String(prof.lastDegreeGpa) : "");
          setCvUrl(prof.cvUrl || "");
          setPhotoUrl(prof.photoUrl || "");
          if (prof.languages && prof.languages.length > 0) {
            setLanguages(prof.languages);
          }
        }
      });
    }
  }, [userId, initialProfile]);

  const handleAddLanguage = () => {
    setLanguages([...languages, { language: "", level: "Intermédiaire" }]);
  };

  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    // Validation for essential required fields
    if (!fullName.trim() || !countryOfOrigin.trim() || !studyField.trim() || !gpaScore) {
      setErrorMsg("Veuillez remplir toutes les informations requises avant d'enregistrer.");
      return;
    }

    const numericGpa = parseFloat(gpaScore);
    const numericLastGpa = parseFloat(lastDegreeGpa) || numericGpa;

    if (isNaN(numericGpa) || numericGpa < 0 || numericGpa > 20) {
      setErrorMsg("La moyenne générale doit être un nombre valide entre 0 et 20.");
      return;
    }

    setSaving(true);

    const profileData: StudentProfile = {
      userId,
      fullName: fullName.trim(),
      dateOfBirth,
      countryOfOrigin: countryOfOrigin.trim(),
      countryOfResidence: (countryOfResidence || countryOfOrigin).trim(),
      studyLevel,
      targetDegree,
      studyField: studyField.trim(),
      university: university.trim(),
      gpaScore: numericGpa,
      lastDegreeGpa: numericLastGpa,
      languages: languages.filter((l) => l.language.trim() !== ""),
      cvUrl: cvUrl.trim(),
      photoUrl: photoUrl.trim(),
      updatedAt: new Date().toISOString(),
    };

    const success = await saveProfileToSupabase(profileData);
    setSaving(false);

    if (success) {
      setSavedSuccess(true);
      onProfileSaved(profileData);
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      setErrorMsg("Une erreur s'est produite lors de l'enregistrement de votre profil.");
    }
  };

  const studyLevelOptions = [
    "Baccalauréat",
    "Licence 1",
    "Licence 2",
    "Licence 3",
    "Master 1",
    "Master 2",
    "Doctorat",
    "Autre / Formation",
  ];

  const targetDegreeOptions = [
    "Licence",
    "Master",
    "Doctorat",
    "Recherche / Postdoc",
    "Stage / Formation",
  ];

  const popularFields = [
    "Informatique & IA",
    "Ingénierie & Technologie",
    "Médecine & Santé Publique",
    "Business & Gestion",
    "Économie & Finance",
    "Droit & Relations Internationales",
    "Sciences Sociales & Humaines",
    "Arts, Médias & Design",
    "Agronomie & Environnement",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Boursio" className="h-10 w-10 object-contain shrink-0" />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Profil Étudiant
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Renseignez vos véritables informations pour que l'algorithme génère vos recommandations de bourses sur-mesure.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveProfile()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:opacity-90 disabled:opacity-50 shrink-0"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : savedSuccess ? (
              <>
                <Check className="h-4 w-4 text-accent" /> Enregistré !
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Enregistrer le profil
              </>
            )}
          </button>
        </div>

        {/* Step Tabs Indicator */}
        <div className="mt-6 flex items-center gap-2 border-t border-border/50 pt-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              activeStep === 1
                ? "bg-primary text-white shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <User className="h-3.5 w-3.5" /> 1. Informations Personnelles
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              activeStep === 2
                ? "bg-primary text-white shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" /> 2. Parcours & Filière
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              activeStep === 3
                ? "bg-primary text-white shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <LanguagesIcon className="h-3.5 w-3.5" /> 3. Documents & Moyennes
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Content */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Step 1: Personal Info */}
        {activeStep === 1 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <User className="h-5 w-5 text-primary" /> Informations Personnelles & Résidence
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Nom Complet *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ex: Jean Dupont, Mamadou Ndiaye..."
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Date de Naissance *
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Pays d'Origine (Nationalité) *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    placeholder="ex: Sénégal, Côte d'Ivoire, Cameroun, France..."
                    className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Pays de Résidence Actuel *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={countryOfResidence}
                    onChange={(e) => setCountryOfResidence(e.target.value)}
                    placeholder="ex: Sénégal, France, Canada..."
                    className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Suivant : Parcours <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Academic background */}
        {activeStep === 2 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <GraduationCap className="h-5 w-5 text-accent" /> Niveau Académique & Objectifs
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Niveau d'Étude Actuel *
                </label>
                <select
                  value={studyLevel}
                  onChange={(e) => setStudyLevel(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {studyLevelOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Grade / Niveau Recherché (avec la bourse) *
                </label>
                <select
                  value={targetDegree}
                  onChange={(e) => setTargetDegree(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {targetDegreeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Filière / Domaine d'Étude *
              </label>
              <input
                type="text"
                required
                value={studyField}
                onChange={(e) => setStudyField(e.target.value)}
                placeholder="ex: Informatique, Médecine, Droit, Génie Civil..."
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary mb-3"
              />
              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-2">
                {popularFields.map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => setStudyField(field)}
                    className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                      studyField === field
                        ? "bg-accent/20 text-accent font-semibold border border-accent/40"
                        : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Université d'Origine (Optionnel)
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="ex: Université Cheikh Anta Diop, Université Félix Houphouët-Boigny..."
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Suivant : Documents & Moyennes <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Languages, Scores & Optional Document Uploads */}
        {activeStep === 3 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <Award className="h-5 w-5 text-accent" /> Moyennes Académiques & Documents (Optionnel)
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Moyenne Générale Actuelle (sur 20) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  required
                  value={gpaScore}
                  onChange={(e) => setGpaScore(e.target.value)}
                  placeholder="ex: 15.5"
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Moyenne du Dernier Diplôme Obtenu (sur 20) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  required
                  value={lastDegreeGpa}
                  onChange={(e) => setLastDegreeGpa(e.target.value)}
                  placeholder="ex: 16.0"
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Optional Upload Inputs */}
            <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-border/60">
              <div>
                <label className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-primary" /> Lien CV (Optionnel)</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Drive, Dropbox...</span>
                </label>
                <input
                  type="url"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-cv.pdf"
                  className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Camera className="h-4 w-4 text-primary" /> Photo de Profil (Optionnel)</span>
                  <span className="text-[10px] text-muted-foreground font-normal">URL d'image</span>
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Languages Section */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Langues Maîtrisées et Niveau
                </label>
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Ajouter une langue
                </button>
              </div>

              <div className="space-y-3">
                {languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 sm:flex-nowrap"
                  >
                    <input
                      type="text"
                      value={lang.language}
                      onChange={(e) => {
                        const updated = [...languages];
                        updated[idx].language = e.target.value;
                        setLanguages(updated);
                      }}
                      placeholder="Langue (ex: Français, Anglais...)"
                      className="w-full sm:w-1/2 rounded-lg border border-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />

                    <select
                      value={lang.level}
                      onChange={(e) => {
                        const updated = [...languages];
                        updated[idx].level = e.target.value as any;
                        setLanguages(updated);
                      }}
                      className="w-full sm:w-1/2 rounded-lg border border-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="Débutant">Débutant (A1/A2)</option>
                      <option value="Intermédiaire">Intermédiaire (B1/B2)</option>
                      <option value="Avancé">Avancé (C1)</option>
                      <option value="C1/C2">Expert (C1/C2)</option>
                      <option value="Bilingue">Bilingue / Langue maternelle</option>
                    </select>

                    {languages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(idx)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:opacity-90 disabled:opacity-50"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Enregistrer & Accéder au Dashboard
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
