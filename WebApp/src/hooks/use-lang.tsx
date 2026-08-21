import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Lang, translations } from "@/lib/i18n";

const STORAGE_KEY = "boursio-lang";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof translations;
};

const LangContext = createContext<LangContextValue | null>(null);

function getInitialLang(): Lang | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "fr" || stored === "en") return stored;
  return null; // null = not yet chosen
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = getInitialLang();
    if (stored) setLangState(stored);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

/** Returns true if the user has already chosen a language (stored in localStorage). */
export function hasChosenLang(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "fr" || localStorage.getItem(STORAGE_KEY) === "en";
}
