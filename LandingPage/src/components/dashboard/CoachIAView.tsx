import React, { useState, useRef, useEffect } from "react";
import { StudentProfile } from "@/lib/types";
import { generateAICoachResponse } from "@/lib/llm";
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
 * Handles: **bold**, *italic*, `inline code`, # headings, ## headings,
 * - bullet lists, 1. numbered lists, --- separators.
 * Zero external dependencies.
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
        parts.push(<strong key={`${keyPrefix}-b${m.index}`} className="font-bold text-foreground">{m[2]}</strong>);
      else if (m[3])
        parts.push(<em key={`${keyPrefix}-i${m.index}`} className="italic">{m[3]}</em>);
      else if (m[4])
        parts.push(
          <code key={`${keyPrefix}-c${m.index}`} className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-mono text-primary">
            {m[4]}
          </code>
        );
      last = m.index + m[0].length;
    }
    if (last < raw.length) parts.push(raw.slice(last));
    return parts;
  }

  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (/^## /.test(line)) {
      nodes.push(
        <h3 key={i} className="font-display font-bold text-base text-foreground mt-3 mb-1 leading-snug">
          {inlineFormat(line.slice(3), `h3-${i}`)}
        </h3>
      );
    } else if (/^# /.test(line)) {
      nodes.push(
        <h2 key={i} className="font-display font-bold text-lg text-foreground mt-3 mb-1 leading-snug">
          {inlineFormat(line.slice(2), `h2-${i}`)}
        </h2>
      );
    } else if (/^[-*•] /.test(line)) {
      // Collect consecutive bullet lines into a single <ul>
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-*•] /.test(lines[i])) {
        items.push(
          <li key={i} className="leading-relaxed">
            {inlineFormat(lines[i].replace(/^[-*•] /, ""), `li-${i}`)}
          </li>
        );
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-1.5 ml-5 list-disc space-y-0.5 text-foreground">
          {items}
        </ul>
      );
      continue;
    } else if (/^\d+\. /.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(
          <li key={i} className="leading-relaxed">
            {inlineFormat(lines[i].replace(/^\d+\. /, ""), `ol-${i}`)}
          </li>
        );
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="my-1.5 ml-5 list-decimal space-y-0.5 text-foreground">
          {items}
        </ol>
      );
      continue;
    } else if (/^---+$/.test(line.trim())) {
      nodes.push(<hr key={i} className="border-border my-2" />);
    } else if (line.trim() === "") {
      nodes.push(<div key={i} className="h-1.5" />);
    } else {
      nodes.push(
        <p key={i} className="leading-relaxed text-foreground">
          {inlineFormat(line, `p-${i}`)}
        </p>
      );
    }
    i++;
  }

  return <div className="space-y-0.5 text-sm">{nodes}</div>;
}

export const CoachIAView: React.FC<CoachIAViewProps> = ({ studentProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: `Bonjour ${
        studentProfile?.fullName ? studentProfile.fullName : "étudiant"
      } ! Je suis votre **Coach IA Boursio**.\n\nJe suis là pour vous accompagner dans votre projet d'études internationales :\n- Rédaction et optimisation de votre **CV académique**\n- Structuration de vos **Lettres de Motivation**\n- Demande de **Lettres de Recommandation** à vos professeurs\n- Préparation aux **entretiens de bourses**\n- Démarches administratives : **Passeport & Visa**\n- Conseils pratiques pour la **vie étudiante à l'étranger**\n\nQue souhaitez-vous travailler aujourd'hui ?`,
      timestamp: "Maintenant",
    },
  ]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [pastSessions, setPastSessions] = useState<{ id: string; title: string; date: string }[]>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickActions = [
    { icon: FileText, label: "CV académique", prompt: "Aide-moi à rédiger un CV international au format académique pour postuler à des bourses de Master." },
    { icon: Mail, label: "Lettre de Motivation", prompt: `Rédige une structure percutante de Lettre de Motivation pour une bourse en ${studentProfile?.studyField || "mon domaine"}.` },
    { icon: UserCheck, label: "Recommandation", prompt: "Comment demander efficacement une lettre de recommandation à mon professeur et que doit-elle contenir ?" },
    { icon: HelpCircle, label: "Entretien jury", prompt: "Quelles sont les questions fréquentes posées lors d'un entretien de jury de bourse et comment y répondre ?" },
    { icon: FileCheck, label: "Passeport & Visa", prompt: "Quelles sont les étapes administratives clés pour obtenir un passeport rapidement et préparer ma demande de Visa étudiant ?" },
    { icon: Globe, label: "Vie à l'étranger", prompt: "Donne-moi des conseils pratiques sur le logement, la gestion du budget et l'adaptation dans un nouveau pays d'études." },
  ];

  const handleNewDiscussion = () => {
    if (messages.length > 1) {
      const firstUserMsg = messages.find((m) => m.sender === "user");
      const title = firstUserMsg ? firstUserMsg.text.slice(0, 35) + "…" : "Discussion précédente";
      setPastSessions((prev) => [
        { id: Date.now().toString(), title, date: new Date().toLocaleDateString("fr-FR") },
        ...prev,
      ]);
    }
    setMessages([{
      id: Date.now().toString(),
      sender: "ai",
      text: "Nouvelle discussion démarrée.\n\nEn quoi puis-je vous aider ?",
      timestamp: "Maintenant",
    }]);
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
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ── LAYOUT STRATEGY ────────────────────────────────────────────────────
     Parent (<main>) is already flex-col h-screen overflow-hidden (set by
     DashboardLayout). CoachIAView itself is flex-col and fills all available
     height with flex-1. Internal structure:

       [header]           — shrink-0, never scrolls
       [messages]         — flex-1 overflow-y-auto  (the only scrollable zone)
       [chips bar]        — shrink-0
       [input bar]        — shrink-0, flush at bottom

     On mobile the bottom nav is fixed (z-40 h-14 ≈ 56 px). The input bar
     gets pb-14 on mobile to ensure it is never hidden behind that nav.
     On desktop there is no bottom nav so pb-0.
  ─────────────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-background overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between border-b border-border bg-card px-4 py-3 relative">
        {/* Left: logo + title */}
        <div className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="Boursio" className="h-7 w-7 object-contain shrink-0" />
          <h2 className="font-display text-sm font-bold text-foreground truncate">Coach IA</h2>
        </div>

        {/* Right: action buttons — use gap and min-w-0 to prevent overflow */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <button
            type="button"
            onClick={handleNewDiscussion}
            className="flex items-center gap-1 rounded-xl border border-border bg-secondary/80 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="hidden sm:inline">Nouvelle discussion</span>
            <span className="sm:hidden">Nouveau</span>
          </button>

          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className="flex items-center gap-1 rounded-xl border border-border bg-secondary/80 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
          >
            <History className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>Historique</span>
          </button>
        </div>

        {/* History dropdown — positioned absolutely inside header to avoid affecting layout */}
        {historyOpen && (
          <div className="absolute right-4 top-full mt-1 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-primary" /> Historique des discussions
              </h3>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Fermer
              </button>
            </div>
            {pastSessions.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">Aucune discussion enregistrée.</p>
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

      {/* ── Scrollable messages area ────────────────────────────── */}
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
                        <><Check className="h-3 w-3 text-emerald-500" /> Copié</>
                      ) : (
                        <><Copy className="h-3 w-3" /> Copier</>
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
                Le Coach IA prépare vos conseils...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Quick Action Chips ──────────────────────────────────── */}
      <div className="shrink-0 border-t border-border/50 bg-card/60 px-4 py-2">
        <div className="max-w-3xl mx-auto flex overflow-x-auto gap-2 scrollbar-none">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(action.prompt)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Icon className="h-3.5 w-3.5 text-primary" /> {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Input Bar ───────────────────────────────────────────────
           pb-16 on mobile = clears the fixed bottom nav (h ≈ 56px).
           On md+ screens there is no bottom nav so pb-0.
      ─────────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border bg-card px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:pb-3 mb-14 md:mb-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="max-w-3xl mx-auto flex gap-2 items-center"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Posez votre question au Coach IA..."
            className="flex-1 min-w-0 rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};
