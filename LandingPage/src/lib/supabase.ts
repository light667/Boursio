import { StudentProfile, UserNotification } from "./types";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://nymqiqkuotwuccitbzfq.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bXFpcWt1b3R3dWNjaXRiemZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTkzMjksImV4cCI6MjA5NjMzNTMyOX0.XMf3EXg6mQqRxhtnICcgGAGyXyYGBZ4lkxmV4g3d9qY";

const STORAGE_KEYS = {
  PROFILE: "boursio_user_profile",
  LIKES: "boursio_user_likes",
  NOTIFS: "boursio_user_notifications",
};

// Helper for direct Supabase REST API requests
async function supabaseFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    };
    const res = await fetch(url, { ...options, headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Supabase REST request notice:", err);
  }
  return null;
}

export async function saveProfileToSupabase(profile: StudentProfile): Promise<boolean> {
  try {
    // 1. Save to local storage cache for instant offline responsiveness
    const existing = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const profilesMap = existing ? JSON.parse(existing) : {};
    profilesMap[profile.userId] = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profilesMap));

    // 2. Sync to Supabase `profiles` table (POST / upsert)
    const payload = {
      firebase_uid: profile.userId,
      full_name: profile.fullName,
      birth_date: profile.dateOfBirth || null,
      nationality: profile.countryOfOrigin || "",
      country: profile.countryOfResidence || "",
      education_level: profile.studyLevel,
      field_of_study: profile.studyField,
      university: profile.university || "",
      gpa: profile.gpaScore,
      french_level: profile.frenchLevel || (profile.languages?.find((l) => l.language.toLowerCase().includes("fran"))?.level || "Bilingue"),
      english_level: profile.englishLevel || (profile.languages?.find((l) => l.language.toLowerCase().includes("ang"))?.level || "Intermédiaire"),
      target_fields: profile.targetFields || [profile.targetDegree],
      academic_goals: profile.academicGoals || "",
      cv_url: profile.cvUrl || "",
      photo_url: profile.photoUrl || "",
      avatar_url: profile.photoUrl || "",
    };

    await supabaseFetch("profiles", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return true;
  } catch (err) {
    console.error("Error saving profile:", err);
    return true; // Local storage cache succeeded
  }
}

export async function getProfileFromSupabase(userId: string): Promise<StudentProfile | null> {
  if (!userId) return null;

  try {
    // 1. Try Supabase profiles table first
    const remoteData = await supabaseFetch(`profiles?firebase_uid=eq.${userId}&select=*`);
    if (Array.isArray(remoteData) && remoteData.length > 0) {
      const row = remoteData[0];
      return {
        userId: row.firebase_uid || userId,
        fullName: row.full_name || "",
        dateOfBirth: row.birth_date || "",
        countryOfOrigin: row.nationality || "",
        countryOfResidence: row.country || "",
        studyLevel: row.education_level || "Licence 3",
        targetDegree: Array.isArray(row.target_fields) && row.target_fields.length > 0 ? row.target_fields[0] : "Master",
        studyField: row.field_of_study || "",
        university: row.university || "",
        gpaScore: row.gpa ? Number(row.gpa) : 0,
        lastDegreeGpa: row.gpa ? Number(row.gpa) : 0,
        frenchLevel: row.french_level,
        englishLevel: row.english_level,
        languages: [
          { language: "Français", level: row.french_level || "Bilingue" },
          { language: "Anglais", level: row.english_level || "Intermédiaire" },
        ],
        cvUrl: row.cv_url,
        photoUrl: row.photo_url || row.avatar_url,
        updatedAt: row.created_at,
      };
    }
  } catch (err) {
    console.warn("Using cached profile fallback");
  }

  // 2. Local storage fallback
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!existing) return null;
    const profilesMap = JSON.parse(existing);
    return profilesMap[userId] || null;
  } catch {
    return null;
  }
}

export async function toggleLikeScholarship(userId: string, bourseId: string): Promise<boolean> {
  if (!userId) return false;

  try {
    const existing = localStorage.getItem(STORAGE_KEYS.LIKES);
    const likesMap: Record<string, string[]> = existing ? JSON.parse(existing) : {};
    const userLikes = likesMap[userId] || [];

    let isLiked = false;
    if (userLikes.includes(bourseId)) {
      likesMap[userId] = userLikes.filter((id) => id !== bourseId);
      isLiked = false;
    } else {
      likesMap[userId] = [...userLikes, bourseId];
      isLiked = true;
    }

    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likesMap));

    // Sync with Supabase swipes table if liked
    if (isLiked) {
      supabaseFetch("swipes", {
        method: "POST",
        body: JSON.stringify({ firebase_uid: userId, bourse_id: bourseId, action: "like" }),
      });
    }

    return isLiked;
  } catch (err) {
    console.error("Error toggling like:", err);
    return false;
  }
}

export async function getUserLikedBourses(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.LIKES);
    if (!existing) return [];
    const likesMap: Record<string, string[]> = JSON.parse(existing);
    return likesMap[userId] || [];
  } catch {
    return [];
  }
}

export async function getUserNotifications(userId: string): Promise<UserNotification[]> {
  if (!userId) return [];
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (!existing) return [];
    const notifsMap: Record<string, UserNotification[]> = JSON.parse(existing);
    return notifsMap[userId] || [];
  } catch {
    return [];
  }
}

export async function markNotificationAsRead(userId: string, notifId: string): Promise<void> {
  if (!userId) return;
  const notifs = await getUserNotifications(userId);
  const updated = notifs.map((n) => (n.id === notifId ? { ...n, read: true } : n));
  const existing = localStorage.getItem(STORAGE_KEYS.NOTIFS);
  const notifsMap: Record<string, UserNotification[]> = existing ? JSON.parse(existing) : {};
  notifsMap[userId] = updated;
  localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifsMap));
}
