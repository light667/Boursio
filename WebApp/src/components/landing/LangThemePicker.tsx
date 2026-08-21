import { useState } from "react";
import { useLang } from "@/hooks/use-lang";
import { useTheme } from "@/components/theme-provider";
import type { Lang } from "@/lib/i18n";
import logo from "@/assets/logo.png";

interface LangThemePickerProps {
  onContinue: () => void;
}

export function LangThemePicker({ onContinue }: LangThemePickerProps) {
  const { lang, setLang, t } = useLang();
  const { theme, setTheme } = useTheme();

  // Local state so the picker updates immediately before we commit
  const [selectedLang, setSelectedLang] = useState<Lang>(lang);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">(theme);

  // Preview theme on hover/select
  const applyPreview = (th: "light" | "dark") => {
    setSelectedTheme(th);
    setTheme(th);
  };

  const handleContinue = () => {
    setLang(selectedLang);
    setTheme(selectedTheme);
    onContinue();
  };

  // Use the picker copy of the currently-selected language for labels
  const pk = t.picker[selectedLang];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #0047AB 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full opacity-[0.05] blur-[80px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #00c9a7 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Card */}
        <div className="glass rounded-3xl border border-border/60 p-8 sm:p-10 shadow-[0_8px_60px_rgba(0,71,171,0.12)] flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={logo}
              alt="Boursio"
              className="h-14 w-14 object-contain rounded-2xl shadow-glow"
            />
            <span className="font-display font-bold text-2xl text-foreground tracking-tight">
              Boursio
            </span>
          </div>

          {/* Welcome text (bilingual on picker) */}
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-2">
              {pk.welcome}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              {pk.sub}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border/60" />

          {/* Language selection */}
          <div className="w-full">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
              {pk.langLabel}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { code: "fr" as Lang, flag: "🇫🇷", label: "Français" },
                  { code: "en" as Lang, flag: "🇬🇧", label: "English" },
                ] as const
              ).map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => setSelectedLang(option.code)}
                  className={`relative flex items-center justify-center gap-2.5 h-14 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    selectedLang === option.code
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border bg-card/60 text-foreground hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <span className="text-xl">{option.flag}</span>
                  <span>{option.label}</span>
                  {selectedLang === option.code && (
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme selection */}
          <div className="w-full">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
              {pk.themeLabel}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  {
                    value: "light" as const,
                    icon: "☀️",
                    labelKey: "light" as const,
                  },
                  {
                    value: "dark" as const,
                    icon: "🌙",
                    labelKey: "dark" as const,
                  },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => applyPreview(option.value)}
                  className={`relative flex items-center justify-center gap-2.5 h-14 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    selectedTheme === option.value
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border bg-card/60 text-foreground hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span>{pk[option.labelKey]}</span>
                  {selectedTheme === option.value && (
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full h-13 gradient-cta text-white font-bold text-base rounded-2xl shadow-glow hover:shadow-glow-strong hover:scale-[1.02] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{ height: "52px" }}
          >
            {pk.cta} →
          </button>
        </div>
      </div>
    </div>
  );
}
