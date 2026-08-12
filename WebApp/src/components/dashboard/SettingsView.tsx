import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { StudentProfile } from "@/lib/types";
import { User as FirebaseUser } from "firebase/auth";
import {
  Sun,
  Moon,
  Globe,
  User,
  Shield,
  Bell,
  Download,
  Trash2,
  ExternalLink,
  LogOut,
  LogIn,
  Check,
  Mail,
  Key,
  HelpCircle,
  Info,
} from "lucide-react";
import logo from "@/assets/logo.png";

interface SettingsViewProps {
  currentUser: FirebaseUser | null;
  studentProfile: StudentProfile | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

type Language = "fr" | "en";

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  studentProfile,
  onLogout,
  onLoginClick,
}) => {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem("boursio-language") as Language) || "fr",
  );
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [clearCacheSuccess, setClearCacheSuccess] = useState(false);

  const t = {
    fr: {
      title: "Paramètres",
      subtitle:
        "Gérez l'apparence, la langue, vos données personnelles et préférences de notification.",
      appearance: "Apparence & Thème",
      appearanceDesc: "Choisissez le mode d'affichage préféré.",
      lightMode: "Mode Clair",
      lightModeDefault: "(Par défaut)",
      darkMode: "Mode Sombre",
      language: "Langue de l'Application",
      languageDesc: "Sélectionnez la langue d'affichage de l'interface.",
      account: "Compte & Sécurité",
      emailLabel: "Adresse E-mail",
      statusLabel: "Statut du Profil",
      statusIncomplete: "Incomplet — Complétez votre profil",
      resetPassword: "Réinitialiser le mot de passe",
      resetEmailSent: "E-mail envoyé !",
      logout: "Déconnexion",
      login: "Se connecter / S'inscrire",
      notifications: "Notifications",
      emailNotifs: "Alertes e-mail de bourses",
      pushNotifs: "Notifications push mobile",
      frequency: "Fréquence de rappel",
      daily: "Quotidien",
      weekly: "Hebdomadaire",
      data: "Données & Cache",
      exportData: "Exporter mes données (JSON)",
      clearCache: "Vider le cache local",
      about: "À propos & Légal",
      aboutBoursio: "À propos de Boursio",
      privacy: "Confidentialité",
      legal: "Mentions Légales",
      terms: "Conditions (CGU)",
      version: "Boursio Web App v1.0.0",
      support: "Support : contact@boursio.app",
    },
    en: {
      title: "Settings",
      subtitle: "Manage your appearance, language, personal data and notification preferences.",
      appearance: "Appearance & Theme",
      appearanceDesc: "Choose your preferred display mode.",
      lightMode: "Light Mode",
      lightModeDefault: "(Default)",
      darkMode: "Dark Mode",
      language: "Application Language",
      languageDesc: "Select the interface display language.",
      account: "Account & Security",
      emailLabel: "Email Address",
      statusLabel: "Profile Status",
      statusIncomplete: "Incomplete — Complete your profile",
      resetPassword: "Reset password",
      resetEmailSent: "Email sent!",
      logout: "Log out",
      login: "Sign in / Sign up",
      notifications: "Notifications",
      emailNotifs: "Scholarship email alerts",
      pushNotifs: "Mobile push notifications",
      frequency: "Reminder frequency",
      daily: "Daily",
      weekly: "Weekly",
      data: "Data & Cache",
      exportData: "Export my data (JSON)",
      clearCache: "Clear local cache",
      about: "About & Legal",
      aboutBoursio: "About Boursio",
      privacy: "Privacy Policy",
      legal: "Legal Notice",
      terms: "Terms of Service",
      version: "Boursio Web App v1.0.0",
      support: "Support: contact@boursio.app",
    },
  };

  const lang = t[language];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("boursio-language", lang);
  };

  const handleSendResetPassword = () => {
    setResetEmailSent(true);
    setTimeout(() => setResetEmailSent(false), 4000);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(
      {
        user: currentUser ? { uid: currentUser.uid, email: currentUser.email } : null,
        profile: studentProfile,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    );
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `boursio-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearCache = () => {
    ["boursio_user_profile", "boursio_user_likes", "boursio_user_notifications"].forEach((k) =>
      localStorage.removeItem(k),
    );
    setClearCacheSuccess(true);
    setTimeout(() => setClearCacheSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Boursio" className="h-10 w-10 object-contain shrink-0" />
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              {lang.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{lang.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 1. Apparence */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Sun className="h-4 w-4 text-primary" /> {lang.appearance}
          </h2>
          <p className="text-xs text-muted-foreground">{lang.appearanceDesc}</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-5 w-5" />
              {lang.lightMode}
              <span className="text-[10px] opacity-70">{lang.lightModeDefault}</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-5 w-5" />
              {lang.darkMode}
            </button>
          </div>
        </div>

        {/* 2. Langue */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> {lang.language}
          </h2>
          <p className="text-xs text-muted-foreground">{lang.languageDesc}</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLanguageChange("fr")}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                language === "fr"
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-2xl">🇫🇷</span>
              Français
              {language === "fr" && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>

            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                language === "en"
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-2xl">🇬🇧</span>
              English
              {language === "en" && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          </div>

          {language === "en" && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              Full English translation coming soon. Some elements may remain in French.
            </div>
          )}
        </div>

        {/* 3. Compte & Sécurité — full width */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4 md:col-span-2">
          <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> {lang.account}
          </h2>

          {currentUser ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" /> {lang.emailLabel}
                  </div>
                  <div className="text-sm font-bold text-foreground truncate">
                    {currentUser?.email || "—"}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" /> {lang.statusLabel}
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {studentProfile
                      ? `${studentProfile.fullName} · ${studentProfile.studyLevel}`
                      : lang.statusIncomplete}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSendResetPassword}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Key className="h-4 w-4 text-primary" /> {lang.resetPassword}
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> {lang.logout}
                </button>

                {resetEmailSent && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium py-2.5">
                    <Check className="h-4 w-4" /> {lang.resetEmailSent}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-sm text-muted-foreground text-center">
                {language === "fr"
                  ? "Connectez-vous pour accéder aux paramètres de votre compte."
                  : "Sign in to access your account settings."}
              </p>
              <button
                type="button"
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-90"
              >
                <LogIn className="h-4 w-4" /> {lang.login}
              </button>
            </div>
          )}
        </div>

        {/* 4. Notifications */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> {lang.notifications}
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <label className="text-xs text-foreground cursor-pointer">{lang.emailNotifs}</label>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-border/50">
              <label className="text-xs text-foreground cursor-pointer">{lang.pushNotifs}</label>
              <input
                type="checkbox"
                checked={pushAlerts}
                onChange={(e) => setPushAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-border/50">
              <label className="text-xs text-foreground">{lang.frequency}</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
                className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="daily">{lang.daily}</option>
                <option value="weekly">{lang.weekly}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5. Données & Cache */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" /> {lang.data}
          </h2>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleExportData}
              className="w-full flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" /> {lang.exportData}
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={handleClearCache}
              className="w-full flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-destructive" /> {lang.clearCache}
              </span>
              {clearCacheSuccess && <Check className="h-4 w-4 text-emerald-500" />}
            </button>
          </div>
        </div>

        {/* 6. À propos & Liens Légaux — full width */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4 md:col-span-2">
          <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" /> {lang.about}
          </h2>

          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { href: "/about.html", label: lang.aboutBoursio },
              { href: "/privacy.html", label: lang.privacy },
              { href: "/legal.html", label: lang.legal },
              { href: "/terms.html", label: lang.terms },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-3 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                {link.label}
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 pt-3 border-t border-border text-xs text-muted-foreground">
            <span>{lang.version}</span>
            <span>{lang.support}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
