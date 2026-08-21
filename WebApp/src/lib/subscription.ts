import { SubscriptionPlan, PaymentMethod, PaymentTransaction } from "./types";

const SUBSCRIPTION_STORAGE_KEY = "boursio_user_subscription";
const TRANSACTIONS_STORAGE_KEY = "boursio_payment_transactions";

export interface PlanDetails {
  plan: SubscriptionPlan;
  name: string;
  priceMonthly: number; // FCFA
  priceYearly: number; // FCFA
  currency: string;
  badge: string;
  features: string[];
  limits: {
    aiLettersPerMonth: number; // -1 for unlimited
    cvDiagnosticsPerMonth: number;
    mentorshipBookings: boolean;
    applicationTrackerSlots: number;
    exportFullFolder: boolean;
  };
}

export const PLANS_CONFIG: Record<SubscriptionPlan, PlanDetails> = {
  free: {
    plan: "free",
    name: "Gratuit",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "FCFA",
    badge: "Découverte",
    features: [
      "Recommandation de bourses personnalisée",
      "Accès aux fiches détaillées de bourses",
      "Coach IA standard (10 questions/jour)",
      "Gestionnaire de documents basique",
    ],
    limits: {
      aiLettersPerMonth: 1,
      cvDiagnosticsPerMonth: 1,
      mentorshipBookings: false,
      applicationTrackerSlots: 2,
      exportFullFolder: false,
    },
  },
  pro: {
    plan: "pro",
    name: "Pro Boursier",
    priceMonthly: 500,
    priceYearly: 5000,
    currency: "FCFA",
    badge: "Essentiel",
    features: [
      "Tout du plan Gratuit",
      "Générateur IA de Lettres de Motivation (illimité)",
      "Scoreur et Optimiseur de CV ATS",
      "Suivi de Candidatures Kanban complet",
      "Alertes de Deadlines prioritaires par email",
    ],
    limits: {
      aiLettersPerMonth: -1,
      cvDiagnosticsPerMonth: 10,
      mentorshipBookings: true,
      applicationTrackerSlots: 10,
      exportFullFolder: true,
    },
  },
  max: {
    plan: "max",
    name: "Max Réussite 98%",
    priceMonthly: 1000,
    priceYearly: 9000,
    currency: "FCFA",
    badge: "Recommandé 98%",
    features: [
      "Tout du plan Pro",
      "Accès prioritaire aux Mentors et Boursiers vérifiés",
      "Simulateur oral d'entretien de jury IA",
      "Soumission assistée & Relecture complète",
      "Export illimité des dossiers de candidature",
      "Garantie accompagnement jusqu'à l'admission",
    ],
    limits: {
      aiLettersPerMonth: -1,
      cvDiagnosticsPerMonth: -1,
      mentorshipBookings: true,
      applicationTrackerSlots: -1,
      exportFullFolder: true,
    },
  },
};

export const PAYMENT_METHODS_CONFIG: {
  id: PaymentMethod;
  name: string;
  countryScope: string;
  logoColor: string;
  iconType: "mobile" | "card";
}[] = [
  { id: "wave", name: "Wave Mobile Money", countryScope: "Sénégal, CI, Bénin, Togo, Mali", logoColor: "#1EA7FD", iconType: "mobile" },
  { id: "orange_money", name: "Orange Money", countryScope: "CI, Sénégal, Mali, Cameroun, Guinée", logoColor: "#FF7900", iconType: "mobile" },
  { id: "mtn_momo", name: "MTN MoMo", countryScope: "Bénin, CI, Cameroun, Ghana, Nigeria", logoColor: "#FFCC00", iconType: "mobile" },
  { id: "tmoney", name: "Togocom TMoney", countryScope: "Togo", logoColor: "#008850", iconType: "mobile" },
  { id: "flooz", name: "Moov Flooz", countryScope: "Togo, Bénin, CI, Niger", logoColor: "#0055A5", iconType: "mobile" },
  { id: "moov_money", name: "Moov Africa Money", countryScope: "Bénin, Togo, CI, Burkina", logoColor: "#005BA6", iconType: "mobile" },
  { id: "card", name: "Carte Bancaire (Visa / Mastercard)", countryScope: "International / Toute zone", logoColor: "#3B82F6", iconType: "card" },
];

export function getUserSubscription(userId: string): {
  plan: SubscriptionPlan;
  expiresAt: string | null;
  isActive: boolean;
} {
  try {
    const raw = localStorage.getItem(`${SUBSCRIPTION_STORAGE_KEY}_${userId || "guest"}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      const expiresAt = parsed.expiresAt ? new Date(parsed.expiresAt) : null;
      const isActive = !expiresAt || expiresAt.getTime() > Date.now();
      return {
        plan: isActive ? parsed.plan : "free",
        expiresAt: parsed.expiresAt || null,
        isActive,
      };
    }
  } catch (e) {
    console.error("Error reading subscription:", e);
  }
  return { plan: "free", expiresAt: null, isActive: true };
}

export function setUserSubscription(
  userId: string,
  plan: SubscriptionPlan,
  durationMonths: number = 1,
): { plan: SubscriptionPlan; expiresAt: string } {
  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + durationMonths);
  const expiresAt = expiresDate.toISOString();

  const data = {
    userId,
    plan,
    expiresAt,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(`${SUBSCRIPTION_STORAGE_KEY}_${userId || "guest"}`, JSON.stringify(data));
  return { plan, expiresAt };
}

export async function processPayment(params: {
  userId: string;
  plan: SubscriptionPlan;
  billingCycle: "monthly" | "yearly";
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  cardNumber?: string;
}): Promise<{ success: boolean; transaction: PaymentTransaction; message: string }> {
  // Simulate network latency for payment processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const planCfg = PLANS_CONFIG[params.plan];
  const amount = params.billingCycle === "yearly" ? planCfg.priceYearly : planCfg.priceMonthly;
  const durationMonths = params.billingCycle === "yearly" ? 12 : 1;

  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + durationMonths);

  const transaction: PaymentTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: params.userId || "guest",
    plan: params.plan,
    amount,
    currency: "FCFA",
    paymentMethod: params.paymentMethod,
    phoneNumber: params.phoneNumber,
    status: "success",
    createdAt: new Date().toISOString(),
    expiresAt: expiresDate.toISOString(),
  };

  // 1. Save subscription
  setUserSubscription(params.userId, params.plan, durationMonths);

  // 2. Save transaction to history
  try {
    const key = `${TRANSACTIONS_STORAGE_KEY}_${params.userId || "guest"}`;
    const rawTx = localStorage.getItem(key);
    const list: PaymentTransaction[] = rawTx ? JSON.parse(rawTx) : [];
    list.unshift(transaction);
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving transaction:", e);
  }

  return {
    success: true,
    transaction,
    message: `Félicitations ! Votre abonnement ${planCfg.name} est activé avec succès.`,
  };
}

export function getUserTransactions(userId: string): PaymentTransaction[] {
  try {
    const key = `${TRANSACTIONS_STORAGE_KEY}_${userId || "guest"}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading transactions:", e);
    return [];
  }
}
