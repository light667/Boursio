import React, { useState, useEffect } from "react";
import { StudentProfile, UserDocument, DocumentType } from "@/lib/types";
import {
  getUserDocumentsFromSupabase,
  saveUserDocumentToSupabase,
  deleteUserDocumentFromSupabase,
  uploadFileToSupabaseStorage,
} from "@/lib/supabase";
import { toast } from "sonner";
import { useLang } from "@/hooks/use-lang";
import {
  Folder,
  FileText,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  FileCheck,
  Shield,
  Loader2,
  Award,
  File,
} from "lucide-react";

interface DocumentsViewProps {
  userId: string;
  studentProfile: StudentProfile | null;
  onOpenProfileSetup?: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  userId,
  studentProfile,
  onOpenProfileSetup,
}) => {
  const { lang, t } = useLang();
  const td = t.dashboard[lang].documents;

  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<DocumentType>("Relevé de notes");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const DOCUMENT_TYPES: { type: DocumentType; label: string; description: string }[] = [
    { type: "CV", label: td.docTypes.cv, description: lang === "fr" ? "Votre CV académique et professionnel à jour" : "Your up-to-date academic & professional CV" },
    { type: "Nationalité", label: lang === "fr" ? "Certificat de Nationalité / CNI" : "Nationality Certificate / ID Card", description: lang === "fr" ? "Preuve de votre nationalité (Togo, Bénin, etc.)" : "Proof of citizenship (Togo, Benin, etc.)" },
    { type: "Passeport", label: td.docTypes.passport, description: lang === "fr" ? "Copie lisible des pages d'identité de votre passeport" : "Clear copy of passport identity pages" },
    { type: "Relevé de notes", label: td.docTypes.transcripts, description: lang === "fr" ? "Relevé officiel des notes universitaires ou du bac" : "Official academic transcripts" },
    { type: "Bulletin", label: lang === "fr" ? "Bulletin de Notes" : "Term Report Cards", description: lang === "fr" ? "Bulletins trimestriels ou semestriels" : "Semester or term grade reports" },
    { type: "Attestation", label: td.docTypes.certificate, description: lang === "fr" ? "Attestation de réussite, diplôme provisoire ou de stage" : "Completion, provisional degree or internship certificate" },
    { type: "Diplôme", label: td.docTypes.diploma, description: lang === "fr" ? "Baccalauréat, Licence, Master ou équivalent" : "Baccalaureate, Bachelor, Master or equivalent" },
    { type: "Lettre de motivation", label: lang === "fr" ? "Lettre de Motivation" : "Motivation Letter", description: lang === "fr" ? "Modèle ou projet de lettre rédigé" : "Draft or final motivation letter" },
    { type: "Autre", label: td.docTypes.other, description: lang === "fr" ? "Tout autre justificatif nécessaire pour vos bourses" : "Any other official scholarship attachment" },
  ];

  useEffect(() => {
    if (userId) {
      loadDocuments();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getUserDocumentsFromSupabase(userId);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
      toast.error(lang === "fr" ? "Impossible de charger vos documents." : "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error(lang === "fr" ? "Veuillez sélectionner un fichier à ajouter." : "Please select a file to upload.");
      return;
    }

    if (!docName.trim()) {
      toast.error(lang === "fr" ? "Veuillez donner un nom au document." : "Please provide a document title.");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload to Supabase Storage or generate local base64 fallback
      let fileUrl = "";
      try {
        fileUrl = await uploadFileToSupabaseStorage("documents", selectedFile, userId || "guest");
      } catch (storageErr) {
        console.warn("Storage upload failed, using blob URL fallback:", storageErr);
        fileUrl = URL.createObjectURL(selectedFile);
      }

      // 2. Save document record to Supabase DB / local storage
      const savedDoc = await saveUserDocumentToSupabase(userId || "guest", {
        name: docName.trim(),
        type: docType,
        fileUrl: fileUrl || "#",
        fileSize: selectedFile.size,
      });

      setDocuments((prev) => [savedDoc, ...prev]);
      setSelectedFile(null);
      setDocName("");
      toast.success(lang === "fr" ? "Document enregistré dans votre coffre-fort !" : "Document saved to your vault!");
    } catch (err) {
      console.error("Document upload error:", err);
      toast.error(lang === "fr" ? "Erreur lors de l'enregistrement du document." : "Error saving document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteUserDocumentFromSupabase(userId || "guest", docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      toast.success(lang === "fr" ? "Document supprimé." : "Document deleted.");
    } catch (err) {
      console.error(err);
      toast.error(lang === "fr" ? "Impossible de supprimer ce document." : "Failed to delete document.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-20">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Shield className="h-3.5 w-3.5" />
              <span>{td.totalStorage}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {td.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {td.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-border bg-card/80 p-3 text-center min-w-[100px]">
              <div className="text-xl font-bold text-primary">{documents.length}</div>
              <div className="text-[10px] text-muted-foreground">{lang === "fr" ? "Documents" : "Documents"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Quick Access from Profile */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{lang === "fr" ? "CV Centralisé pour Candidatures" : "Centralized Application CV"}</h3>
              <p className="text-xs text-muted-foreground">
                {studentProfile?.cvUrl
                  ? (lang === "fr" ? "CV rattaché à votre profil académique Boursio" : "CV linked to your Boursio academic profile")
                  : (lang === "fr" ? "Importez votre CV principal pour générer vos candidatures en 1 clic" : "Upload your main CV to auto-generate applications in 1 click")}
              </p>
            </div>
          </div>

          {studentProfile?.cvUrl ? (
            <div className="flex items-center gap-2">
              <a
                href={studentProfile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" /> {lang === "fr" ? "Consulter le CV" : "View CV"}
              </a>
              {onOpenProfileSetup && (
                <button
                  type="button"
                  onClick={onOpenProfileSetup}
                  className="rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80"
                >
                  {lang === "fr" ? "Mettre à jour" : "Update"}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-amber-500 font-medium">
                {lang === "fr" ? "Aucun CV n'a encore été ajouté à votre profil" : "No CV added to your profile yet"}
              </span>
              {onOpenProfileSetup && (
                <button
                  type="button"
                  onClick={onOpenProfileSetup}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90"
                >
                  <Plus className="h-3.5 w-3.5" /> {lang === "fr" ? "Ajouter mon CV" : "Add my CV"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Document Form Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground mb-4">
          <Plus className="h-5 w-5 text-primary" /> {lang === "fr" ? "Ajouter un Nouveau Document au Dossier" : "Add New Document to Vault"}
        </h2>

        <form onSubmit={handleUploadDocument} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {lang === "fr" ? "Type de Document *" : "Document Type *"}
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {DOCUMENT_TYPES.map((d) => (
                  <option key={d.type} value={d.type}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {lang === "fr" ? "Intitulé / Nom du Fichier *" : "Document Title / File Name *"}
              </label>
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder={lang === "fr" ? "ex: Certificat de Nationalité Togolaise, Relevé L3 2024..." : "e.g., Degree Certificate, Official Transcript 2024..."}
                className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {lang === "fr" ? "Sélectionner le Fichier (PDF, Image, Word) *" : "Select File (PDF, Image, Word) *"}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-between p-3 border border-dashed border-border rounded-xl bg-secondary/30 hover:bg-secondary/60 cursor-pointer transition-all">
                <span className="text-xs font-medium text-foreground truncate">
                  {selectedFile ? selectedFile.name : (lang === "fr" ? "Cliquez pour sélectionner un fichier (PDF, JPG, PNG, DOCX)" : "Click to select a file (PDF, JPG, PNG, DOCX)")}
                </span>
                <Upload className="h-4 w-4 text-primary shrink-0 ml-2" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-glow hover:opacity-90 transition-all disabled:opacity-50 shrink-0"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{lang === "fr" ? "Enregistrement..." : "Uploading..."}</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>{td.uploadBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Documents Grid List */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          {lang === "fr" ? "Vos Documents Enregistrés" : "Your Stored Documents"} ({documents.length})
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Folder className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-sm font-bold text-foreground mb-1">{lang === "fr" ? "Votre coffre-fort est vide" : "Your vault is empty"}</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {td.emptyVault}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
                      {doc.type}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {doc.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {typeof doc.fileSize === "number"
                        ? `${(doc.fileSize / (1024 * 1024)).toFixed(2)} MB`
                        : (doc.fileSize || "1.2 MB")}{" "}
                      • {new Date(doc.uploadedAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> {lang === "fr" ? "Ouvrir" : "Open"}
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                    title={td.deleteConfirm}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
