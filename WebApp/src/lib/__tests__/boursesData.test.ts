import { describe, it, expect } from "vitest";
import { isScholarshipExpired, getAllBourses } from "../boursesData";

describe("Bourses Data & Expiration Logic", () => {
  it("should detect past deadline dates as expired", () => {
    const expiredBourse = {
      id: "exp-1",
      deadline: "2020-01-01",
    };
    expect(isScholarshipExpired(expiredBourse)).toBe(true);
  });

  it("should detect future deadline dates as active", () => {
    const futureBourse = {
      id: "act-1",
      deadline: "2030-12-31",
    };
    expect(isScholarshipExpired(futureBourse)).toBe(false);
  });

  it("should return a populated array of bourses from database", () => {
    const bourses = getAllBourses(true);
    expect(Array.isArray(bourses)).toBe(true);
    expect(bourses.length).toBeGreaterThan(0);
  });
});
