export interface StudentProfile {
  id?: string;
  userId: string; // Maps to firebase_uid
  fullName: string; // full_name
  dateOfBirth: string; // birth_date
  countryOfOrigin: string; // nationality
  countryOfResidence: string; // country
  studyLevel: string; // education_level e.g. "Baccalauréat", "Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2", "Doctorat"
  targetDegree: string; // e.g. "Licence", "Master", "Doctorat", "Recherche"
  studyField: string; // field_of_study (e.g. Informatique, Médecine...)
  university?: string; // university
  gpaScore: number; // gpa (e.g. 15.5 / 20)
  lastDegreeGpa?: number; // Moyenne du dernier diplôme
  frenchLevel?: string; // french_level
  englishLevel?: string; // english_level
  languages: {
    language: string;
    level: "Débutant" | "Intermédiaire" | "Avancé" | "Bilingue" | "C1/C2" | "B1/B2";
  }[];
  targetCountries?: string[]; // target_countries
  targetFields?: string[]; // target_fields
  academicGoals?: string; // academic_goals
  cvUrl?: string; // cv_url (Optional CV link)
  photoUrl?: string; // photo_url / avatar_url (Optional avatar link)
  updatedAt?: string;
}

export interface Bourse {
  id: string;
  slug: string;
  titre: string;
  url: string;
  source?: string;
  sources?: string;
  sources_ids?: string;
  deadline?: string | null;
  deadline_raw?: string | null;
  date_publication?: string;
  annee?: number | null;
  universite?: string | null;
  pays_destination?: string | string[];
  lieu_etude?: string | null;
  niveau_etude?: string | string[]; // e.g. '["licence", "master"]'
  financement?: "TOTAL" | "PARTIEL" | "INCONNU" | string;
  montant_bourse?: string | null;
  nb_bourses?: string | null;
  domaines?: string | string[]; // e.g. '["Informatique", "Ingénierie"]'
  langues_requises?: string | string[];
  nationalites_eligibles?: string | string[];
  africains_eligibles?: boolean;
  description?: string;
  avantages?: string | string[];
  criteres?: string | string[];
  couverture?: string | string[];
  lien_candidature?: string | null;
  image_url?: string | null;
  active?: boolean;
  qualite_score?: number;
  created_at?: string;
  updated_at?: string;

  // Dynamic matching properties
  matchScore?: number; // 0 to 100%
  matchReasons?: string[];
}

export interface LikedScholarship {
  userId: string;
  bourseId: string;
  createdAt: string;
  notificationFrequency: "daily" | "weekly" | "off";
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "deadline" | "recommendation" | "similar" | "system";
  bourseId?: string;
  read: boolean;
  date: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
