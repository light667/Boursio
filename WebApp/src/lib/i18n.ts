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
    sectionLabel: "Technologie & Expérience de Pointe",
    title: "Tout ce qu'il Faut pour Décrocher votre",
    titleAccent: "Financement",
    sub: "Une suite complète d'outils intelligents conçue pour éliminer le stress des recherches et maximiser vos chances d'admission internationale.",
    item1Title: "Matching Algorithmique Ultra-Ciblé",
    item1Desc:
      "Fini les heures passées à chercher au hasard. Notre algorithme croise votre moyenne, votre filière, votre nationalité et votre niveau d'études pour ne vous afficher que les bourses où vos chances d'admission sont réelles.",
    item1ScoreLabel: "Calcul automatique du Match Score :",
    item1ScoreValue: "98% Pertinence",
    item2Title: "Générateur de Lettres d'Élite",
    item2Desc:
      "Une lettre de motivation percutante rédigée en 30 secondes selon les directives académiques strictes des universités internationales et comités de bourses.",
    item2Quote:
      '"Bénéficier de cette bourse me permettra de me consacrer pleinement à la recherche..."',
    item3Title: "Suivi Actif Kanban",
    item3Desc:
      "Pilotez chaque candidature étape par étape : pièces obligatoires, calendrier de clôture et relances automatiques.",
    item4Title: "Mentorat d'Alumni",
    item4Desc:
      "Échangez en direct avec des lauréats des bourses Eiffel, Chevening et Mastercard pour des simulations d'oraux et relectures de dossiers.",
    item5Title: "Coffre-Fort Sécurisé",
    item5Desc:
      "Stockez en toute sécurité vos passeports, actes de nationalité, relevés de notes et diplômes pour postuler en 1 clic.",
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
    sectionLabel: "Cutting-Edge Tech & Experience",
    title: "Everything You Need to Secure Your",
    titleAccent: "Funding",
    sub: "A complete suite of intelligent tools designed to eliminate search stress and maximize your international admission chances.",
    item1Title: "Ultra-Targeted Algorithmic Matching",
    item1Desc:
      "No more hours spent searching at random. Our algorithm crosses your GPA, field of study, nationality, and academic level to display only scholarships where your chances are real.",
    item1ScoreLabel: "Automatic Match Score calculation:",
    item1ScoreValue: "98% Relevance",
    item2Title: "Elite Motivation Letter Generator",
    item2Desc:
      "A compelling motivation letter generated in 30 seconds following strict academic guidelines from international universities and scholarship committees.",
    item2Quote:
      '"Receiving this scholarship will allow me to fully dedicate myself to academic research..."',
    item3Title: "Active Kanban Application Tracker",
    item3Desc:
      "Manage every application step by step: mandatory documents, closing deadlines, and automated reminders.",
    item4Title: "Verified Alumni Mentorship",
    item4Desc:
      "Connect directly with laureates of Eiffel, Chevening, and Mastercard scholarships for oral mock interviews and application reviews.",
    item5Title: "Secure Document Vault",
    item5Desc:
      "Safely store your passports, nationality certificates, transcripts, and diplomas to apply in 1 click.",
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

// ── Acceptance Simulator ───────────────────────────────────────────────────────
const simulator = {
  fr: {
    title: "Testez vos Chances d'Obtenir une Bourse et Passez à ",
    titleAccent: "98% d'Acceptation",
    sub: "Renseignez vos critères académiques. Découvrez instantanément comment l'intelligence artificielle de Boursio transforme une candidature classique en dossier d'élite.",
    formTitle: "Vos Informations Académiques",
    nationalityLabel: "Nationalité / Origine",
    otherCountry: "Autre Pays 🌍",
    levelLabel: "Niveau d'Études Actuel",
    levels: {
      bac: "Baccalauréat",
      lic12: "Licence 1 / 2",
      lic3: "Licence 3 / Diplômé Bac+3",
      master: "Master 1 / 2",
      phd: "Doctorat / Recherche",
    },
    fieldLabel: "Filière / Domaine Cible",
    fields: {
      cs: "Informatique & IA",
      eng: "Ingénierie & Technologies",
      econ: "Économie & Finance",
      health: "Santé & Médecine",
      law: "Droit & Sciences Politiques",
      agro: "Agronomie & Environnement",
    },
    destinationLabel: "Destination Souhaitée",
    destinations: {
      fr: "France (Eiffel, Erasmus, etc.)",
      ca: "Canada (Vanier, Bourses Québec)",
      uk: "Royaume-Uni (Chevening)",
      us: "États-Unis (Fulbright)",
      de: "Allemagne (DAAD)",
      jp: "Japon (MEXT)",
      ch: "Suisse (Excellence Confédération)",
    },
    gpaLabel: "Moyenne académique estimée :",
    gpaPassable: "10/20 (Passable)",
    gpaGood: "14/20 (Bien)",
    gpaExcellent: "18/20 (Excellent)",
    resultTitle: "Résultat de l'Analyse Prédictive",
    gainLabel: "de Gain IA",
    withoutBoursio: "Candidature Seule",
    withoutBoursioSub: "Erreurs de lettre, deadlines ratées",
    withBoursio: "Avec Boursio IA",
    withBoursioSub: "Dossier optimisé & conforme",
    whyBoostTitle: "Pourquoi votre taux grimpe à",
    highlight1: "Alignement profil avec {count} bourses actives en {dest}",
    highlight2: "Génération de Lettre de Motivation ultra-personnalisée par l'IA",
    highlight3: "Optimisation du CV aux standards d'évaluation internationaux (ATS)",
    highlight4: "Vérification rigoureuse des critères d'éligibilité et calendrier de dépôt",
    ctaButton: "Découvrir mes {count} Bourses Compatibles",
  },
  en: {
    title: "Test Your Chances of Landing a Scholarship & Reach ",
    titleAccent: "98% Acceptance",
    sub: "Enter your academic criteria. Instantly discover how Boursio's AI transforms a standard application into an elite profile.",
    formTitle: "Your Academic Profile",
    nationalityLabel: "Nationality / Origin",
    otherCountry: "Other Country 🌍",
    levelLabel: "Current Study Level",
    levels: {
      bac: "High School Diploma / Baccalaureate",
      lic12: "Bachelor 1 / 2 (Undergraduate)",
      lic3: "Bachelor 3 / Graduate (BSc/BA)",
      master: "Master 1 / 2 (MSc/MA)",
      phd: "PhD / Doctoral Research",
    },
    fieldLabel: "Target Field / Major",
    fields: {
      cs: "Computer Science & AI",
      eng: "Engineering & Tech",
      econ: "Economics & Finance",
      health: "Health & Medicine",
      law: "Law & Political Science",
      agro: "Agriculture & Environment",
    },
    destinationLabel: "Target Destination",
    destinations: {
      fr: "France (Eiffel, Erasmus, etc.)",
      ca: "Canada (Vanier, Quebec Exemption)",
      uk: "United Kingdom (Chevening)",
      us: "United States (Fulbright)",
      de: "Germany (DAAD)",
      jp: "Japan (MEXT)",
      ch: "Switzerland (Excellence Award)",
    },
    gpaLabel: "Estimated academic GPA:",
    gpaPassable: "10/20 (Passing / 2.0 GPA)",
    gpaGood: "14/20 (Good / 3.2 GPA)",
    gpaExcellent: "18/20 (Excellent / 4.0 GPA)",
    resultTitle: "Predictive Analysis Result",
    gainLabel: "AI Boost",
    withoutBoursio: "Applying Alone",
    withoutBoursioSub: "Letter flaws, missed deadlines",
    withBoursio: "With Boursio AI",
    withBoursioSub: "Optimized & verified application",
    whyBoostTitle: "Why your success rate reaches",
    highlight1: "Profile matching with {count} active scholarships in {dest}",
    highlight2: "Ultra-personalized Motivation Letter generated by AI",
    highlight3: "CV optimization to international ATS evaluation standards",
    highlight4: "Strict eligibility verification and submission calendar management",
    ctaButton: "Discover my {count} Compatible Scholarships",
  },
};

// ── Scholarship Explorer Demo ──────────────────────────────────────────────────
const explorer = {
  fr: {
    badge: "EXPLORATEUR EN TEMPS RÉEL",
    title: "Plus de ",
    titleAccent: "500 Bourses Officielles",
    titleEnd: " Vérifiées",
    sub: "Données directes et vérifiées issues de notre base de données complète pour des candidatures ciblées et sans surprise.",
    viewAll: "Voir tout le catalogue",
    searchPlaceholder: "Filtrer par bourse, université, pays, filière...",
    filterAll: "Toutes les destinations",
    fullFunding: "100% Totalement Financée",
    partialFunding: "Financement Partiel",
    officialBadge: "Officielle",
    amountLabel: "Montant :",
    fullAllocation: "Allocation complète",
    deadlineLabel: "Clôture :",
    checkCalendar: "Consulter le calendrier",
    levelsLabel: "Niveaux :",
    allLevels: "Tous niveaux",
    applyViaAI: "Postuler via IA",
  },
  en: {
    badge: "REAL-TIME EXPLORER",
    title: "Over ",
    titleAccent: "500 Official Scholarships",
    titleEnd: " Verified",
    sub: "Direct verified data from our complete scholarship database for targeted, hassle-free applications.",
    viewAll: "View entire catalogue",
    searchPlaceholder: "Filter by scholarship, university, country, field...",
    filterAll: "All destinations",
    fullFunding: "100% Fully Funded",
    partialFunding: "Partial Funding",
    officialBadge: "Official",
    amountLabel: "Amount:",
    fullAllocation: "Full allowance",
    deadlineLabel: "Deadline:",
    checkCalendar: "Check calendar",
    levelsLabel: "Levels:",
    allLevels: "All levels",
    applyViaAI: "Apply via AI",
  },
};

// ── AI Coach Demo ─────────────────────────────────────────────────────────────
const aiCoachDemo = {
  fr: {
    badge: "COACH IA ACADÉMIQUE 24H/24",
    title: "Un Expert Bourses & Visas dans votre Poche",
    sub: "Entraîné sur les directives officielles des ambassades, des ministères et des programmes de bourses d'excellence, le Coach IA Boursio répond avec une précision chirurgicale à chacune de vos questions.",
    sampleLabel: "Essayez une question type :",
    cta: "Discuter en direct avec le Coach IA",
    coachTitle: "Coach IA Boursio",
    coachSub: "Expert bourses internationales",
    liveDemo: "Démo Live Active",
    inputPlaceholder: "Posez n'importe quelle question sur vos bourses...",
    testBtn: "Tester",
    questions: [
      {
        label: "Demande de Passeport Togo 🇹🇬",
        question: "Quelles sont les pièces et démarches pour un passeport togolais à la DGDN ?",
        answer:
          "Pour une première demande à la DGDN au Togo :\n- Certificat de nationalité original + duplicata légalisé\n- Certificat de naissance + CNI\n- Attestation de personne à prévenir légalisée\n- Preuve de profession (diplôme ou attestation)\n- 2 photos fond blanc + Quittance de 30.000 F CFA payée en ligne\n\nBoursio vous aide à vérifier tout votre dossier avant dépôt physique !",
      },
      {
        label: "Accroche Lettre Bourse Eiffel 🇫🇷",
        question: "Comment structurer mon paragraphe de motivation pour la bourse Eiffel ?",
        answer:
          "Pour la bourse Eiffel :\n1. Présentez votre projet d'études précis en France et son inscription dans les priorités de votre pays d'origine.\n2. Mettez en valeur votre rang/mention académique.\n3. Expliquez la plus-value de l'établissement français d'accueil.\n\nDans l'application Boursio, notre générateur IA rédige votre lettre intégrale en 30 secondes.",
      },
      {
        label: "Financement Bourse Canada 🇨🇦",
        question: "Existe-t-il des bourses d'exemption pour étudier au Québec ?",
        answer:
          "Oui ! Les bourses d'exemption des droits de scolarité majorés permettent aux étudiants internationaux de payer les mêmes frais que les étudiants québécois (économie de 15.000$ à 25.000$ CAD/an). Boursio identifie les universités partenaires éligibles.",
      },
    ],
    customAnswerPrefix: "Merci pour votre question ! L'IA Boursio analyse les critères spécifiques pour \"",
    customAnswerSuffix: "\". Dans l'application complète, notre Coach IA connecté aux bases officielles de plus de 50 pays vous fournit les démarches exactes, les formulaires téléchargeables et la relecture de vos écrits.",
  },
  en: {
    badge: "24/7 ACADEMIC AI COACH",
    title: "A Scholarship & Visa Expert in Your Pocket",
    sub: "Trained on official guidelines from embassies, ministries, and top scholarship programs, Boursio AI Coach answers your questions with surgical precision.",
    sampleLabel: "Try a sample question:",
    cta: "Chat live with AI Coach",
    coachTitle: "Boursio AI Coach",
    coachSub: "International scholarship expert",
    liveDemo: "Live Demo Active",
    inputPlaceholder: "Ask any question about your scholarships...",
    testBtn: "Test",
    questions: [
      {
        label: "Togo Passport Application 🇹🇬",
        question: "What are the required documents and steps for a Togolese passport at DGDN?",
        answer:
          "For a first application at DGDN in Togo:\n- Original nationality certificate + certified copy\n- Birth certificate + National ID Card\n- Legalized emergency contact declaration\n- Proof of profession (diploma or employment certificate)\n- 2 white-background photos + 30,000 XOF payment receipt paid online\n\nBoursio helps you verify your entire file before physical submission!",
      },
      {
        label: "Eiffel Scholarship Letter Hook 🇫🇷",
        question: "How should I structure my motivation letter for the Eiffel scholarship?",
        answer:
          "For the Eiffel scholarship:\n1. State your precise study plan in France and how it addresses priority development goals in your home country.\n2. Highlight your academic rank and honors.\n3. Explain the distinct added value of the French host institution.\n\nIn Boursio, our AI generator writes your full motivation letter in 30 seconds.",
      },
      {
        label: "Canada Scholarship Funding 🇨🇦",
        question: "Are there tuition fee exemption scholarships to study in Quebec, Canada?",
        answer:
          "Yes! Tuition fee differential exemption scholarships allow international students to pay local Quebec tuition fees (saving $15,000 to $25,000 CAD/year). Boursio automatically identifies eligible host universities.",
      },
    ],
    customAnswerPrefix: "Thank you for your question! Boursio AI analyzes specific criteria for \"",
    customAnswerSuffix: "\". In the full app, our AI Coach connected to official databases in 50+ countries provides exact procedures, downloadable forms, and instant essay reviews.",
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

// ── Dashboard (Espace App & Candidat) ──────────────────────────────────────────
const dashboard = {
  fr: {
    nav: {
      recommandations: "Recommandations",
      candidatures: "Candidatures",
      coach: "Coach IA",
      dossier: "Mon Dossier",
      alertes: "Alertes",
      mentorat: "Mentorat",
      profil: "Profil",
      parametres: "Paramètres",
      tagline: "Bourses & Orientation",
      returnToLanding: "Retour au site vitrine",
      logout: "Déconnexion",
      loginRegister: "Se connecter / S'inscrire",
      guestStudent: "Étudiant Boursio",
      inProgressProfile: "Profil en cours",
      upgradePlan: "Passer au plan Pro",
      managePlan: "Gérer l'abonnement",
      freePlan: "Gratuit",
      proPlan: "Plan Pro",
      maxPlan: "Plan Max",
      matchBadge: "Match",
      suiviBadge: "Suivi",
      paramsBadge: "Params",
    },
    candidatures: {
      title: "Suivi de vos Candidatures",
      subtitle: "Gérez l'avancement de vos dossiers, checklists et pièces officielles étape par étape.",
      addApplication: "Ajouter une candidature",
      emptyState: "Aucune candidature dans cette colonne pour le moment.",
      columns: {
        toPrepare: "À Préparer",
        drafting: "En Rédaction",
        submitted: "Dossier Déposé",
        interview: "Entretien Jury",
        accepted: "Bourse Obtenue 🎉",
      },
      stats: {
        total: "Total Suivi",
        inProgress: "En Cours",
        submitted: "Déposés",
        accepted: "Obtenues",
      },
      modal: {
        addTitle: "Ajouter une Candidature au Pipeline",
        selectScholarship: "Sélectionner une bourse",
        chooseScholarship: "-- Choisir une bourse sauvegardée --",
        manualScholarship: "Ou nommer la bourse / programme",
        targetUniv: "Université / Établissement cible",
        deadline: "Date limite de dépôt",
        cancel: "Annuler",
        submit: "Enregistrer la candidature",
      },
    },
    mentorat: {
      title: "Réseau de Mentorat d'Alumni",
      subtitle: "Bénéficiez de l'accompagnement direct et de simulations avec des lauréats et ingénieurs expérimentés.",
      verifiedAlumni: "Mentors Vérifiés",
      bookSession: "Réserver une session visio",
      availableThisWeek: "Créneaux disponibles cette semaine",
      topicsCovered: "Thématiques d'accompagnement :",
      modal: {
        title: "Prendre rendez-vous avec",
        selectTopic: "Sélectionnez l'objectif de la session :",
        selectDate: "Date souhaitée :",
        selectTime: "Horaire :",
        notes: "Notes ou questions particulières :",
        notesPlaceholder: "Ex: J'ai besoin d'une relecture de mon CV pour Campus France et mon projet en Master...",
        cancel: "Annuler",
        confirm: "Confirmer la réservation (Gratuit)",
        success: "Session de mentorat réservée avec succès ! Vous recevrez le lien visio par e-mail.",
      },
    },
    documents: {
      title: "Coffre-Fort & Dossier Numérique",
      subtitle: "Centralisez vos pièces justificatives pour postuler et remplir vos dossiers en 1 clic.",
      uploadBtn: "Téléverser un document",
      totalStorage: "Espace sécurisé & chiffré",
      docTypes: {
        cv: "Curriculum Vitae (CV)",
        passport: "Passeport / CNI",
        diploma: "Diplôme / Baccalauréat",
        transcripts: "Relevés de notes",
        certificate: "Attestation / Certificat",
        other: "Autre document officiel",
      },
      dropPrompt: "Glissez votre fichier ici ou cliquez pour parcourir (PDF, PNG, JPG jusqu'à 10MB)",
      emptyVault: "Aucun document enregistré. Ajoutez vos diplômes et relevés pour accélérer vos candidatures.",
      deleteConfirm: "Supprimer",
    },
    settings: {
      title: "Paramètres & Préférences",
      subtitle: "Gérez vos informations de compte, vos alertes, votre langue et votre formule d'abonnement.",
      accountSection: "Profil & Compte",
      preferencesSection: "Langue & Apparence",
      subscriptionSection: "Formule & Facturation",
      languageLabel: "Langue de l'application",
      themeLabel: "Thème d'affichage",
      dark: "Sombre",
      light: "Clair",
      system: "Système",
      activeSubscription: "Abonnement Actif",
      manageSubBtn: "Changer d'offre ou renouveler",
      downloadInvoice: "Télécharger mon reçu officiel",
      dangerZone: "Zone de Danger",
      deleteAccount: "Supprimer mon compte et mes données",
      logoutBtn: "Se déconnecter",
    },
    coach: {
      title: "Coach IA Académique",
      subtitle: "Votre conseiller d'orientation et d'admission disponible 24h/24.",
      welcomeMsg: "Bonjour ! Je suis votre Coach IA Boursio. Comment puis-je vous aider aujourd'hui dans vos démarches de bourses ou de visa ?",
      inputPlaceholder: "Posez une question sur vos bourses, le visa, ou demandez des conseils de rédaction...",
      sendBtn: "Envoyer",
      clearBtn: "Nouvelle conversation",
      quickActions: "Outils IA Express :",
      letterTool: "Générer une Lettre",
      cvTool: "Diagnostic CV ATS",
      interviewTool: "Simulation d'Entretien",
    },
    alerts: {
      title: "Alertes & Échéances",
      subtitle: "Ne manquez aucune date limite de dépôt de bourse.",
      noAlerts: "Aucune alerte active pour le moment. Ajoutez des bourses en favoris pour suivre leurs dates limites.",
      daysLeft: "jours restants",
      urgent: "Urgent",
      viewDetails: "Consulter la bourse",
    },
    recommendations: {
      title: "Recommandations Sur-Mesure",
      subtitle: "Bourses analysées et classées selon la compatibilité avec votre profil académique.",
      searchPlaceholder: "Rechercher une bourse, université, pays...",
      allDestinations: "Toutes les destinations",
      allDegrees: "Tous les niveaux",
      matchScoreLabel: "Match Score",
      viewBourse: "Voir le dossier complet",
      saveBourse: "Sauvegarder",
      completeProfileAlert: "Complétez votre profil pour débloquer un calcul de compatibilité précis à 100%.",
      completeProfileBtn: "Compléter mon profil",
    },
  },
  en: {
    nav: {
      recommandations: "Recommendations",
      candidatures: "Applications",
      coach: "AI Coach",
      dossier: "My Documents",
      alertes: "Alerts",
      mentorat: "Mentorship",
      profil: "Profile",
      parametres: "Settings",
      tagline: "Scholarships & Guidance",
      returnToLanding: "Back to main website",
      logout: "Sign Out",
      loginRegister: "Sign In / Register",
      guestStudent: "Boursio Student",
      inProgressProfile: "Profile in progress",
      upgradePlan: "Upgrade to Pro",
      managePlan: "Manage subscription",
      freePlan: "Free",
      proPlan: "Pro Plan",
      maxPlan: "Max Plan",
      matchBadge: "Match",
      suiviBadge: "Track",
      paramsBadge: "Settings",
    },
    candidatures: {
      title: "Applications Tracker",
      subtitle: "Manage your submission stages, mandatory checklists, and official documents step by step.",
      addApplication: "Add an application",
      emptyState: "No application in this stage yet.",
      columns: {
        toPrepare: "To Prepare",
        drafting: "In Drafting",
        submitted: "Submitted",
        interview: "Interview",
        accepted: "Awarded 🎉",
      },
      stats: {
        total: "Total Tracked",
        inProgress: "In Progress",
        submitted: "Submitted",
        accepted: "Awarded",
      },
      modal: {
        addTitle: "Add Application to Pipeline",
        selectScholarship: "Select scholarship",
        chooseScholarship: "-- Choose a saved scholarship --",
        manualScholarship: "Or enter scholarship / program name",
        targetUniv: "Target university / institution",
        deadline: "Application deadline",
        cancel: "Cancel",
        submit: "Save application",
      },
    },
    mentorat: {
      title: "Alumni Mentorship Network",
      subtitle: "Get direct 1-on-1 guidance, mock interviews, and application reviews from verified laureates and engineers.",
      verifiedAlumni: "Verified Mentors",
      bookSession: "Book a video session",
      availableThisWeek: "Slots available this week",
      topicsCovered: "Mentoring topics:",
      modal: {
        title: "Book a session with",
        selectTopic: "Select session objective:",
        selectDate: "Desired date:",
        selectTime: "Time slot:",
        notes: "Specific notes or questions:",
        notesPlaceholder: "Ex: I need a review of my CV for Campus France and my Master application...",
        cancel: "Cancel",
        confirm: "Confirm booking (Free)",
        success: "Mentoring session booked successfully! You will receive the video meeting link via email.",
      },
    },
    documents: {
      title: "Document Vault & Portfolio",
      subtitle: "Centralize your official credentials to apply and auto-fill forms in 1 click.",
      uploadBtn: "Upload a document",
      totalStorage: "Encrypted & secure storage",
      docTypes: {
        cv: "Curriculum Vitae (CV)",
        passport: "Passport / ID Card",
        diploma: "Diploma / Degree",
        transcripts: "Academic Transcripts",
        certificate: "Attestation / Certificate",
        other: "Other official document",
      },
      dropPrompt: "Drop your file here or click to browse (PDF, PNG, JPG up to 10MB)",
      emptyVault: "No documents stored yet. Add your diplomas and transcripts to speed up applications.",
      deleteConfirm: "Delete",
    },
    settings: {
      title: "Settings & Preferences",
      subtitle: "Manage your account credentials, notifications, language and subscription plan.",
      accountSection: "Profile & Account",
      preferencesSection: "Language & Appearance",
      subscriptionSection: "Plan & Billing",
      languageLabel: "Application Language",
      themeLabel: "Display Theme",
      dark: "Dark",
      light: "Light",
      system: "System",
      activeSubscription: "Active Subscription",
      manageSubBtn: "Change or renew plan",
      downloadInvoice: "Download official receipt",
      dangerZone: "Danger Zone",
      deleteAccount: "Delete my account and data",
      logoutBtn: "Sign Out",
    },
    coach: {
      title: "Academic AI Coach",
      subtitle: "Your personal admissions and scholarship advisor available 24/7.",
      welcomeMsg: "Hello! I am your Boursio AI Coach. How can I assist you today with your scholarship applications or student visa procedures?",
      inputPlaceholder: "Ask anything about scholarships, visas, or essay writing advice...",
      sendBtn: "Send",
      clearBtn: "New conversation",
      quickActions: "Quick AI Tools:",
      letterTool: "Generate Motivation Letter",
      cvTool: "ATS CV Diagnostic",
      interviewTool: "Interview Simulator",
    },
    alerts: {
      title: "Alerts & Deadlines",
      subtitle: "Never miss a scholarship submission deadline.",
      noAlerts: "No active alerts yet. Add scholarships to your favorites to track their closing dates.",
      daysLeft: "days left",
      urgent: "Urgent",
      viewDetails: "View scholarship",
    },
    recommendations: {
      title: "Tailored Recommendations",
      subtitle: "Scholarships ranked and filtered according to compatibility with your academic profile.",
      searchPlaceholder: "Search by scholarship, university, country...",
      allDestinations: "All destinations",
      allDegrees: "All degree levels",
      matchScoreLabel: "Match Score",
      viewBourse: "View details",
      saveBourse: "Save",
      completeProfileAlert: "Complete your profile to unlock 100% accurate compatibility calculations.",
      completeProfileBtn: "Complete my profile",
    },
  },
};

// ── Root translations object ───────────────────────────────────────────────────
export const translations = {
  nav,
  hero,
  features,
  simulator,
  explorer,
  aiCoachDemo,
  how,
  roadmap,
  pricing,
  faq,
  contact,
  footer,
  picker,
  dashboard,
};

export type Translations = typeof translations;
