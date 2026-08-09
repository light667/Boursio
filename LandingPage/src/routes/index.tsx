import { useState } from "react";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Roadmap } from "@/components/landing/roadmap";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Sparkles, LayoutDashboard, Globe } from "lucide-react";

export function Landing() {
  const [viewMode, setViewMode] = useState<"landing" | "dashboard">("dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Floating Toggle Bar between Landing Page & App Platform */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-full border border-primary/30 bg-card/90 p-1.5 backdrop-blur-lg shadow-glow">
        <button
          onClick={() => setViewMode("landing")}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
            viewMode === "landing"
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="h-3.5 w-3.5" /> Site Vitrine
        </button>

        <button
          onClick={() => setViewMode("dashboard")}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
            viewMode === "dashboard"
              ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-glow"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" /> App Dashboard IA
        </button>
      </div>

      {viewMode === "dashboard" ? (
        <DashboardLayout />
      ) : (
        <>
          {/* Full-width fixed navigation bar */}
          <Nav />
          <main>
            <div onClick={() => setViewMode("dashboard")}>
              <Hero />
            </div>
            <Features />
            <HowItWorks />
            <Roadmap />
            <Pricing />
            <FAQ />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}