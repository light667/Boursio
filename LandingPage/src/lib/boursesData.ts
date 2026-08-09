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

export function getAllBourses(): Bourse[] {
  return (rawBourses as any[]).map((raw) => {
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
}
