import React, { useState, useEffect } from "react";
import { StudentProfile, Bourse } from "@/lib/types";
import { logoutUser } from "@/lib/firebase-auth";
import { getProfileFromSupabase, getUserLikedBourses } from "@/lib/supabase";
import { getAllBourses } from "@/lib/boursesData";
import { RecommandationsView } from "./RecommandationsView";
import { CoachIAView } from "./CoachIAView";
import { AlertesView } from "./AlertesView";
import { MentoratView } from "./MentoratView";
import { ProfileSetup } from "./ProfileSetup";
import { AuthModal } from "../auth/AuthModal";
import {
  Sparkles,
  Bot,
  Bell,
  Users,
  User,
  LogOut,
  LogIn,
  Heart,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";

interface DashboardLayoutProps {
  initialUser?: any;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ initialUser }) => {
  const [currentUser, setCurrentUser] = useState<any>(initialUser || null);
  const [activeTab, setActiveTab] = useState<"recommandations" | "coach" | "alertes" | "mentorat" | "profil">(
    "recommandations"
  );
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [likedBourseIds, setLikedBourseIds] = useState<string[]>([]);
  const [bourses, setBourses] = useState<Bourse[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userId = currentUser ? currentUser.uid : "demo-student-123";

  // Load scholarships & user data
  useEffect(() => {
    const data = getAllBourses();
    setBourses(data);

    getProfileFromSupabase(userId).then((prof) => {
      if (prof) setStudentProfile(prof);
    });

    getUserLikedBourses(userId).then(setLikedBourseIds);
  }, [userId]);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setStudentProfile(null);
  };

  const likedBoursesList = bourses.filter((b) => likedBourseIds.includes(b.id));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* ─── Desktop Sidebar Navigation ─────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-border bg-card p-6 shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Boursio Logo" className="h-9 w-auto" />
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Boursio
              </span>
              <span className="block text-[10px] font-semibold text-accent uppercase tracking-wider">
                IA & Bourses d'Études
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            <button
              onClick={() => setActiveTab("recommandations")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "recommandations"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-accent" /> Recommandations
              </div>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] text-accent">
                {bourses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("coach")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "coach"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bot className="h-4 w-4 text-accent" /> Coach IA
              </div>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                RAG
              </span>
            </button>

            <button
              onClick={() => setActiveTab("alertes")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "alertes"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-accent" /> Alertes & Deadlines
              </div>
              {likedBourseIds.length > 0 && (
                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                  {likedBourseIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("mentorat")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "mentorat"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-accent" /> Mentorat Humain
              </div>
            </button>

            <button
              onClick={() => setActiveTab("profil")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "profil"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-accent" /> Mon Profil Étudiant
              </div>
              {studentProfile ? (
                <span className="h-2 w-2 rounded-full bg-accent" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-amber-400" />
              )}
            </button>
          </nav>
        </div>

        {/* User Card & Logout / Login */}
        <div className="border-t border-border pt-4 space-y-3">
          {currentUser ? (
            <div className="rounded-xl border border-border bg-secondary/50 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-accent font-bold text-sm">
                  {studentProfile?.fullName ? studentProfile.fullName.charAt(0) : "E"}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-foreground truncate">
                    {studentProfile?.fullName || currentUser.email || "Étudiant Boursio"}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {studentProfile?.studyLevel || "Compte Activé"}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-3.5 w-3.5" /> Déconnexion
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 py-3 text-xs font-semibold text-white shadow-glow hover:opacity-90"
            >
              <LogIn className="h-4 w-4" /> Se connecter / S'inscrire
            </button>
          )}
        </div>
      </aside>

      {/* ─── Mobile Header Top Navigation ──────────────────────────────── */}
      <header className="flex md:hidden items-center justify-between border-b border-border bg-card px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-7 w-auto" />
          <span className="font-display text-lg font-bold text-foreground">Boursio</span>
        </div>

        <div className="flex items-center gap-2">
          {!currentUser && (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white"
            >
              Connexion
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-border p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card p-4 space-y-2 animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              setActiveTab("recommandations");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-lg p-2.5 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <Sparkles className="h-4 w-4 text-accent" /> Recommandations ({bourses.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("coach");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-lg p-2.5 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <Bot className="h-4 w-4 text-accent" /> Coach IA Assistant
          </button>

          <button
            onClick={() => {
              setActiveTab("alertes");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-lg p-2.5 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <Bell className="h-4 w-4 text-accent" /> Alertes & Notifications
          </button>

          <button
            onClick={() => {
              setActiveTab("mentorat");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-lg p-2.5 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <Users className="h-4 w-4 text-accent" /> Mentorat Humain
          </button>

          <button
            onClick={() => {
              setActiveTab("profil");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-lg p-2.5 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <User className="h-4 w-4 text-accent" /> Mon Profil Étudiant
          </button>
        </div>
      )}

      {/* ─── Main Content Viewport ─────────────────────────────────────── */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 mb-16 md:mb-0 overflow-y-auto max-w-7xl">
        {activeTab === "recommandations" && (
          <RecommandationsView
            bourses={bourses}
            studentProfile={studentProfile}
            likedBourseIds={likedBourseIds}
            userId={userId}
            onUpdateLikes={setLikedBourseIds}
            onOpenProfileSetup={() => setActiveTab("profil")}
          />
        )}

        {activeTab === "coach" && <CoachIAView studentProfile={studentProfile} />}

        {activeTab === "alertes" && (
          <AlertesView userId={userId} likedBourses={likedBoursesList} />
        )}

        {activeTab === "mentorat" && <MentoratView />}

        {activeTab === "profil" && (
          <ProfileSetup
            userId={userId}
            initialProfile={studentProfile}
            onProfileSaved={(prof) => {
              setStudentProfile(prof);
              setActiveTab("recommandations");
            }}
          />
        )}
      </main>

      {/* ─── Mobile Bottom Navigation Bar ──────────────────────────────── */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md px-2 py-2 justify-around">
        <button
          onClick={() => setActiveTab("recommandations")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "recommandations" ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Sparkles className="h-5 w-5" /> Match
        </button>

        <button
          onClick={() => setActiveTab("coach")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "coach" ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Bot className="h-5 w-5" /> Coach IA
        </button>

        <button
          onClick={() => setActiveTab("alertes")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium relative ${
            activeTab === "alertes" ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Bell className="h-5 w-5" /> Alertes
          {likedBourseIds.length > 0 && (
            <span className="absolute -top-1 right-2 h-2 w-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("mentorat")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "mentorat" ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Users className="h-5 w-5" /> Mentors
        </button>

        <button
          onClick={() => setActiveTab("profil")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "profil" ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <User className="h-5 w-5" /> Profil
        </button>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(usr) => {
          setCurrentUser(usr);
          getProfileFromSupabase(usr.uid).then((prof) => {
            if (prof) setStudentProfile(prof);
          });
        }}
      />
    </div>
  );
};
