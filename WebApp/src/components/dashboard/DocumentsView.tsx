import React, { useState, useEffect } from "react";
import { StudentProfile, UserDocument, DocumentType } from "@/lib/types";
import {
  getUserDocumentsFromSupabase,
  saveUserDocumentToSupabase,
  deleteUserDocumentFromSupabase,
  uploadFileToSupabaseStorage,
} from "@/lib/supabase";
import { toast } from "sonner";
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
  BookOpen,
  File,
} from "lucide-react";

interface DocumentsViewProps {
  userId: string;
  studentProfile: StudentProfile | null;
  onOpenProfileSetup?: () => void;
}

const DOCUMENT_TYPES: { type: DocumentType; label: string; description: string }[] = [
  { type: "CV", label: "Curriculum Vitae (CV)", description: "Votre CV académique et professionnel à jour" },
  { type: "Nationalité", label: "Certificat de Nationalité / CNI", description: "Preuve de votre nationalité (Togo, Bénin, etc.)" },
  { type: "Passeport", label: "Passeport Ordinair/Service", description: "Copie lisible des pages d'identité de votre passeport" },
  { type: "Relevé de notes", label: "Relevé de Notes", description: "Relevé officiel des notes universitaires ou du bac" },
  { type: "Bulletin", label: "Bulletin de Notes", description: "Bulletins trimestriels ou semestriels" },
  { type: "Attestation", label: "Attestation de Succès / Stage", description: "Attestation de réussite, diplôme provisoire ou de stage" },
  { type: "Diplôme", label: "Diplôme Officiel", description: "Baccalauréat, Licence, Master ou équivalent" },
  { type: "Lettre de motivation", label: "Lettre de Motivation", description: "Modèle ou projet de lettre rédigé" },
  { type: "Autre", label: "Autre Document", description: "Tout autre justificatif nécessaire pour vos bourses" },
];

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  userId,
  studentProfile,
  onOpenProfileSetup,
}) => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<DocumentType>("Relevé de notes");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (userId) {
      loadDocuments();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadDocuments = async () => {
    setLoading(true);
    const docs = await getUserDocumentsFromSupabase(userId);
    setDocuments(docs);
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!docName.trim()) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        setDocName(nameWithoutExt);
      }
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier à importer.");
      return;
    }
    if (!docName.trim()) {
      toast.error("Veuillez saisir un nom pour ce document.");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload to Supabase Storage bucket 'documents'
      const fileUrl = await uploadFileToSupabaseStorage("documents", selectedFile, userId || "guest");

      // 2. Save document metadata
      const newDoc = await saveUserDocumentToSupabase(userId, {
        name: docName.trim(),
        type: docType,
        fileUrl,
        fileSize: selectedFile.size,
      });

      setDocuments((prev) => [newDoc, ...prev]);
      setDocName("");
      setSelectedFile(null);
      toast.success(`Document "${newDoc.name}" ajouté avec succès à votre dossier !`);
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement du document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: string, name: string) => {
    if (confirm(`Voulez-vous vraiment supprimer le document "${name}" ?`)) {
      await deleteUserDocumentFromSupabase(userId, docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      toast.info(`Document "${name}" supprimé de votre dossier.`);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeBadgeColor = (type: DocumentType) => {
    switch (type) {
      case "CV":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      case "Nationalité":
      case "Passeport":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
      case "Relevé de notes":
      case "Bulletin":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      case "Diplôme":
      case "Attestation":
        return "bg-purple-500/10 text-purple-600 border-purple-500/30";
      default:
        return "bg-secondary text-muted-foreground border-border";
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary shrink-0">
              <Folder className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Mon Dossier de Candidature
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Centralisez vos pièces justificatives (CV, nationalité, bulletins, passeport) stockées en sécurité sur Supabase Storage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main CV Card Highlight */}
      <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-foreground">Curriculum Vitae Principal</h3>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  Document Clé
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Utilisé par l'IA Boursio pour générer vos lettres de motivation et évaluer la compatibilité des bourses.
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
                <ExternalLink className="h-3.5 w-3.5" /> Consulter le CV
              </a>
              {onOpenProfileSetup && (
                <button
                  type="button"
                  onClick={onOpenProfileSetup}
                  className="rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80"
                >
                  Mettre à jour
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-amber-500 font-medium">Aucun CV n'a encore été ajouté à votre profil</span>
              {onOpenProfileSetup && (
                <button
                  type="button"
                  onClick={onOpenProfileSetup}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90"
                >
                  <Plus className="h-3.5 w-3.5" /> Ajouter mon CV
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Document Form Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground mb-4">
          <Plus className="h-5 w-5 text-primary" /> Ajouter un Nouveau Document au Dossier
        </h2>

        <form onSubmit={handleUploadDocument} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Type de Document *
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
                Intitulé / Nom du Fichier *
              </label>
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="ex: Certificat de Nationalité Togolaise, Relevé L3 2024..."
                className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Sélectionner le Fichier (PDF, Image, Word) *
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-between p-3 border border-dashed border-border rounded-xl bg-secondary/30 hover:bg-secondary/60 cursor-pointer transition-all">
                <span className="text-xs font-medium text-foreground truncate">
                  {selectedFile ? selectedFile.name : "Cliquez pour sélectionner un fichier (PDF, JPG, PNG, DOCX)"}
                </span>
                <Upload className="h-4 w-4 text-primary shrink-0 ml-2" />
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-3 text-xs font-semibold text-white shadow-glow hover:opacity-90 disabled:opacity-50 shrink-0"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Enregistrer dans mon dossier
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <FileCheck className="h-5 w-5 text-emerald-500" /> Documents de votre Dossier ({documents.length})
          </h2>
          <span className="text-xs text-muted-foreground">Disponibles pour vos candidatures</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-xs text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" /> Chargement de vos documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border p-6 bg-secondary/20">
            <Folder className="h-10 w-10 text-muted-foreground/60 mb-2" />
            <h4 className="text-sm font-bold text-foreground">Votre dossier est encore vide</h4>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Importez vos actes de nationalité, relevés de notes, bulletins et attestations pour les garder à portée de main lors de vos postulations aux bourses.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60 overflow-x-auto">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-3 px-2 hover:bg-secondary/40 rounded-xl transition-colors gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <File className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-foreground truncate">{doc.name}</h4>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getTypeBadgeColor(
                          doc.type,
                        )}`}
                      >
                        {doc.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Ajouté le {new Date(doc.uploadedAt).toLocaleDateString("fr-FR")} • {formatFileSize(doc.fileSize)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-primary" /> Ouvrir
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(doc.id, doc.name)}
                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
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
