import React, { useState, useRef, useEffect } from "react";
import { StudentProfile } from "@/lib/types";
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Mail,
  UserCheck,
  HelpCircle,
  FileCheck,
  Globe,
  RefreshCw,
  Copy,
  Check,
  User,
} from "lucide-react";

interface CoachIAViewProps {
  studentProfile: StudentProfile | null;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: string;
}

export const CoachIAView: React.FC<CoachIAViewProps> = ({ studentProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: `Bonjour ${
        studentProfile?.fullName ? studentProfile.fullName : "futur Boursier"
      } ! Je suis votre Coach IA Boursio. 🎓\n\nJe suis spécialisé pour vous accompagner à 100% dans votre aventure d'études internationales :\n• Rédaction de CV & Lettre de Motivation percutants\n• Stratégie pour obtenir vos Lettres de Recommandation\n• Simulation d'entretiens de bourse\n• Démarches de Passeport & Demande de Visa\n• Conseils pour la Vie Étudiante à l'étranger\n\nQue souhaitez-vous préparer aujourd'hui ?`,
      timestamp: "Maintenant",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Quick Action Topics
  const quickActions = [
    {
      icon: FileText,
      label: "Optimiser mon CV",
      prompt: "Aide-moi à rédiger un CV international au format académique pour postuler à des bourses de Master.",
    },
    {
      icon: Mail,
      label: "Lettre de Motivation",
      prompt: `Rédige une structure percutante de Lettre de Motivation pour une bourse en ${
        studentProfile?.studyField || "mon domaine"
      }.`,
    },
    {
      icon: UserCheck,
      label: "Lettres de Recommandation",
      prompt: "Comment demander efficacement une lettre de recommandation à mon professeur et que doit-elle contenir ?",
    },
    {
      icon: HelpCircle,
      label: "Préparer un Entretien",
      prompt: "Quelles sont les questions fréquentes posées lors d'un entretien de jury de bourse et comment y répondre ?",
    },
    {
      icon: FileCheck,
      label: "Passeport & Visa",
      prompt: "Quelles sont les étapes administratives clés pour obtenir un passeport rapidement et préparer ma demande de Visa étudiant ?",
    },
    {
      icon: Globe,
      label: "Vie Étudiante à l'étranger",
      prompt: "Donne-moi des conseils pratiques sur le logement, la gestion du budget et l'adaptation dans un nouveau pays d'études.",
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    setIsTyping(true);

    // Simulate RAG generation response based on student context
    setTimeout(() => {
      let aiResponseText = "";
      const lower = text.toLowerCase();

      if (lower.includes("cv")) {
        aiResponseText = `📄 **Guide de Rédaction CV Académique & Bourse**\n\nVoici les rubriques clés pour maximiser votre score auprès des jurys :\n\n1. **En-tête & Objectif** : Mentionnez vos coordonnées, nationalité (${
          studentProfile?.countryOfOrigin || "votre pays"
        }) et un titre clair (ex: *Candidat Master en ${studentProfile?.studyField || "Informatique"}*).\n2. **Parcours Académique** : Indiquez votre moyenne générale (${
          studentProfile?.gpaScore || "15.5"
        }/20) et vos mentions.\n3. **Projets & Réalisations** : Détaillez 2 à 3 projets académiques ou de recherche clés.\n4. **Compétences Linguistiques** : Précisez vos niveaux (${
          studentProfile?.languages?.map((l) => `${l.language} ${l.level}`).join(", ") || "Français, Anglais"
        }).\n\n💡 *Conseil du Coach* : Préférez des verbes d'action au passé composé ou présent ("Conçu", "Analysé", "Dirigé"). Souhaitez-vous que nous générions un modèle prêt à remplir ?`;
      } else if (lower.includes("lettre de motivation") || lower.includes("lettre")) {
        aiResponseText = `✉️ **Structure Stratégique de la Lettre de Motivation**\n\nPour convaincre le comité de bourse :\n\n• **Introduction** : Accroche directe sur votre passion pour ${
          studentProfile?.studyField || "votre filière"
        } et pourquoi cette bourse spécifique est le levier indispensable.\n• **Corps 1 (Votre Parcours)** : Mettez en avant votre moyenne (${
          studentProfile?.gpaScore || "15"
        }/20) et votre diplôme actuel (${studentProfile?.studyLevel || "Licence"}).\n• **Corps 2 (Projet d'Avenir)** : Expliquez comment vous comptez réinvestir vos compétences au retour ou dans votre carrière.\n• **Conclusion** : Remerciements et réitération de votre motivation.\n\nSouhaitez-vous une ébauche personnalisée ?`;
      } else if (lower.includes("recommandation")) {
        aiResponseText = `🤝 **Obtenir une Excellente Lettre de Recommandation**\n\n1. **Choix du Référent** : Privilégiez un professeur ayant enseigné dans votre filière ou votre encadreur de mémoire.\n2. **Timing** : Contactez-le au moins 3 à 4 semaines avant la deadline.\n3. **Kit pour le Professeur** : Fournissez-lui un résumé de votre profil (Moyenne: ${
          studentProfile?.gpaScore || "15"
        }/20, projet d'étude, intitulé de la bourse).\n\nModèle de message à envoyer :\n*"Monsieur le Professeur, dans le cadre de ma candidature à la bourse [...], votre recommandation serait un atout décisif..."*`;
      } else if (lower.includes("visa") || lower.includes("passeport")) {
        aiResponseText = `🛂 **Démarches Administrative Passeport & Visa**\n\n1. **Passeport** : Demandez-le immédiatement dans le centre de pièces d'identité de votre pays (${
          studentProfile?.countryOfResidence || "votre pays de résidence"
        }). Prévoyez un passeport valide au moins 2 ans.\n2. **Lettre d'Admission & Bourse** : Conservez l'attestation de bourse (financement total ou partiel).\n3. **Justificatifs Financiers & Logement** : Préparez les fiches de paie des garants ou l'attestation de prise en charge par la bourse.\n4. **Prise de Rendez-vous Visa** : Prenez rdv au consulat/ambassade dès la réception de la lettre d'attribution.`;
      } else if (lower.includes("entretien") || lower.includes("jury")) {
        aiResponseText = `🎙️ **Préparation aux Entretiens de Bourse**\n\nLes 3 questions pièges du jury et comment triompher :\n\n1. *"Pourquoi vous et pas un autre candidat ?"*\n👉 Mettez en avant l'adéquation entre votre profil (${
          studentProfile?.studyField || "votre domaine"
        }) et vos objectifs d'impact dans votre pays d'origine.\n\n2. *"Quels sont vos projets après l'obtention du diplôme ?"*\n👉 Soyez précis : retour au pays, création d'entreprise ou doctorat.\n\n3. *"Comment comptez-vous gérer le choc culturel ?"*\n👉 Parlez de votre capacité d'adaptation et maîtrise des langues (${
          studentProfile?.languages?.map((l) => l.language).join(", ") || "Français/Anglais"
        }).`;
      } else {
        aiResponseText = `💡 **Conseil sur-mesure du Coach IA Boursio**\n\nPour réussir votre projet d'étude en **${
          studentProfile?.targetDegree || "Master"
        }** en **${
          studentProfile?.studyField || "votre domaine"
        }** :\n\n1. Gardez un dossier scanné propre en version PDF (Diplômes, Relevés de notes, Pièce d'identité).\n2. Veillez aux deadlines de chaque bourse recommandé sur votre Dashboard.\n3. N'hésitez pas à solliciter également notre section **Mentorat Humain** si vous souhaitez échanger avec un alumni bénéficiaire de bourse !`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-accent shadow-glow">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              Coach IA Boursio <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent border border-accent/30">RAG Context Engine</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Assistant intelligent entraîné pour les bourses & opportunités internationales
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: Date.now().toString(),
                sender: "ai",
                text: "Nouvelle conversation démarrée. En quoi puis-je vous aider ?",
                timestamp: "Maintenant",
              },
            ])
          }
          className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Effacer
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-accent">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`group relative max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "border border-border bg-secondary/50 text-foreground"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Timestamp & Copy Button */}
              <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                <span>{msg.timestamp}</span>
                {msg.sender === "ai" && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="hover:opacity-100 flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="h-3 w-3 text-accent" /> Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copier
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {msg.sender === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-accent">
              <Bot className="h-4 w-4 animate-bounce" />
            </div>
            <div className="rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent animate-spin" /> Le Coach IA génère des conseils personnalisés...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="border-t border-border/50 bg-card/60 p-3">
        <div className="flex overflow-x-auto gap-2 scrollbar-none pb-1">
          {quickActions.map((action, idx) => {
            const IconComp = action.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(action.prompt)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground"
              >
                <IconComp className="h-3.5 w-3.5 text-accent" /> {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="border-t border-border bg-card p-4 flex gap-3 items-center"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Posez votre question (ex: Comment préparer mon entretien de bourse ?)..."
          className="flex-1 rounded-xl border border-border bg-input px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isTyping}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-glow hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" /> Envoyer
        </button>
      </form>
    </div>
  );
};
