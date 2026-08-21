import React, { useState } from "react";
import { Bot, Send, Sparkles, User, Check, ArrowRight, CornerDownLeft } from "lucide-react";
import logo from "@/assets/logo.png";

interface AICoachInteractiveDemoProps {
  onLaunchApp?: () => void;
}

const PRESET_QUESTIONS = [
  {
    label: "Demande de Passeport Togo 🇹🇬",
    question: "Quelles sont les pièces et démarches pour un passeport togolais à la DGDN ?",
    answer:
      "Pour une première demande à la DGDN au Togo :\n- Certificat de nationalité original + duplicata légalisé\n- Certificat de naissance + CNI\n- Attestation de personne à prévenir légalisée\n- Preuve de profession (diplôme ou attestation)\n- 2 photos fond blanc + Quittance de 30.000 F CFA payée en ligne\n\nBoursio vous aide à vérifier tout votre dossier avant dépôt physique !",
  },
  {
    label: "Accroche Lettre Bourse Eiffel 🇫🇷",
    question: "Comment structurer mon paragraphe de motivation pour la bourse Eiffel ?",
    answer:
      "Pour la bourse Eiffel :\n1. Présentez votre projet d'études précis en France et son inscription dans les priorités de votre pays d'origine.\n2. Mettez en valeur votre rang/mention académique.\n3. Expliquez la plus-value de l'établissement français d'accueil.\n\nDans l'application Boursio, notre générateur IA rédige votre lettre intégrale en 30 secondes.",
  },
  {
    label: "Financement Bourse Canada 🇨🇦",
    question: "Existe-t-il des bourses d'exemption pour étudier au Québec ?",
    answer:
      "Oui ! Les bourses d'exemption des droits de scolarité majorés permettent aux étudiants internationaux de payer les mêmes frais que les étudiants québécois (économie de 15.000$ à 25.000$ CAD/an). Boursio identifie les universités partenaires éligibles.",
  },
];

export const AICoachInteractiveDemo: React.FC<AICoachInteractiveDemoProps> = ({ onLaunchApp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [customQA, setCustomQA] = useState<{ q: string; a: string } | null>(null);

  const activeQA = customQA || {
    q: PRESET_QUESTIONS[selectedIdx].question,
    a: PRESET_QUESTIONS[selectedIdx].answer,
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setCustomQA({
      q: customInput,
      a: `Merci pour votre question ! L'IA Boursio analyse les critères spécifiques pour "${customInput}". Dans l'application complète, notre Coach IA connecté aux bases officielles de plus de 50 pays vous fournit les démarches exactes, les formulaires téléchargeables et la relecture de vos écrits.`,
    });
    setCustomInput("");
  };

  return (
    <section className="relative py-24 sm:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Bot className="h-4 w-4" />
              <span>COACH IA ACADÉMIQUE 24H/24</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Un Expert Bourses & Visas dans votre Poche
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Entraîné sur les directives officielles des ambassades, des ministères et des programmes
              de bourses d'excellence, le Coach IA Boursio répond avec une précision chirurgicale à
              chacune de vos questions.
            </p>

            {/* Quick chips selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Essayez une question type :
              </span>
              <div className="flex flex-col gap-2">
                {PRESET_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomQA(null);
                      setSelectedIdx(idx);
                    }}
                    className={`text-left rounded-2xl border p-3 text-xs font-medium transition-all ${
                      !customQA && selectedIdx === idx
                        ? "border-primary bg-primary/10 font-bold text-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onLaunchApp}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-glow hover:opacity-90 transition-all"
            >
              <span>Discuter en direct avec le Coach IA</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right Live Interactive Mock Chat Window */}
          <div className="lg:col-span-7 rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 shadow-2xl space-y-4 relative overflow-hidden">
            {/* Window header bar */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 p-1">
                  <img src={logo} alt="IA" className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    Coach IA Boursio
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-muted-foreground">Expert bourses internationales</div>
                </div>
              </div>

              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-muted-foreground border border-border">
                Démo Live Active
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4 min-h-[260px] max-h-[360px] overflow-y-auto py-2">
              {/* User question */}
              <div className="flex gap-2.5 justify-end">
                <div className="max-w-md rounded-2xl bg-primary text-primary-foreground p-3.5 text-xs leading-relaxed font-medium shadow-sm">
                  {activeQA.q}
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary shrink-0 self-start">
                  <User className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-2.5 justify-start">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 p-0.5 shrink-0 self-start">
                  <img src={logo} alt="IA" className="h-5 w-5 object-contain" />
                </div>
                <div className="max-w-lg rounded-2xl border border-border bg-secondary/50 p-4 text-xs leading-relaxed text-foreground shadow-sm whitespace-pre-line">
                  {activeQA.a}
                </div>
              </div>
            </div>

            {/* Interactive Custom Query Input */}
            <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-border flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Posez n'importe quelle question sur vos bourses..."
                className="flex-1 rounded-xl border border-border bg-input px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-glow hover:opacity-90 shrink-0 inline-flex items-center gap-1"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tester</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
