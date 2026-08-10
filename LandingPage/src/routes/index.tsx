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

export function Landing() {
  const [viewMode, setViewMode] = useState<"landing" | "dashboard">("landing");

  const handleLaunchApp = () => setViewMode("dashboard");
  const handleBackToLanding = () => setViewMode("landing");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {viewMode === "dashboard" ? (
        <DashboardLayout onBackToLanding={handleBackToLanding} />
      ) : (
        <>
          {/* Site vitrine — identique à l'original */}
          <Nav onLaunchApp={handleLaunchApp} />
          <main>
            <Hero onLaunchApp={handleLaunchApp} />
            <Features />
            <HowItWorks />
            <Roadmap />
            <Pricing onLaunchApp={handleLaunchApp} />
            <FAQ />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}