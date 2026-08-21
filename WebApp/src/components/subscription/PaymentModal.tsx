import React, { useState } from "react";
import { SubscriptionPlan, PaymentMethod } from "@/lib/types";
import {
  PLANS_CONFIG,
  PAYMENT_METHODS_CONFIG,
  processPayment,
} from "@/lib/subscription";
import { toast } from "sonner";
import {
  X,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  Smartphone,
  CreditCard,
  Loader2,
  Lock,
  ArrowRight,
  Download,
} from "lucide-react";
import logo from "@/assets/logo.png";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialPlan?: SubscriptionPlan;
  onPaymentSuccess?: (plan: SubscriptionPlan) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  userId,
  initialPlan = "max",
  onPaymentSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    initialPlan === "free" ? "max" : initialPlan,
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wave");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const planCfg = PLANS_CONFIG[selectedPlan];
  const price = billingCycle === "yearly" ? planCfg.priceYearly : planCfg.priceMonthly;
  const isCard = paymentMethod === "card";

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlan === "free") return;

    if (!isCard && !phoneNumber.trim()) {
      toast.error("Veuillez saisir votre numéro Mobile Money.");
      return;
    }
    if (isCard && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim())) {
      toast.error("Veuillez remplir toutes les informations de votre carte bancaire.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await processPayment({
        userId,
        plan: selectedPlan,
        billingCycle,
        paymentMethod,
        phoneNumber,
        cardNumber,
      });

      if (res.success) {
        setIsSuccess(true);
        setTransactionId(res.transaction.id);
        toast.success(res.message);
        onPaymentSuccess?.(selectedPlan);
      }
    } catch (err) {
      toast.error("Échec du paiement. Veuillez vérifier vos coordonnées.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptText = `
========================================
             REÇU BOURSIO
========================================
ID Transaction: ${transactionId || "tx_demo"}
Date: ${new Date().toLocaleString("fr-FR")}
Utilisateur ID: ${userId || "guest"}
Plan souscrit: ${planCfg.name}
Cycle: ${billingCycle === "yearly" ? "Annuel" : "Mensuel"}
Moyen de paiement: ${paymentMethod.toUpperCase()}
Montant payé: ${price.toLocaleString("fr-FR")} FCFA
Statut: VALIDÉ ET CONFIRMÉ
========================================
Merci de faire confiance à Boursio pour 
votre parcours d'excellence internationale !
    `.trim();

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recu-boursio-${transactionId || "tx"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-primary/30 bg-card p-6 shadow-2xl sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <img src={logo} alt="Boursio" className="h-10 w-10 object-contain shrink-0" />
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Passer au Niveau Supérieur
            </h2>
            <p className="text-xs text-muted-foreground">
              Débloquez l'IA autonome, la génération de documents et la garantie 98% d'acceptation.
            </p>
          </div>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-500 ring-8 ring-emerald-500/10">
              <Check className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Paiement Validé avec Succès
              </span>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Bienvenue dans le {planCfg.name} !
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Votre compte a été immédiatement mis à niveau. Toutes les fonctionnalités avancées
                (Générateur de lettres, Hub Mentorat, Suivi Kanban) sont désormais accessibles.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-xs font-semibold text-foreground hover:bg-secondary/80"
              >
                <Download className="h-4 w-4" /> Télécharger mon Reçu
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-glow hover:opacity-90"
              >
                Accéder à mon Espace <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handlePay} className="space-y-6">
            {/* 1. Plan Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  1. Choisissez votre Formule
                </label>

                {/* Monthly / Yearly Switch */}
                <div className="flex items-center rounded-full border border-border bg-secondary p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`rounded-full px-3 py-1 font-medium transition-all ${
                      billingCycle === "monthly"
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    className={`rounded-full px-3 py-1 font-medium transition-all ${
                      billingCycle === "yearly"
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    Annuel (-20%)
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* PRO PLAN */}
                <div
                  onClick={() => setSelectedPlan("pro")}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
                    selectedPlan === "pro"
                      ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm"
                      : "border-border bg-secondary/30 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-display font-bold text-sm text-foreground">
                        {PLANS_CONFIG.pro.name}
                      </span>
                    </div>
                    {selectedPlan === "pro" && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="mt-2 text-xl font-extrabold text-foreground">
                    {billingCycle === "yearly"
                      ? `${PLANS_CONFIG.pro.priceYearly.toLocaleString("fr-FR")} FCFA/an`
                      : `${PLANS_CONFIG.pro.priceMonthly.toLocaleString("fr-FR")} FCFA/mois`}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Générateur de lettres illimité & Suivi Kanban
                  </p>
                </div>

                {/* MAX PLAN */}
                <div
                  onClick={() => setSelectedPlan("max")}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
                    selectedPlan === "max"
                      ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/40 shadow-glow"
                      : "border-border bg-secondary/30 hover:border-border/80"
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-2 py-0.5 text-[9px] font-black uppercase text-slate-950 shadow-sm">
                    Recommandé 98%
                  </span>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span className="font-display font-bold text-sm text-foreground">
                        {PLANS_CONFIG.max.name}
                      </span>
                    </div>
                    {selectedPlan === "max" && <Check className="h-4 w-4 text-amber-500" />}
                  </div>
                  <div className="mt-2 text-xl font-extrabold text-foreground">
                    {billingCycle === "yearly"
                      ? `${PLANS_CONFIG.max.priceYearly.toLocaleString("fr-FR")} FCFA/an`
                      : `${PLANS_CONFIG.max.priceMonthly.toLocaleString("fr-FR")} FCFA/mois`}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Accès Mentors vérifiés & Simulateur oral IA
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                2. Moyen de Paiement
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PAYMENT_METHODS_CONFIG.map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary font-bold text-foreground"
                          : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {method.iconType === "mobile" ? (
                        <Smartphone className="h-5 w-5 mb-1 text-primary" />
                      ) : (
                        <CreditCard className="h-5 w-5 mb-1 text-blue-500" />
                      )}
                      <span className="text-xs line-clamp-1">{method.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Input Details based on method */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              {!isCard ? (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Numéro de Téléphone Mobile Money *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="ex: +228 90 00 00 00 ou +225 07 00 00 00"
                    className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Une invite de confirmation push vous sera envoyée pour valider le débit.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Numéro de Carte Bancaire *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Date d'expiration *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full rounded-xl border border-border bg-input px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        CVC / CVV *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full rounded-xl border border-border bg-input px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Security Guarantee Note */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>
                Paiement 100% sécurisé et chiffré SSL 256-bit. Sans engagement, annulable à tout moment.
              </span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-blue-600 py-3.5 text-sm font-bold text-white shadow-glow hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Traitement sécurisé en cours...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Payer {price.toLocaleString("fr-FR")} FCFA & Débloquer {planCfg.name}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
