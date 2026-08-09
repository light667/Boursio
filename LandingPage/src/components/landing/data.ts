import {
  Target,
  Hand,
  Bot,
  Lightbulb,
  Globe,
  LayoutDashboard,
  Languages,
  School,
  GraduationCap,
  LineChart,
  Bell,
  Wallet,
  Gift,
  Zap,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export const WAITLIST_COUNT = "5 000+";

export const CORE_FEATURES: {
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    icon: Target,
    title: "Recommandation IA sur-mesure",
    desc: "À l'inscription, Boursio analyse vos informations académiques et sélectionne uniquement les bourses qui correspondent à votre profil. Fini la recherche manuelle.",
  },
  {
    icon: Hand,
    title: "Swipe & Sauvegarde",
    desc: "Parcourez vos bourses recommandées sous forme de flux dynamique. Swipez à droite pour sauvegarder, à gauche pour passer. Simple et efficace.",
  },
  {
    icon: Bot,
    title: "Agents IA d'aide à la candidature",
    desc: "Nos agents IA vous accompagnent pour chaque bourse : vérification des critères, rédaction assistée et optimisation de votre dossier.",
  },
  {
    icon: Lightbulb,
    title: "Chat d'information & Conseil IA",
    desc: "Un assistant IA disponible 24h/24 pour répondre à toutes vos questions sur les démarches, documents et critères d'admission.",
  },
  {
    icon: Globe,
    title: "Ressources & Préparation",
    desc: "Accédez aux modèles de CV professionnels, guides pour tests de langue (TOEFL/IELTS) et conseils de rédaction curatés.",
  },
  {
    icon: LayoutDashboard,
    title: "Suivi actif des candidatures",
    desc: "Tableau de bord centralisé pour piloter vos candidatures : statuts en temps réel, deadlines, documents manquants et rappels.",
  },
];

export const STEPS = [
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
];

export const ROADMAP: {
  icon: LucideIcon;
  title: string;
  desc: string;
  badge: string;
}[] = [
  {
    icon: Languages,
    title: "Traduction & Certification de documents",
    desc: "Traduisez et certifiez vos relevés de notes et diplômes directement depuis l'application.",
    badge: "En cours",
  },
  {
    icon: School,
    title: "Partenariats universitaires directs",
    desc: "Accès prioritaire à des bourses exclusives auprès d'établissements partenaires internationaux.",
    badge: "Bientôt",
  },
  {
    icon: GraduationCap,
    title: "Mentorat & Coaching humain",
    desc: "Sessions de mentoring individuel avec d'anciens boursiers et experts en mobilité académique.",
    badge: "Bientôt",
  },
  {
    icon: LineChart,
    title: "Analyse prédictive des chances",
    desc: "Évaluez votre taux de réussite sur chaque offre et recevez des recommandations d'amélioration.",
    badge: "Bientôt",
  },
  {
    icon: Bell,
    title: "Alertes bourses instantanées",
    desc: "Soyez notifié immédiatement lorsqu'une bourse correspondant parfaitement à votre profil est publiée.",
    badge: "Disponible",
  },
  {
    icon: Wallet,
    title: "Aide au financement complémentaire",
    desc: "Accès à des opportunités de billetterie, prêts étudiants et subventions d'installation.",
    badge: "Bientôt",
  },
];

export const PRICING_PLANS = [
  {
    name: "Gratuit",
    icon: Gift,
    price: "0 FCFA",
    period: "pour toujours",
    highlight: false,
    badge: "Incontournable",
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
    icon: Zap,
    price: "500 FCFA",
    period: "/ mois",
    highlight: false,
    badge: "Essentiel",
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
    icon: Rocket,
    price: "1 000 FCFA",
    period: "/ mois",
    highlight: true,
    badge: "Recommandé",
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
];

export const FAQ_ITEMS = [
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
];

