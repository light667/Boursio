// ─── Boursio i18n ─────────────────────────────────────────────────────────────
// Central translation file for the landing page (FR / EN).
// Usage: const t = useTranslation();  then t.hero.headline
// ──────────────────────────────────────────────────────────────────────────────

export type Lang = "fr" | "en";

// ── Nav ───────────────────────────────────────────────────────────────────────
const nav = {
  fr: {
    features: "Fonctionnalités",
    how: "Comment ça marche",
    pricing: "Tarifs",
    faq: "FAQ",
    contact: "Contact",
    launch: "Lancer la version web",
    appearance: "Apparence",
  },
  en: {
    features: "Features",
    how: "How it works",
    pricing: "Pricing",
    faq: "FAQ",
    contact: "Contact",
    launch: "Launch web app",
    appearance: "Appearance",
  },
};

// ── Hero ──────────────────────────────────────────────────────────────────────
const hero = {
  fr: {
    badge: "Moteur IA d'Admission 2026",
    badgeSub: "Optimisez votre dossier jusqu'à 98% d'acceptation",
    headline1: "Décrochez les Meilleures",
    headline2: "Bourses Mondiales avec l'IA",
    sub: "Recommandations sur-mesure parmi plus de 1 500 bourses officielles, rédaction assistée de vos lettres de motivation, et accompagnement direct par des mentors jusqu'à l'admission.",
    launchWeb: "Lancer le Matcher de Bourses",
    simulatorBtn: "Simulateur d'Acceptation 98%",
    playStore: "Boursio sur Play Store",
    appStore: "Boursio sur App Store",
    statAcceptance: "Taux de Succès IA Optimisé",
    statDatabase: "Bourses Officielles Répertoriées",
    statFunding: "Bourses 100% Totales & Partielles",
    statMentors: "Mentorat Spécialisé Campus France",
  },
  en: {
    badge: "AI Admission Engine 2026",
    badgeSub: "Optimize your application up to 98% acceptance",
    headline1: "Secure Top International",
    headline2: "Scholarships with AI",
    sub: "Tailored recommendations across 1,500+ official scholarship programmes, AI-assisted motivation letter drafting, and verified mentorship guidance all the way to admission.",
    launchWeb: "Launch Scholarship Matcher",
    simulatorBtn: "98% Acceptance Simulator",
    playStore: "Boursio on Play Store",
    appStore: "Boursio on App Store",
    statAcceptance: "Optimized Success Rate",
    statDatabase: "Official Scholarship Programs",
    statFunding: "100% Fully & Partially Funded",
    statMentors: "Dedicated Campus France Mentoring",
  },
};

// ── Features ──────────────────────────────────────────────────────────────────
const features = {
  fr: {
    sectionLabel: "Fonctionnalités",
    title: "Tout ce dont vous avez besoin",
    titleAccent: "pour décrocher votre bourse.",
    sub: "Une plateforme unique qui remplace des heures de recherche, de rédaction et de suivi par une expérience fluide et intelligente.",
    items: [
      {
        title: "Matching IA de bourses",
        description:
          "Notre algorithme analyse votre profil académique et vous propose les bourses avec les meilleures chances de succès — parmi plus de 500 programmes internationaux.",
      },
      {
        title: "Rédaction assistée",
        description:
          "Générez des lettres de motivation, essays et personal statements percutants. L'IA adapte le ton et le contenu à chaque programme et université.",
      },
      {
        title: "Alertes personnalisées",
        description:
          "Ne ratez plus aucune deadline. Recevez des notifications ciblées sur les nouvelles bourses correspondant à votre profil et les dates limites importantes.",
      },
      {
        title: "Tableau de bord complet",
        description:
          "Suivez l'avancement de chaque candidature en temps réel. Visualisez vos statistiques, vos points forts et les axes d'amélioration de votre dossier.",
      },
      {
        title: "Coaching IA 24/7",
        description:
          "Posez vos questions à tout moment. L'assistant IA vous guide sur les exigences de chaque bourse, la rédaction, les entretiens et les démarches administratives.",
      },
      {
        title: "Candidature rapide",
        description:
          "Pré-remplissez automatiquement vos formulaires grâce à votre profil centralisé. Ce qui prenait des heures ne prend plus que quelques minutes.",
      },
    ],
  },
  en: {
    sectionLabel: "Features",
    title: "Everything you need",
    titleAccent: "to land your scholarship.",
    sub: "A single platform that replaces hours of searching, writing and tracking with a smooth, intelligent experience.",
    items: [
      {
        title: "AI Scholarship Matching",
        description:
          "Our algorithm analyses your academic profile and suggests scholarships with the highest success chances — across 500+ international programmes.",
      },
      {
        title: "AI-Assisted Writing",
        description:
          "Generate compelling motivation letters, essays and personal statements. The AI tailors tone and content to each programme and university.",
      },
      {
        title: "Personalised Alerts",
        description:
          "Never miss a deadline again. Receive targeted notifications for new scholarships matching your profile and upcoming due dates.",
      },
      {
        title: "Full Dashboard",
        description:
          "Track every application in real time. Visualise your stats, strengths and areas for improvement at a glance.",
      },
      {
        title: "AI Coaching 24/7",
        description:
          "Ask anything, any time. The AI assistant guides you on requirements, writing, interviews and admin procedures for each scholarship.",
      },
      {
        title: "Fast Applications",
        description:
          "Auto-fill forms from your centralised profile. What used to take hours now takes minutes.",
      },
    ],
  },
};

// ── How It Works ──────────────────────────────────────────────────────────────
const how = {
  fr: {
    sectionLabel: "Comment ça marche",
    title: "De la découverte à l'acceptation,",
    titleAccent: "en 4 étapes",
    steps: [
      {
        n: "01",
        title: "Créez votre profil",
        desc: "Renseignez votre parcours académique, vos diplômes et vos projets d'études en quelques clics.",
      },
      {
        n: "02",
        title: "Recevez vos bourses",
        desc: "Notre IA identifie les opportunités sur-mesure pour votre profil. Sauvegardez celles qui vous intéressent.",
      },
      {
        n: "03",
        title: "Candidatez avec les agents IA",
        desc: "Bénéficiez de la rédaction guidée de vos lettres de motivation, CV et dossiers pour chaque bourse.",
      },
      {
        n: "04",
        title: "Suivez vos résultats",
        desc: "Pilotez vos dossiers depuis votre espace et recevez des notifications à chaque étape.",
      },
    ],
  },
  en: {
    sectionLabel: "How it works",
    title: "From discovery to acceptance,",
    titleAccent: "in 4 steps",
    steps: [
      {
        n: "01",
        title: "Create your profile",
        desc: "Enter your academic background, qualifications and study goals in just a few clicks.",
      },
      {
        n: "02",
        title: "Receive your scholarships",
        desc: "Our AI identifies tailored opportunities for your profile. Save the ones that interest you.",
      },
      {
        n: "03",
        title: "Apply with AI agents",
        desc: "Get guided writing of your motivation letters, CV and full application for each scholarship.",
      },
      {
        n: "04",
        title: "Track your results",
        desc: "Manage your files from your dashboard and receive notifications at every step.",
      },
    ],
  },
};

// ── Roadmap ───────────────────────────────────────────────────────────────────
const roadmap = {
  fr: {
    sectionLabel: "Roadmap & Partenaires",
    title: "Ce qui arrive",
    titleAccent: "bientôt",
    sub: "Boursio s'agrandit. Voici ce que notre équipe prépare pour vous.",
    items: [
      {
        title: "Traduction & Certification de documents",
        desc: "Traduisez et certifiez vos relevés de notes et diplômes directement depuis l'application.",
        badge: "En cours",
      },
      {
        title: "Partenariats universitaires directs",
        desc: "Accès prioritaire à des bourses exclusives auprès d'établissements partenaires internationaux.",
        badge: "Bientôt",
      },
      {
        title: "Mentorat & Coaching humain",
        desc: "Sessions de mentoring individuel avec d'anciens boursiers et experts en mobilité académique.",
        badge: "Bientôt",
      },
      {
        title: "Analyse prédictive des chances",
        desc: "Évaluez votre taux de réussite sur chaque offre et recevez des recommandations d'amélioration.",
        badge: "Bientôt",
      },
      {
        title: "Alertes bourses instantanées",
        desc: "Soyez notifié immédiatement lorsqu'une bourse correspondant parfaitement à votre profil est publiée.",
        badge: "Disponible",
      },
      {
        title: "Aide au financement complémentaire",
        desc: "Accès à des opportunités de billetterie, prêts étudiants et subventions d'installation.",
        badge: "Bientôt",
      },
    ],
  },
  en: {
    sectionLabel: "Roadmap & Partners",
    title: "What's coming",
    titleAccent: "next",
    sub: "Boursio is growing. Here's what our team is preparing for you.",
    items: [
      {
        title: "Document Translation & Certification",
        desc: "Translate and certify your transcripts and diplomas directly from the app.",
        badge: "In progress",
      },
      {
        title: "Direct University Partnerships",
        desc: "Priority access to exclusive scholarships from international partner institutions.",
        badge: "Coming soon",
      },
      {
        title: "Human Mentoring & Coaching",
        desc: "One-on-one mentoring sessions with former scholarship recipients and academic mobility experts.",
        badge: "Coming soon",
      },
      {
        title: "Predictive Success Analysis",
        desc: "Assess your success rate for each opportunity and receive improvement recommendations.",
        badge: "Coming soon",
      },
      {
        title: "Instant Scholarship Alerts",
        desc: "Get notified immediately when a scholarship perfectly matching your profile is published.",
        badge: "Available",
      },
      {
        title: "Complementary Funding Support",
        desc: "Access ticketing opportunities, student loans and relocation grants.",
        badge: "Coming soon",
      },
    ],
  },
};

// ── Pricing ───────────────────────────────────────────────────────────────────
const pricing = {
  fr: {
    sectionLabel: "Offres & Tarifs",
    title: "Des tarifs accessibles à tous,",
    titleAccent: "sans aucun engagement.",
    sub: "Commencez gratuitement avec l'accès aux recommandations et à l'analyse, puis passez au plan Pro ou Max selon vos besoins.",
    includedLabel: "Inclus dans ce plan :",
    highlightBadge: "Offre Max Illimitée",
    paymentNote:
      "Paiements sécurisés par Mobile Money (Wave, Orange Money, MTN MoMo, Moov) et Carte bancaire. Sans engagement.",
    plans: [
      {
        name: "Gratuit",
        badge: "Incontournable",
        price: "0 FCFA",
        period: "pour toujours",
        highlight: false,
        description: "Tout pour commencer votre recherche et analyser vos opportunités.",
        features: [
          "Recommandation de bourses à votre profil",
          "Analyse complète des dossiers",
          "Chat d'information & FAQ IA",
          "Tableau de bord de suivi basique",
        ],
        cta: "Commencer gratuitement",
        ctaPrimary: false,
      },
      {
        name: "Pro",
        badge: "Essentiel",
        price: "500 FCFA",
        period: "/ mois",
        highlight: false,
        description: "Idéal pour préparer activement et optimiser toutes vos candidatures.",
        features: [
          "Tout du plan Gratuit",
          "Bourses recommandées illimitées",
          "Rédaction & optimisation de CV / Lettres",
          "Suivi actif de l'avancement des dossiers",
          "Alertes personnalisées sur les deadlines",
        ],
        cta: "S'abonner au plan Pro",
        ctaPrimary: true,
      },
      {
        name: "Max",
        badge: "Recommandé",
        price: "1 000 FCFA",
        period: "/ mois",
        highlight: true,
        description: "Accès illimité à TOUTES les fonctionnalités de Boursio.",
        features: [
          "Tout du plan Pro",
          "Accès illimité à toutes les fonctionnalités IA",
          "Support prioritaire & accompagnement premium",
          "Exportation complète et illimitée des dossiers",
          "Fonctionnalités exclusives en avant-première",
        ],
        cta: "S'abonner au plan Max",
        ctaPrimary: true,
      },
    ],
  },
  en: {
    sectionLabel: "Plans & Pricing",
    title: "Affordable pricing for everyone,",
    titleAccent: "no commitment.",
    sub: "Start for free with recommendations and analysis, then upgrade to Pro or Max as you need.",
    includedLabel: "Included in this plan:",
    highlightBadge: "Unlimited Max Plan",
    paymentNote:
      "Secure payments via Mobile Money (Wave, Orange Money, MTN MoMo, Moov) and bank card. No commitment.",
    plans: [
      {
        name: "Free",
        badge: "Essential",
        price: "0 FCFA",
        period: "forever",
        highlight: false,
        description: "Everything to start your search and analyse your opportunities.",
        features: [
          "Scholarship recommendations for your profile",
          "Full application analysis",
          "AI information chat & FAQ",
          "Basic tracking dashboard",
        ],
        cta: "Get started for free",
        ctaPrimary: false,
      },
      {
        name: "Pro",
        badge: "Popular",
        price: "500 FCFA",
        period: "/ month",
        highlight: false,
        description: "Ideal for actively preparing and optimising all your applications.",
        features: [
          "Everything in Free",
          "Unlimited scholarship recommendations",
          "CV & cover letter drafting & optimisation",
          "Active application progress tracking",
          "Personalised deadline alerts",
        ],
        cta: "Subscribe to Pro",
        ctaPrimary: true,
      },
      {
        name: "Max",
        badge: "Recommended",
        price: "1,000 FCFA",
        period: "/ month",
        highlight: true,
        description: "Unlimited access to ALL Boursio features.",
        features: [
          "Everything in Pro",
          "Unlimited access to all AI features",
          "Priority support & premium coaching",
          "Full and unlimited file exports",
          "Exclusive early-access features",
        ],
        cta: "Subscribe to Max",
        ctaPrimary: true,
      },
    ],
  },
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faq = {
  fr: {
    title: "Questions",
    titleAccent: "fréquentes",
    items: [
      {
        q: "Boursio est-il gratuit ?",
        a: "Oui ! Boursio propose une formule Gratuite permanente qui inclut la recommandation de bourses selon votre profil, l'analyse de vos dossiers et un chat d'information pour répondre à vos questions.",
      },
      {
        q: "Quels sont les tarifs des abonnements Boursio ?",
        a: "Nos abonnements sont conçus pour être très accessibles : le plan Pro est à 500 FCFA/mois pour les fonctionnalités essentielles, et le plan Max est à 1 000 FCFA/mois (tarif maximum) pour un accès illimité à toutes les fonctionnalités.",
      },
      {
        q: "Quels types de bourses sont disponibles sur Boursio ?",
        a: "Nous indexons des bourses gouvernementales, universitaires, de fondations et de programmes internationaux (Erasmus+, Eiffel, Chevening, Fulbright...). L'IA filtre tout selon votre profil.",
      },
      {
        q: "Boursio est-il disponible sur mobile et sur web ?",
        a: "Oui ! Boursio est disponible sur le Web, sur Android via le Google Play Store et sur iOS via l'Apple App Store. Vos données et candidatures sont synchronisées sur tous vos appareils.",
      },
      {
        q: "Comment le système d'agents IA m'aide-t-il à candidater ?",
        a: "Nos agents IA étudient votre profil académique, génèrent des recommandations ciblées, vous guident dans chaque pièce du dossier, rédigent ou améliorent vos lettres de motivation et suivent l'état de vos candidatures.",
      },
      {
        q: "Qui développe Boursio ?",
        a: "Boursio est une plateforme technologique dédiée à l'accompagnement des étudiants vers la réussite académique internationale, grâce à l'intelligence artificielle.",
      },
      {
        q: "Mes données personnelles sont-elles protégées ?",
        a: "Absolument. Vos informations académiques et personnelles sont chiffrées et strictement confidentielles. Elles ne sont jamais revendues à des tiers.",
      },
      {
        q: "Quels moyens de paiement sont acceptés pour s'abonner ?",
        a: "Vous pouvez régler vos abonnements très facilement par Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money) ainsi que par carte bancaire depuis l'application.",
      },
    ],
  },
  en: {
    title: "Frequently asked",
    titleAccent: "questions",
    items: [
      {
        q: "Is Boursio free?",
        a: "Yes! Boursio offers a permanent Free plan that includes scholarship recommendations matching your profile, application analysis and an AI information chat.",
      },
      {
        q: "How much do Boursio subscriptions cost?",
        a: "Our subscriptions are designed to be very affordable: the Pro plan is 500 FCFA/month for essential features, and the Max plan is 1,000 FCFA/month (maximum) for unlimited access to all features.",
      },
      {
        q: "What types of scholarships are available on Boursio?",
        a: "We index government, university, foundation and international programme scholarships (Erasmus+, Eiffel, Chevening, Fulbright…). The AI filters everything based on your profile.",
      },
      {
        q: "Is Boursio available on mobile and web?",
        a: "Yes! Boursio is available on the Web, on Android via Google Play Store and on iOS via the Apple App Store. Your data and applications are synced across all your devices.",
      },
      {
        q: "How does the AI agent system help me apply?",
        a: "Our AI agents study your academic profile, generate targeted recommendations, guide you through every document required, draft or improve your cover letters and track the status of your applications.",
      },
      {
        q: "Who builds Boursio?",
        a: "Boursio is a technology platform dedicated to helping students achieve international academic success through artificial intelligence.",
      },
      {
        q: "Is my personal data protected?",
        a: "Absolutely. Your academic and personal information is encrypted and strictly confidential. It is never sold to third parties.",
      },
      {
        q: "What payment methods are accepted for subscriptions?",
        a: "You can pay for subscriptions easily via Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money) or bank card directly from the app.",
      },
    ],
  },
};

// ── Contact ───────────────────────────────────────────────────────────────────
const contact = {
  fr: {
    title: "Besoin d'un contact direct ?",
    sub: "Notre équipe d'assistance et nos conseillers Boursio vous répondent sous 24 heures.",
    whatsapp: "WhatsApp Officiel",
  },
  en: {
    title: "Need to reach us directly?",
    sub: "Our support team and Boursio advisors will reply within 24 hours.",
    whatsapp: "Official WhatsApp",
  },
};

// ── Footer ────────────────────────────────────────────────────────────────────
const footer = {
  fr: {
    appearance: "Apparence",
    copyright: "Tous droits réservés.",
    legal: [
      { label: "À propos", href: "/about.html" },
      { label: "Mentions légales", href: "/legal.html" },
      { label: "Politique de confidentialité", href: "/privacy.html" },
      { label: "Conditions d'utilisation", href: "/terms.html" },
    ],
  },
  en: {
    appearance: "Appearance",
    copyright: "All rights reserved.",
    legal: [
      { label: "About", href: "/about.html" },
      { label: "Legal notice", href: "/legal.html" },
      { label: "Privacy policy", href: "/privacy.html" },
      { label: "Terms of use", href: "/terms.html" },
    ],
  },
};

// ── Picker (première visite) ──────────────────────────────────────────────────
const picker = {
  fr: {
    welcome: "Bienvenue sur Boursio",
    sub: "Choisissez votre langue et votre thème préférés pour une expérience personnalisée.",
    langLabel: "Langue",
    themeLabel: "Thème",
    light: "Clair",
    dark: "Sombre",
    cta: "Continuer",
  },
  en: {
    welcome: "Welcome to Boursio",
    sub: "Choose your preferred language and theme for a personalised experience.",
    langLabel: "Language",
    themeLabel: "Theme",
    light: "Light",
    dark: "Dark",
    cta: "Continue",
  },
};

// ── Root translations object ───────────────────────────────────────────────────
export const translations = { nav, hero, features, how, roadmap, pricing, faq, contact, footer, picker };

export type Translations = typeof translations;
