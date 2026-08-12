import { describe, it, expect } from "vitest";
import { calculateScholarshipMatch, rankBoursesForStudent } from "../matchingEngine";
import { Bourse, StudentProfile } from "../types";

describe("Scholarship Matching Engine", () => {
  const sampleBourse: Bourse = {
    id: "bourse-1",
    slug: "bourse-eiffel-master",
    url: "https://example.com/bourse-eiffel",
    titre: "Bourse Eiffel Master",
    universite: "Universités Françaises",
    pays_destination: ["France"],
    niveau_etude: ["Master"],
    domaines: ["Informatique", "Ingénierie"],
    financement: "TOTAL",
    africains_eligibles: true,
    active: true,
    qualite_score: 95,
  };

  const sampleStudent: StudentProfile = {
    userId: "user-123",
    fullName: "Amadou Diallo",
    dateOfBirth: "2000-01-15",
    countryOfOrigin: "Sénégal",
    countryOfResidence: "Sénégal",
    studyLevel: "Licence 3",
    targetDegree: "Master",
    studyField: "Informatique",
    gpaScore: 16.5,
    lastDegreeGpa: 16.5,
    languages: [
      { language: "Français", level: "Bilingue" },
      { language: "Anglais", level: "Intermédiaire" },
    ],
  };

  it("should calculate a high match score for an eligible profile", () => {
    const result = calculateScholarshipMatch(sampleBourse, sampleStudent);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("should return a base 50% match if profile is null", () => {
    const result = calculateScholarshipMatch(sampleBourse, null);
    expect(result.score).toBe(50);
    expect(result.reasons[0]).toContain("Veuillez compléter votre profil");
  });

  it("should rank bourses in descending order of matchScore", () => {
    const bourseLowMatch: Bourse = {
      id: "bourse-2",
      slug: "bourse-arts-design",
      url: "https://example.com/bourse-arts",
      titre: "Bourse Arts & Design",
      niveau_etude: ["Doctorat"],
      domaines: ["Design"],
      financement: "PARTIEL",
      africains_eligibles: false,
    };

    const ranked = rankBoursesForStudent([bourseLowMatch, sampleBourse], sampleStudent);
    expect(ranked[0].id).toBe("bourse-1");
    expect(ranked[0].matchScore || 0).toBeGreaterThan(ranked[1].matchScore || 0);
  });
});
