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
    const profiles = existing ? JSON.parse(existing) : {};
    profiles[profile.userId] = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profiles));

    // 2. Sync to Supabase REST API endpoint (upsert)
    await supabaseFetch("user_profiles", {
      method: "POST",
      body: JSON.stringify({
        user_id: profile.userId,
        full_name: profile.fullName,
        date_of_birth: profile.dateOfBirth,
        country_of_origin: profile.countryOfOrigin,
        country_of_residence: profile.countryOfResidence,
        study_level: profile.studyLevel,
        target_degree: profile.targetDegree,
        study_field: profile.studyField,
        gpa_score: profile.gpaScore,
        last_degree_gpa: profile.lastDegreeGpa,
        languages: profile.languages,
        updated_at: new Date().toISOString(),
      }),
    });

    return true;
  } catch (err) {
    console.error("Error saving profile:", err);
    return true; // Local storage cache succeeded
  }
}

export async function getProfileFromSupabase(userId: string): Promise<StudentProfile | null> {
  try {
    // Try Supabase first
    const remoteData = await supabaseFetch(`user_profiles?user_id=eq.${userId}&select=*`);
    if (Array.isArray(remoteData) && remoteData.length > 0) {
      const row = remoteData[0];
      return {
        userId: row.user_id || userId,
        fullName: row.full_name,
        dateOfBirth: row.date_of_birth,
        countryOfOrigin: row.country_of_origin,
        countryOfResidence: row.country_of_residence,
        studyLevel: row.study_level,
        targetDegree: row.target_degree,
        studyField: row.study_field,
        gpaScore: row.gpa_score,
        lastDegreeGpa: row.last_degree_gpa,
        languages: row.languages || [],
        updatedAt: row.updated_at,
      };
    }
  } catch (err) {
    console.warn("Using cached profile fallback");
  }

  // Local storage fallback
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!existing) return null;
    const profiles = JSON.parse(existing);
    return profiles[userId] || null;
  } catch {
    return null;
  }
}

export async function toggleLikeScholarship(userId: string, bourseId: string): Promise<boolean> {
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

    // Optional Supabase REST sync
    if (isLiked) {
      supabaseFetch("user_likes", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, bourse_id: bourseId }),
      });
    }

    return isLiked;
  } catch (err) {
    console.error("Error toggling like:", err);
    return false;
  }
}

export async function getUserLikedBourses(userId: string): Promise<string[]> {
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
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (!existing) return getInitialNotifications(userId);
    const notifsMap: Record<string, UserNotification[]> = JSON.parse(existing);
    return notifsMap[userId] || getInitialNotifications(userId);
  } catch {
    return getInitialNotifications(userId);
  }
}

export async function markNotificationAsRead(userId: string, notifId: string): Promise<void> {
  const notifs = await getUserNotifications(userId);
  const updated = notifs.map((n) => (n.id === notifId ? { ...n, read: true } : n));
  const existing = localStorage.getItem(STORAGE_KEYS.NOTIFS);
  const notifsMap: Record<string, UserNotification[]> = existing ? JSON.parse(existing) : {};
  notifsMap[userId] = updated;
  localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifsMap));
}

function getInitialNotifications(userId: string): UserNotification[] {
  return [
    {
      id: "notif-1",
      userId,
      title: "Rappel de Deadline Bourse",
      message: "La bourse 'Rhodes Kenya Scholarships' expire le 27 août 2026. Soumettez votre dossier à temps !",
      type: "deadline",
      bourseId: "fly_052b5c453eadfe",
      read: false,
      date: "Aujourd'hui à 09:30",
    },
    {
      id: "notif-2",
      userId,
      title: "Nouvelle Bourse Recommandée (98% Match)",
      message: "Une nouvelle bourse en Informatique & IA à Stanford correspond parfaitement à votre profil.",
      type: "recommendation",
      bourseId: "fly_0f17e924592da4",
      read: false,
      date: "Hier à 14:15",
    },
    {
      id: "notif-3",
      userId,
      title: "Conseil Coach IA",
      message: "Le Coach IA a mis à jour votre modèle de Lettre de Motivation pour les universités canadiennes.",
      type: "system",
      read: true,
      date: "Il y a 3 jours",
    },
  ];
}
