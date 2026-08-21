import React, { useState, useEffect } from "react";
import { StudentProfile, Bourse } from "@/lib/types";
import { logoutUser, subscribeAuthState } from "@/lib/firebase-auth";
import { User } from "firebase/auth";
import { getProfileFromSupabase, saveProfileToSupabase, getUserLikedBourses } from "@/lib/supabase";
import { getAllBourses } from "@/lib/boursesData";
import { getUserSubscription } from "@/lib/subscription";
import { RecommandationsView } from "./RecommandationsView";
import { CoachIAView } from "./CoachIAView";
import { CandidaturesTrackerView } from "./CandidaturesTrackerView";
import { AlertesView } from "./AlertesView";
import { MentoratView } from "./MentoratView";
import { ProfileSetup } from "./ProfileSetup";
import { SettingsView } from "./SettingsView";
import { DocumentsView } from "./DocumentsView";
import { AuthModal } from "../auth/AuthModal";
import { PaymentModal } from "../subscription/PaymentModal";
import { PlanBadge } from "../subscription/PlanBadge";
import {
  Target,
  Bot,
  Bell,
  Users,
  User as UserIcon,
  Settings,
  LogOut,
  LogIn,
  LucideIcon,
  Folder,
  LayoutDashboard,
  ArrowLeft,
  Crown,
} from "lucide-react";
import logo from "@/assets/logo.png";

type Tab =
  | "recommandations"
  | "candidatures"
  | "coach"
  | "dossier"
  | "alertes"
  | "mentorat"
  | "profil"
  | "parametres";

interface DashboardLayoutProps {
  initialUser?: User | null;
  onBackToLanding?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ initialUser, onBackToLanding }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser || null);
  const [activeTab, setActiveTab] = useState<Tab>("recommandations");
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [likedBourseIds, setLikedBourseIds] = useState<string[]>([]);
  const [bourses, setBourses] = useState<Bourse[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [subscriptionState, setSubscriptionState] = useState(
    getUserSubscription(initialUser?.uid || "guest"),
  );

  useEffect(() => {
    const unsubscribe = subscribeAuthState((user) => {
      if (user) {
        setCurrentUser(user);
        getProfileFromSupabase(user.uid).then((prof) => {
          if (prof && prof.fullName) {
            setStudentProfile(prof);
          } else {
            // Check if there was a profile created in guest mode
            getProfileFromSupabase("guest").then((guestProf) => {
              if (guestProf && guestProf.fullName) {
                const userProf = { ...guestProf, userId: user.uid };
                saveProfileToSupabase(userProf);
                setStudentProfile(userProf);
              } else {
                setStudentProfile(null);
                setActiveTab("profil");
              }
            });
          }
        });
        getUserLikedBourses(user.uid).then(setLikedBourseIds);
      } else {
        setCurrentUser(null);
        // Load offline profile fallback
        getProfileFromSupabase("guest").then((cachedProf) => {
          if (cachedProf && cachedProf.fullName) {
            setStudentProfile(cachedProf);
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setBourses(getAllBourses());
  }, []);

  const userId = currentUser?.uid ?? "";

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setStudentProfile(null);
    setIsAuthModalOpen(true);
  };

  const likedBoursesList = bourses.filter((b) => likedBourseIds.includes(b.id));

  // Navigation items definition — shared between sidebar and bottom nav
  const NAV_ITEMS: { tab: Tab; label: string; Icon: LucideIcon; badge?: React.ReactNode }[] = [
    {
      tab: "recommandations",
      label: "Recommandations",
      Icon: Target,
      badge: (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-bold">
          {bourses.length}
        </span>
      ),
    },
    {
      tab: "candidatures",
      label: "Candidatures",
      Icon: LayoutDashboard,
      badge: (
        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-500">
          Suivi
        </span>
      ),
    },
    { tab: "coach", label: "Coach IA", Icon: Bot },
    { tab: "dossier", label: "Mon Dossier", Icon: Folder },
    {
      tab: "alertes",
      label: "Alertes",
      Icon: Bell,
      badge:
        likedBourseIds.length > 0 ? (
          <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-500">
            {likedBourseIds.length}
          </span>
        ) : undefined,
    },
    { tab: "mentorat", label: "Mentorat", Icon: Users },
    {
      tab: "profil",
      label: "Profil",
      Icon: UserIcon,
      badge: studentProfile ? (
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      ) : (
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      ),
    },
    { tab: "parametres", label: "Paramètres", Icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col justify-between border-r border-border bg-card p-6 shrink-0 z-30">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Boursio Logo" className="h-9 w-9 object-contain" />
                <div>
                  <span className="font-display text-xl font-bold tracking-tight text-foreground">Boursio</span>
                  <span className="block text-[10px] font-semibold text-primary uppercase tracking-wider">
                    Bourses & Orientation
                  </span>
                </div>
              </div>
            </div>

            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="w-full flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/40 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Retour au site vitrine
              </button>
            )}
          </div>

          {/* Nav Links */}
          <nav className="space-y-1 pt-2">
            {NAV_ITEMS.map(({ tab, label, Icon, badge }) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? "text-white" : "text-primary"}`} />
                    {label}
                  </div>
                  {badge && badge}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Subscription */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <PlanBadge
              plan={subscriptionState.plan}
              showUpgradeBtn={subscriptionState.plan === "free"}
              onUpgradeClick={() => setIsPaymentModalOpen(true)}
            />
          </div>

          {currentUser ? (
            <div className="rounded-xl border border-border bg-secondary/50 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold text-sm overflow-hidden shrink-0">
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

      {/* Main Content Area */}
      {activeTab === "coach" ? (
        <main className="flex flex-col flex-1 md:ml-64 h-screen overflow-hidden">
          <CoachIAView studentProfile={studentProfile} />
        </main>
      ) : (
        <main className="flex-1 md:ml-64 overflow-y-auto h-screen p-4 sm:p-6 md:p-8 pb-20 md:pb-8">
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

          {activeTab === "candidatures" && (
            <CandidaturesTrackerView
              userId={userId}
              likedBourses={likedBoursesList}
              onOpenCoach={() => setActiveTab("coach")}
            />
          )}

          {activeTab === "dossier" && (
            <DocumentsView
              userId={userId}
              studentProfile={studentProfile}
              onOpenProfileSetup={() => setActiveTab("profil")}
            />
          )}

          {activeTab === "alertes" && (
            <AlertesView userId={userId} likedBourses={likedBoursesList} />
          )}

          {activeTab === "mentorat" && (
            <MentoratView userId={userId} studentProfile={studentProfile} />
          )}

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

          {activeTab === "parametres" && (
            <SettingsView
              currentUser={currentUser}
              studentProfile={studentProfile}
              onLogout={handleLogout}
              onLoginClick={() => setIsAuthModalOpen(true)}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            />
          )}
        </main>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md justify-around px-1 py-1.5">
        {NAV_ITEMS.map(({ tab, label, Icon }) => {
          const active = activeTab === tab;
          const shortLabel =
            tab === "recommandations" ? "Match" :
            tab === "candidatures" ? "Suivi" :
            tab === "parametres" ? "Params" :
            label;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative flex flex-col items-center gap-0.5 px-1 py-1 text-[9px] font-medium transition-colors ${
                active ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
              {shortLabel}
              {tab === "alertes" && likedBourseIds.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500" />
              )}
              {tab === "profil" && !studentProfile && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        userId={userId || "guest"}
        initialPlan="max"
        onPaymentSuccess={(plan) => {
          setSubscriptionState(getUserSubscription(userId || "guest"));
          setIsPaymentModalOpen(false);
        }}
      />
    </div>
  );
};
