import { Bourse } from "./types";
import rawBourses from "../data/bourses_rows.json";

function parseArrayField(field: any): string[] {
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      if (field.trim().startsWith("[") && field.trim().endsWith("]")) {
        return field
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
          .filter(Boolean);
      }
      if (field.trim().length > 0) return [field.trim()];
    }
  }
  return [];
}

/**
 * Checks if a scholarship's deadline has passed relative to today.
 */
export function isScholarshipExpired(bourse: any): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Check ISO deadline string (YYYY-MM-DD)
  if (bourse.deadline && typeof bourse.deadline === "string") {
    const deadlineDate = new Date(bourse.deadline);
    if (!isNaN(deadlineDate.getTime())) {
      deadlineDate.setHours(23, 59, 59, 999);
      if (deadlineDate < today) {
        return true; // Expired
      }
    }
  }

  // 2. Check year if past year
  const currentYear = today.getFullYear();
  if (bourse.annee && typeof bourse.annee === "number") {
    if (bourse.annee < currentYear) {
      return true; // Expired past year
    }
  }

  // 3. Try parsing deadline_raw if it contains explicit year (e.g. "14 July 2025")
  if (bourse.deadline_raw && typeof bourse.deadline_raw === "string") {
    const match = bourse.deadline_raw.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthStr = match[2];
      const year = parseInt(match[3], 10);
      const parsedDate = new Date(`${monthStr} ${day}, ${year}`);
      if (!isNaN(parsedDate.getTime())) {
        parsedDate.setHours(23, 59, 59, 999);
        if (parsedDate < today) {
          return true;
        }
      }
    }
  }

  return false;
}

export function getAllBourses(includeExpired: boolean = false): Bourse[] {
  const mapped = (rawBourses as any[]).map((raw) => {
    const niveau = parseArrayField(raw.niveau_etude);
    const domaines = parseArrayField(raw.domaines);
    const couverture = parseArrayField(raw.couverture);
    const criteres = parseArrayField(raw.criteres);
    const avantages = parseArrayField(raw.avantages);
    const pays = parseArrayField(raw.pays_destination);

    return {
      ...raw,
      niveau_etude: niveau.length > 0 ? niveau : ["licence", "master"],
      domaines: domaines.length > 0 ? domaines : ["Tous domaines"],
      couverture,
      criteres,
      avantages,
      pays_destination: pays,
      qualite_score: raw.qualite_score || 50,
      active: raw.active !== false,
    };
  });

  if (includeExpired) {
    return mapped;
  }

  // Filter out expired scholarships automatically to ensure users only see active/valid opportunities
  return mapped.filter((b) => !isScholarshipExpired(b));
}
