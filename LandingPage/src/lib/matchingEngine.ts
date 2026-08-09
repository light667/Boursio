import { Bourse, StudentProfile } from "./types";

export function calculateScholarshipMatch(
  bourse: Bourse,
  profile: StudentProfile | null
): { score: number; reasons: string[] } {
  if (!profile) {
    // Default base score when profile is missing
    const baseScore = Math.min(Math.max(bourse.qualite_score || 50, 40), 95);
    return {
      score: baseScore,
      reasons: ["Complétez votre profil pour un calcul sur-mesure"],
    };
  }

  let score = 50; // Base score
  const reasons: string[] = [];

  // 1. Study Level & Target Degree matching
  const bourseLevelsRaw = bourse.niveau_etude;
  let bourseLevels: string[] = [];
  if (Array.isArray(bourseLevelsRaw)) {
    bourseLevels = bourseLevelsRaw.map((l) => l.toLowerCase());
  } else if (typeof bourseLevelsRaw === "string") {
    try {
      const parsed = JSON.parse(bourseLevelsRaw);
      if (Array.isArray(parsed)) bourseLevels = parsed.map((l) => l.toLowerCase());
    } catch {
      bourseLevels = [bourseLevelsRaw.toLowerCase()];
    }
  }

  const targetDeg = (profile.targetDegree || "").toLowerCase();
  const currentLevel = (profile.studyLevel || "").toLowerCase();

  const isLevelMatch =
    bourseLevels.some((l) => targetDeg.includes(l) || l.includes(targetDeg)) ||
    bourseLevels.some((l) => currentLevel.includes(l) || l.includes(currentLevel)) ||
    bourseLevels.length === 0;

  if (isLevelMatch) {
    score += 15;
    reasons.push(`Niveau d'étude (${profile.targetDegree || profile.studyLevel}) correspond`);
  }

  // 2. Field of Study / Domain matching
  const bourseDomainsRaw = bourse.domaines;
  let bourseDomains: string[] = [];
  if (Array.isArray(bourseDomainsRaw)) {
    bourseDomains = bourseDomainsRaw.map((d) => d.toLowerCase());
  } else if (typeof bourseDomainsRaw === "string") {
    try {
      const parsed = JSON.parse(bourseDomainsRaw);
      if (Array.isArray(parsed)) bourseDomains = parsed.map((d) => d.toLowerCase());
    } catch {
      bourseDomains = [bourseDomainsRaw.toLowerCase()];
    }
  }

  const studentField = (profile.studyField || "").toLowerCase();

  const isDomainMatch =
    bourseDomains.some(
      (d) =>
        d.includes("tous domaines") ||
        d.includes("all fields") ||
        d.includes(studentField) ||
        studentField.includes(d)
    ) || bourseDomains.length === 0;

  if (isDomainMatch) {
    score += 15;
    if (studentField) {
      reasons.push(`Domaine d'étude (${profile.studyField}) éligible`);
    } else {
      reasons.push("Ouvert à tous les domaines");
    }
  }

  // 3. African & Nationality Eligibility
  const africanCountries = [
    "sénégal", "senegal", "côte d'ivoire", "cote d'ivoire", "cameroun", "cameroon",
    "bénin", "benin", "togo", "mali", "guinée", "guinea", "burkina faso", "niger",
    "gabon", "congo", "rdc", "rd congo", "maroc", "tunisie", "algérie", "madagascar",
    "rwanda", "burundi", "tchad", "mauritanie", "kenya", "ghana", "nigeria"
  ];

  const originCountry = (profile.countryOfOrigin || "").toLowerCase();
  const residenceCountry = (profile.countryOfResidence || "").toLowerCase();
  const isAfrican =
    africanCountries.some((c) => originCountry.includes(c) || residenceCountry.includes(c)) || true; // Default true for target audience

  if (bourse.africains_eligibles && isAfrican) {
    score += 12;
    reasons.push("Spécialement ouvert aux ressortissants africains");
  }

  // 4. GPA & Academic Performance matching
  const studentGpa = Math.max(profile.gpaScore || 0, profile.lastDegreeGpa || 0);
  if (studentGpa >= 16) {
    score += 8;
    reasons.push("Excellente moyenne académique (≥ 16/20)");
  } else if (studentGpa >= 14) {
    score += 5;
    reasons.push("Très bonne moyenne académique (≥ 14/20)");
  }

  // 5. Funding Type preference
  if (bourse.financement === "TOTAL") {
    score += 5;
    reasons.push("Prise en charge intégrale (Bourse Totalement Financée)");
  }

  // Cap score between 35% and 99%
  const finalScore = Math.min(Math.max(Math.round(score), 35), 99);

  return {
    score: finalScore,
    reasons,
  };
}

export function rankBoursesForStudent(
  bourses: Bourse[],
  profile: StudentProfile | null
): Bourse[] {
  return bourses
    .map((b) => {
      const match = calculateScholarshipMatch(b, profile);
      return {
        ...b,
        matchScore: match.score,
        matchReasons: match.reasons,
      };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
