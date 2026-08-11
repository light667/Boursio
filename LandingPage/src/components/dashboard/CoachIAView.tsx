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

export const CoachIAView: React.FC<CoachIAViewProps> = ({ studentProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: `Bonjour ${
        studentProfile?.fullName ? studentProfile.fullName : "étudiant"
      } ! Je suis votre Coach IA Boursio.\n\nJe suis là pour vous accompagner dans votre projet d'études internationales :\n• Rédaction et optimisation de votre CV académique\n• Structuration de vos Lettres de Motivation\n• Demande de Lettres de Recommandation à vos professeurs\n• Préparation aux entretiens de bourses\n• Démarches administratives : Passeport & Visa\n• Conseils pratiques pour la vie étudiante à l'étranger\n\nQue souhaitez-vous travailler aujourd'hui ?`,
      timestamp: "Maintenant",
    },
  ]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [pastSessions, setPastSessions] = useState<{ id: string; title: string; date: string }[]>([]);
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

  const handleNewDiscussion = () => {
    // Save current session summary to history if messages > 1
    if (messages.length > 1) {
      const firstUserMsg = messages.find((m) => m.sender === "user");
      const title = firstUserMsg ? firstUserMsg.text.slice(0, 30) + "..." : "Discussion précédente";
      setPastSessions((prev) => [
        { id: Date.now().toString(), title, date: new Date().toLocaleDateString() },
        ...prev,
      ]);
    }

    setMessages([
      {
        id: Date.now().toString(),
        sender: "ai",
        text: "Nouvelle discussion démarrée. En quoi puis-je vous aider ?",
        timestamp: "Maintenant",
      },
    ]);
  };

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

    try {
      const aiResponseText = await generateAICoachResponse(text, studentProfile);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Coach Generation error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col -m-4 sm:-m-6 md:-m-8 bg-background relative overflow-hidden">
      {/* Top Fixed Header - Dedicated Chat Bar */}
      <div className="flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Boursio" className="h-8 w-8 object-contain shrink-0" />
          <h2 className="font-display text-base font-bold text-foreground">
            Coach IA
          </h2>
        </div>

        {/* Action Buttons: New Chat & History */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewDiscussion}
            className="rounded-xl border border-border bg-secondary/80 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary flex items-center gap-1.5 transition-colors"
          >
            <Plus className="h-4 w-4 text-primary" /> Nouvelle discussion
          </button>

          <button
            type="button"
            onClick={() => setHistoryOpen(!historyOpen)}
            className="rounded-xl border border-border bg-secondary/80 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary flex items-center gap-1.5 transition-colors"
          >
            <History className="h-4 w-4 text-muted-foreground" /> Historique
          </button>
        </div>
      </div>

      {/* History Drawer Modal */}
      {historyOpen && (
        <div className="absolute right-4 top-16 z-30 w-72 rounded-2xl border border-border bg-card p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-display text-xs font-bold text-foreground flex items-center gap-1.5">
              <History className="h-4 w-4 text-primary" /> Historique des discussions
            </h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Fermer
            </button>
          </div>

          {pastSessions.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Aucune ancienne discussion enregistrée.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-2 rounded-xl p-2.5 text-xs hover:bg-secondary cursor-pointer transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="truncate flex-1">
                    <div className="font-medium text-foreground truncate">{session.title}</div>
                    <div className="text-[10px] text-muted-foreground">{session.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages Full Screen Scroll Viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 p-1">
                <img src={logo} alt="IA" className="h-6 w-6 object-contain" />
              </div>
            )}

            <div
              className={`group relative max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "border border-border bg-card text-foreground shadow-sm"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Timestamp & Copy Button */}
              <div className="mt-2 flex items-center justify-between text-[10px] opacity-70 border-t border-border/30 pt-1.5">
                <span>{msg.timestamp}</span>
                {msg.sender === "ai" && (
                  <button
                    type="button"
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="hover:opacity-100 flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" /> Copié
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground font-bold text-xs">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 p-1">
              <img src={logo} alt="IA" className="h-6 w-6 object-contain animate-pulse" />
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground flex items-center gap-2 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-primary animate-ping" /> Le Coach IA prépare vos conseils personnalisés...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Chips Bar */}
      <div className="border-t border-border/50 bg-card/60 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex overflow-x-auto gap-2 scrollbar-none">
          {quickActions.map((action, idx) => {
            const IconComp = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(action.prompt)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground"
              >
                <IconComp className="h-3.5 w-3.5 text-primary" /> {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Message Fixed Bottom Bar */}
      <div className="border-t border-border bg-card px-4 py-3 sticky bottom-0 z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-4xl mx-auto flex gap-3 items-center"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Posez votre question au Coach IA..."
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
    </div>
  );
};
