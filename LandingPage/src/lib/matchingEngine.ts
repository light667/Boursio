import { Bourse, StudentProfile } from "./types";

export function calculateScholarshipMatch(
  bourse: Bourse,
  profile: StudentProfile | null
): { score: number; reasons: string[] } {
  if (!profile) {
    // If profile is not yet filled, return a base match indicator requiring profile completion
    return {
      score: 50,
      reasons: ["Veuillez compléter votre profil étudiant pour afficher votre score de matching réel"],
    };
  }

  let score = 40; // Base score
  const reasons: string[] = [];

  // 1. Study Level & Target Degree matching (Weight: 25 pts)
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
    score += 20;
    reasons.push(`Niveau d'étude cible (${profile.targetDegree || profile.studyLevel}) éligible`);
  }

  // 2. Field of Study / Domain matching (Weight: 25 pts)
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
    score += 20;
    if (studentField) {
      reasons.push(`Filière d'étude (${profile.studyField}) correspondant aux domaines de la bourse`);
    } else {
      reasons.push("Ouvert à tous les domaines d'études");
    }
  }

  // 3. African & Nationality Eligibility (Weight: 15 pts)
  const originCountry = (profile.countryOfOrigin || "").toLowerCase();
  const residenceCountry = (profile.countryOfResidence || "").toLowerCase();

  if (bourse.africains_eligibles) {
    score += 10;
    reasons.push("Spécialement réservé/ouvert aux étudiants africains");
  }

  if (originCountry || residenceCountry) {
    score += 5;
    reasons.push(`Pays d'origine (${profile.countryOfOrigin}) éligible`);
  }

  // 4. GPA & Academic Performance matching (Weight: 10 pts)
  const studentGpa = Math.max(profile.gpaScore || 0, profile.lastDegreeGpa || 0);
  if (studentGpa >= 16) {
    score += 10;
    reasons.push(`Excellente moyenne académique (${studentGpa}/20)`);
  } else if (studentGpa >= 14) {
    score += 7;
    reasons.push(`Très bonne moyenne académique (${studentGpa}/20)`);
  } else if (studentGpa >= 12) {
    score += 4;
    reasons.push(`Bonne moyenne académique (${studentGpa}/20)`);
  }

  // 5. Full Funding Preference (Weight: 5 pts)
  if (bourse.financement === "TOTAL") {
    score += 5;
    reasons.push("Prise en charge financière intégrale (Bourse Totale)");
  }

  // Final score bounded between 40% and 99%
  const finalScore = Math.min(Math.max(Math.round(score), 40), 99);

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
