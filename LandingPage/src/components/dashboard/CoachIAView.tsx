import React, { useState, useRef, useEffect } from "react";
import { StudentProfile } from "@/lib/types";
import { generateAICoachResponse } from "@/lib/llm";
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
      } ! Je suis votre Coach IA Boursio. 🎓\n\nJe suis propulsé par les derniers modèles LLM (Groq Llama 3.3 70B, Mistral, Gemini) pour vous accompagner à 100% dans votre aventure d'études internationales :\n• Rédaction de CV & Lettres de Motivation percutantes\n• Stratégies pour obtenir vos Lettres de Recommandation\n• Simulation d'entretiens de bourse\n• Démarches de Passeport & Demandes de Visa\n• Conseils pour la Vie Étudiante à l'étranger\n\nQue souhaitez-vous préparer aujourd'hui ?`,
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
    <div className="flex h-[calc(100vh-140px)] flex-col rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-accent shadow-glow">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              Coach IA Boursio <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent border border-accent/30">Groq / Mistral / Gemini Active</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Assistant intelligent connecté aux meilleurs modèles LLM & RAG
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
  );
};
