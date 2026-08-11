import React, { useState, useEffect } from "react";
import { StudentProfile, Bourse } from "@/lib/types";
import { logoutUser, subscribeAuthState } from "@/lib/firebase-auth";
import { getProfileFromSupabase, getUserLikedBourses } from "@/lib/supabase";
import { getAllBourses } from "@/lib/boursesData";
import { RecommandationsView } from "./RecommandationsView";
import { CoachIAView } from "./CoachIAView";
import { AlertesView } from "./AlertesView";
import { MentoratView } from "./MentoratView";
import { ProfileSetup } from "./ProfileSetup";
import { AuthModal } from "../auth/AuthModal";
import {
  Target,
  Bot,
  Bell,
  Users,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import logo from "@/assets/logo.png";

interface DashboardLayoutProps {
  initialUser?: any;
  onBackToLanding?: () => void;
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

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeAuthState((user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch profile from Supabase for authenticated user
        getProfileFromSupabase(user.uid).then((prof) => {
          if (prof && prof.fullName) {
            setStudentProfile(prof);
          } else {
            // If profile does not exist yet, force user to complete profile first
            setStudentProfile(null);
            setActiveTab("profil");
          }
        });
        getUserLikedBourses(user.uid).then(setLikedBourseIds);
      } else {
        setCurrentUser(null);
        setStudentProfile(null);
        // If not logged in, prompt login modal
        setIsAuthModalOpen(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load active scholarships
  useEffect(() => {
    const data = getAllBourses();
    setBourses(data);
  }, []);

  const userId = currentUser ? currentUser.uid : "";

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setStudentProfile(null);
    setIsAuthModalOpen(true);
  };

  const likedBoursesList = bourses.filter((b) => likedBourseIds.includes(b.id));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* ─── Desktop Fixed Left Sidebar Navigation ────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col justify-between border-r border-border bg-card p-6 shrink-0 z-30">
        <div className="space-y-6">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Boursio Logo" className="h-9 w-9 object-contain" />
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Boursio
              </span>
              <span className="block text-[10px] font-semibold text-primary uppercase tracking-wider">
                Bourses & Orientation
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("recommandations")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "recommandations"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-primary" /> Recommandations
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-bold">
                {bourses.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("coach")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "coach"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bot className="h-4 w-4 text-primary" /> Coach IA
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("alertes")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "alertes"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-primary" /> Alertes
              </div>
              {likedBourseIds.length > 0 && (
                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                  {likedBourseIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("mentorat")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "mentorat"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-primary" /> Mentorat
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profil")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                activeTab === "profil"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-primary" /> Profil
              </div>
              {studentProfile ? (
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          </nav>
        </div>

        {/* User Card & Logout / Login */}
        <div className="border-t border-border pt-4 space-y-3">
          {currentUser ? (
            <div className="rounded-xl border border-border bg-secondary/50 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold text-sm overflow-hidden">
                  {studentProfile?.photoUrl ? (
                    <img src={studentProfile.photoUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : studentProfile?.fullName ? (
                    studentProfile.fullName.charAt(0).toUpperCase()
                  ) : (
                    "E"
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-foreground truncate">
                    {studentProfile?.fullName || currentUser.email || "Étudiant Boursio"}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {studentProfile?.studyLevel || "Profil en cours"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-3.5 w-3.5" /> Déconnexion
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 py-3 text-xs font-semibold text-white shadow-glow hover:opacity-90"
            >
              <LogIn className="h-4 w-4" /> Se connecter / S'inscrire
            </button>
          )}
        </div>
      </aside>

      {/* ─── Main Right Scroll Viewport (Desktop ml-64, Mobile full width with bottom nav) ─ */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 mb-16 md:mb-0 overflow-y-auto max-w-7xl h-screen">
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
          type="button"
          onClick={() => setActiveTab("recommandations")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "recommandations" ? "text-primary font-bold" : "text-muted-foreground"
          }`}
        >
          <Target className="h-5 w-5" /> Match
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("coach")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "coach" ? "text-primary font-bold" : "text-muted-foreground"
          }`}
        >
          <Bot className="h-5 w-5" /> Coach IA
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("alertes")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium relative ${
            activeTab === "alertes" ? "text-primary font-bold" : "text-muted-foreground"
          }`}
        >
          <Bell className="h-5 w-5" /> Alertes
          {likedBourseIds.length > 0 && (
            <span className="absolute -top-1 right-2 h-2 w-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mentorat")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "mentorat" ? "text-primary font-bold" : "text-muted-foreground"
          }`}
        >
          <Users className="h-5 w-5" /> Mentorat
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profil")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "profil" ? "text-primary font-bold" : "text-muted-foreground"
          }`}
        >
          <User className="h-5 w-5" /> Profil
        </button>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(usr, mode) => {
          setCurrentUser(usr);
          setIsAuthModalOpen(false);
          getProfileFromSupabase(usr.uid).then((prof) => {
            if (mode === "register" || !prof || !prof.fullName) {
              setStudentProfile(prof);
              setActiveTab("profil");
            } else {
              setStudentProfile(prof);
              setActiveTab("recommandations");
            }
          });
        }}
      />
    </div>
  );
};
