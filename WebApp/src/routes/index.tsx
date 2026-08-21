import { useState, useEffect } from "react";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { AcceptanceSimulator } from "@/components/landing/AcceptanceSimulator";
import { ScholarshipExplorerDemo } from "@/components/landing/ScholarshipExplorerDemo";
import { Features } from "@/components/landing/features";
import { AICoachInteractiveDemo } from "@/components/landing/AICoachInteractiveDemo";
import { Testimonials } from "@/components/landing/Testimonials";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Roadmap } from "@/components/landing/roadmap";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { LangThemePicker } from "@/components/landing/LangThemePicker";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PaymentModal } from "@/components/subscription/PaymentModal";
import { SubscriptionPlan } from "@/lib/types";
import { hasChosenLang } from "@/hooks/use-lang";

export function Landing() {
  const [viewMode, setViewMode] = useState<"picker" | "landing" | "dashboard">("landing");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan>("max");

  // On mount, check if this is a first visit (no language chosen yet)
  useEffect(() => {
    if (!hasChosenLang()) {
      setViewMode("picker");
    }
  }, []);

  const handlePickerContinue = () => setViewMode("landing");
  const handleLaunchApp = () => setViewMode("dashboard");
  const handleBackToLanding = () => setViewMode("landing");

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan === "free") {
      setViewMode("dashboard");
    } else {
      setSelectedPlanForPayment(plan);
      setPaymentModalOpen(true);
    }
  };

  if (viewMode === "picker") {
    return <LangThemePicker onContinue={handlePickerContinue} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {viewMode === "dashboard" ? (
        <DashboardLayout onBackToLanding={handleBackToLanding} />
      ) : (
        <>
          {/* Site vitrine */}
          <Nav onLaunchApp={handleLaunchApp} />
          <main>
            <Hero onLaunchApp={handleLaunchApp} />
            <AcceptanceSimulator onLaunchApp={handleLaunchApp} />
            <ScholarshipExplorerDemo onLaunchApp={handleLaunchApp} />
            <Features />
            <AICoachInteractiveDemo onLaunchApp={handleLaunchApp} />
            {/*<Testimonials />*/}
            <HowItWorks />
            <Roadmap />
            <Pricing
              onLaunchApp={handleLaunchApp}
              onSelectPlan={handleSelectPlan}
            />
            <FAQ />
            <Contact />
          </main>
          <Footer />

          {/* Payment Checkout Modal */}
          <PaymentModal
            isOpen={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            userId="guest"
            initialPlan={selectedPlanForPayment}
            onPaymentSuccess={() => {
              setPaymentModalOpen(false);
              setViewMode("dashboard");
            }}
          />
        </>
      )}
    </div>
  );
}
