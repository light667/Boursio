import React, { useState, useRef, useEffect } from "react";
import { StudentProfile } from "@/lib/types";
import { generateAICoachResponse } from "@/lib/llm";
import { AIToolbarModals } from "./AIToolbarModals";
import { toast } from "sonner";
import { useLang } from "@/hooks/use-lang";
import {
  Send,
  FileText,
  Mail,
  UserCheck,
  HelpCircle,
  FileCheck,
  Globe,
  Plus,
  History,
  Copy,
  Check,
  User,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import logo from "@/assets/logo.png";

interface CoachIAViewProps {
  studentProfile: StudentProfile | null;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

/**
 * Lightweight markdown renderer for AI responses.
 */
function FormatAIMessage({ text }: { text: string }): React.ReactElement {
  const lines = text.split("\n");

  function inlineFormat(raw: string, keyPrefix: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(raw)) !== null) {
      if (m.index > last) parts.push(raw.slice(last, m.index));
      if (m[2])
        parts.push(
          <strong key={`${keyPrefix}-b${m.index}`} className="font-bold text-foreground">
            {m[2]}
          </strong>,
        );
      else if (m[3])
        parts.push(
          <em key={`${keyPrefix}-i${m.index}`} className="italic">
            {m[3]}
          </em>,
        );
      else if (m[4])
        parts.push(
          <code
            key={`${keyPrefix}-c${m.index}`}
            className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-primary"
          >
            {m[4]}
          </code>,
        );
      last = m.index + m[0].length;
    }
    if (last < raw.length) parts.push(raw.slice(last));
    return parts;
  }

  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  function flushList(idx: number) {
    if (!currentList) return;
    const ListTag = currentList.type;
    elements.push(
      <ListTag
        key={`list-${idx}`}
        className={`my-2 space-y-1 pl-5 ${
          currentList.type === "ul" ? "list-disc" : "list-decimal"
        } text-sm leading-relaxed`}
      >
        {currentList.items.map((item, itemIdx) => (
          <li key={itemIdx}>{inlineFormat(item, `li-${idx}-${itemIdx}`)}</li>
        ))}
      </ListTag>,
    );
    currentList = null;
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed === "" || trimmed === "---") {
      flushList(idx);
      if (trimmed === "---") {
        elements.push(<hr key={`hr-${idx}`} className="my-3 border-border" />);
      }
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList(idx);
      elements.push(
        <h4
          key={`h4-${idx}`}
          className="mt-3 mb-1 font-display text-xs font-bold uppercase tracking-wider text-primary"
        >
          {inlineFormat(trimmed.slice(4), `h4-${idx}`)}
        </h4>,
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList(idx);
      elements.push(
        <h3 key={`h3-${idx}`} className="mt-4 mb-1 font-display text-sm font-bold text-foreground">
          {inlineFormat(trimmed.slice(3), `h3-${idx}`)}
        </h3>,
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList(idx);
      elements.push(
        <h2 key={`h2-${idx}`} className="mt-4 mb-2 font-display text-base font-bold text-foreground">
          {inlineFormat(trimmed.slice(2), `h2-${idx}`)}
        </h2>,
      );
      return;
    }

    const ulMatch = trimmed.match(/^[-*•]\s+(.+)/);
    if (ulMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList(idx);
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(ulMatch[1]);
      return;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList(idx);
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(olMatch[2]);
      return;
    }

    flushList(idx);
    elements.push(
      <p key={`p-${idx}`} className="text-sm leading-relaxed my-1">
        {inlineFormat(trimmed, `p-${idx}`)}
      </p>,
    );
  });

  flushList(lines.length);
  return <div className="space-y-0.5">{elements}</div>;
}

export const CoachIAView: React.FC<CoachIAViewProps> = ({ studentProfile }) => {
  const { lang, t } = useLang();
  const tc = t.dashboard[lang].coach;

  const initialWelcomeText =
    lang === "fr"
      ? `Bonjour ${studentProfile?.fullName ? studentProfile.fullName : "étudiant"} ! Je suis votre **Coach IA Boursio**.\n\nJe suis là pour vous accompagner dans votre projet d'études internationales :\n- Rédaction et optimisation de votre **CV académique**\n- Structuration de vos **Lettres de Motivation**\n- Demande de **Lettres de Recommandation** à vos professeurs\n- Préparation aux **entretiens de bourses**\n- Démarches administratives : **Passeport & Visa**\n- Conseils pratiques pour la **vie étudiante à l'étranger**\n\nQue souhaitez-vous travailler aujourd'hui ?`
      : `Hello ${studentProfile?.fullName ? studentProfile.fullName : "Student"}! I am your **Boursio AI Coach**.\n\nI am here to assist your international scholarship journey:\n- Drafting and optimising your **Academic CV**\n- Structuring high-impact **Motivation Letters**\n- Requesting **Recommendation Letters** from professors\n- Preparing for **scholarship jury interviews**\n- Official paperwork: **Passport & Student Visa**\n- Practical tips for **student life abroad**\n\nWhat would you like to work on today?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: initialWelcomeText,
      timestamp: lang === "fr" ? "Maintenant" : "Now",
    },
  ]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeAIModal, setActiveAIModal] = useState<"letter" | "cv" | "interview" | null>(null);
  const [pastSessions, setPastSessions] = useState<{ id: string; title: string; date: string }[]>(
    [],
  );
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickActions = [
    {
      icon: FileText,
      label: tc.letterTool,
      action: () => setActiveAIModal("letter"),
      prompt: "",
    },
    {
      icon: TrendingUp,
      label: tc.cvTool,
      action: () => setActiveAIModal("cv"),
      prompt: "",
    },
    {
      icon: Sparkles,
      label: tc.interviewTool,
      action: () => setActiveAIModal("interview"),
      prompt: "",
    },
    {
      icon: FileCheck,
      label: lang === "fr" ? "Passeport Togo" : "Passport Togo",
      prompt:
        lang === "fr"
          ? "Quelles sont les pièces à fournir et les étapes pour la demande et le renouvellement de passeport au Togo (DGDN, quittance 30.000 F CFA) ?"
          : "What are the required documents and steps for a Togolese passport at DGDN?",
    },
    {
      icon: Mail,
      label: lang === "fr" ? "Lettre de Motivation" : "Motivation Letter",
      prompt:
        lang === "fr"
          ? `Rédige une structure percutante et montre-moi le modèle de référence de Lettre de Motivation pour une bourse en ${studentProfile?.studyField || "mon domaine"}.`
          : `Draft a high-impact motivation letter structure for a scholarship in ${studentProfile?.studyField || "my field"}.`,
    },
    {
      icon: UserCheck,
      label: lang === "fr" ? "Recommandation" : "Recommendation",
      prompt:
        lang === "fr"
          ? "Comment demander efficacement une lettre de recommandation à mon professeur et que doit-elle contenir ?"
          : "How should I effectively ask my professor for a recommendation letter and what should it contain?",
    },
    {
      icon: HelpCircle,
      label: lang === "fr" ? "Entretien jury" : "Jury Interview",
      prompt:
        lang === "fr"
          ? "Quelles sont les questions fréquentes posées lors d'un entretien de jury de bourse et comment y répondre ?"
          : "What are the most frequent scholarship interview questions and how to answer them?",
    },
    {
      icon: Globe,
      label: lang === "fr" ? "Vie à l'étranger" : "Life Abroad",
      prompt:
        lang === "fr"
          ? "Donne-moi des conseils pratiques sur le logement, la gestion du budget et l'adaptation dans un nouveau pays d'études."
          : "Give me practical advice on housing, budget management, and adapting to a new country of study.",
    },
  ];

  const handleNewDiscussion = () => {
    if (messages.length > 1) {
      const firstUserMsg = messages.find((m) => m.sender === "user");
      const title = firstUserMsg ? firstUserMsg.text.slice(0, 35) + "…" : (lang === "fr" ? "Discussion précédente" : "Previous discussion");
      setPastSessions((prev) => [
        { id: Date.now().toString(), title, date: new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US") },
        ...prev,
      ]);
    }
    setMessages([
      {
        id: Date.now().toString(),
        sender: "ai",
        text: lang === "fr" ? "Nouvelle discussion démarrée.\n\nEn quoi puis-je vous aider ?" : "New discussion started.\n\nHow can I help you today?",
        timestamp: lang === "fr" ? "Maintenant" : "Now",
      },
    ]);
    toast.info(lang === "fr" ? "Nouvelle discussion démarrée" : "New discussion started");
    inputRef.current?.focus();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend ?? inputPrompt;
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

    try {
      const aiText = await generateAICoachResponse(text, studentProfile);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("Coach IA error:", err);
      toast.error(lang === "fr" ? "Le Coach IA n'a pas pu répondre. Veuillez réessayer." : "AI Coach could not reply. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(lang === "fr" ? "Texte copié dans le presse-papier" : "Text copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header bar */}
      <div className="shrink-0 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 sm:px-6 backdrop-blur-md relative">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 p-1">
            <img src={logo} alt="Coach IA" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-bold text-foreground">
                {tc.title}
              </h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {tc.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewDiscussion}
            className="flex items-center gap-1 rounded-xl border border-border bg-secondary/80 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="hidden sm:inline">{tc.clearBtn}</span>
            <span className="sm:hidden">{lang === "fr" ? "Nouveau" : "New"}</span>
          </button>

          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className="flex items-center gap-1 rounded-xl border border-border bg-secondary/80 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
          >
            <History className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>{lang === "fr" ? "Historique" : "History"}</span>
          </button>
        </div>

        {historyOpen && (
          <div className="absolute right-4 top-full mt-1 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-primary" /> {lang === "fr" ? "Historique des discussions" : "Discussion history"}
              </h3>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {lang === "fr" ? "Fermer" : "Close"}
              </button>
            </div>
            {pastSessions.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                {lang === "fr" ? "Aucune discussion enregistrée." : "No saved conversations."}
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                {pastSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start gap-2 rounded-xl p-2.5 text-xs hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">{s.title}</div>
                      <div className="text-[10px] text-muted-foreground">{s.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 space-y-4">
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 p-1 self-start mt-0.5">
                  <img src={logo} alt="IA" className="h-6 w-6 object-contain" />
                </div>
              )}

              <div
                className={`group relative max-w-xl rounded-2xl p-4 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-medium text-sm leading-relaxed"
                    : "border border-border bg-card text-foreground shadow-sm"
                }`}
              >
                {msg.sender === "ai" ? (
                  <FormatAIMessage text={msg.text} />
                ) : (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                )}

                <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/30 pt-1.5 text-[10px] opacity-60">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "ai" && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:opacity-100"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" /> {lang === "fr" ? "Copié" : "Copied"}
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> {lang === "fr" ? "Copier" : "Copy"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary self-start mt-0.5">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 p-1">
                <img src={logo} alt="IA" className="h-6 w-6 object-contain animate-pulse" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground shadow-sm">
                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                {lang === "fr" ? "Le Coach IA prépare vos conseils..." : "AI Coach is typing advice..."}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="shrink-0 border-t border-border/50 bg-card/60 px-4 py-2">
        <div className="max-w-3xl mx-auto flex overflow-x-auto gap-2 scrollbar-none">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            const isStudio = Boolean(action.action);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (action.action) {
                    action.action();
                  } else if (action.prompt) {
                    handleSendMessage(action.prompt);
                  }
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                  isStudio
                    ? "border-primary/40 bg-primary/10 text-primary font-bold hover:bg-primary/20 shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isStudio ? "text-primary" : ""}`} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <div className="shrink-0 border-t border-border bg-card p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-3xl mx-auto flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={tc.inputPlaceholder}
            className="flex-1 rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white shadow-glow hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">{tc.sendBtn}</span>
          </button>
        </form>
      </div>

      {/* AI Toolbar Modals (Letter Generator, CV ATS, Interview Simulator) */}
      <AIToolbarModals
        activeModal={activeAIModal}
        onClose={() => setActiveAIModal(null)}
        studentProfile={studentProfile}
      />
    </div>
  );
};
