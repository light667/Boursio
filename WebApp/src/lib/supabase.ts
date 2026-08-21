import { StudentProfile, UserNotification, UserDocument } from "./types";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://nymqiqkuotwuccitbzfq.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const STORAGE_KEYS = {
  PROFILE: "boursio_user_profile",
  LIKES: "boursio_user_likes",
  NOTIFS: "boursio_user_notifications",
  DOCUMENTS: "boursio_user_documents",
};

/**
 * Upload a file directly to Supabase Storage REST API (bucket: "images" or "documents")
 */
export async function uploadFileToSupabaseStorage(
  bucket: "images" | "documents",
  file: File,
  userId: string,
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // If Supabase key is present, upload to Supabase Storage REST API
  if (SUPABASE_ANON_KEY) {
    try {
      const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "x-upsert": "true",
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (res.ok) {
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
        return publicUrl;
      } else {
        console.warn("Supabase Storage REST upload failed with status:", res.status);
      }
    } catch (err) {
      console.error("Error uploading to Supabase Storage:", err);
    }
  }

  // Fallback to Data URL for local presentation / offline fallback
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

/**
 * Get user uploaded documents
 */
export async function getUserDocumentsFromSupabase(userId: string): Promise<UserDocument[]> {
  const effectiveId = userId || "guest";

  // Try Supabase table first
  if (userId && userId !== "guest") {
    try {
      const remoteData = await supabaseFetch(`user_documents?firebase_uid=eq.${userId}&select=*`);
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        return remoteData.map((row: any) => ({
          id: row.id || String(row.created_at),
          userId: row.firebase_uid,
          name: row.name,
          type: row.type,
          fileUrl: row.file_url,
          fileSize: row.file_size,
          uploadedAt: row.created_at || new Date().toISOString(),
        }));
      }
    } catch {
      console.warn("Using local cache for user documents");
    }
  }

  // Local Storage fallback with cross-session merge
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!existing) return [];
    const map: Record<string, UserDocument[]> = JSON.parse(existing);
    const userDocs = map[effectiveId] || [];
    const guestDocs = map["guest"] || [];
    if (effectiveId !== "guest" && userDocs.length === 0 && guestDocs.length > 0) {
      map[effectiveId] = guestDocs;
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(map));
      return guestDocs;
    }
    return userDocs;
  } catch {
    return [];
  }
}

/**
 * Save user document record
 */
export async function saveUserDocumentToSupabase(
  userId: string,
  doc: Omit<UserDocument, "id" | "userId" | "uploadedAt">,
): Promise<UserDocument> {
  const effectiveId = userId || "guest";
  const newDoc: UserDocument = {
    ...doc,
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: effectiveId,
    uploadedAt: new Date().toISOString(),
  };

  // 1. Save to Local Storage cache
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    const map: Record<string, UserDocument[]> = existing ? JSON.parse(existing) : {};
    const userDocs = map[effectiveId] || [];
    map[effectiveId] = [newDoc, ...userDocs];
    // Also save in guest if not logged in
    if (effectiveId !== "guest") {
      map["guest"] = [newDoc, ...(map["guest"] || [])];
    }
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(map));
  } catch (err) {
    console.error("Error saving document to local cache:", err);
  }

  // 2. Sync to Supabase user_documents table
  if (userId && userId !== "guest") {
    try {
      await supabaseFetch("user_documents", {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          firebase_uid: userId,
          name: newDoc.name,
          type: newDoc.type,
          file_url: newDoc.fileUrl,
          file_size: newDoc.fileSize,
        }),
      });
    } catch (err) {
      console.warn("Supabase document record sync skipped");
    }
  }

  return newDoc;
}

/**
 * Delete user document
 */
export async function deleteUserDocumentFromSupabase(
  userId: string,
  docId: string,
): Promise<boolean> {
  const effectiveId = userId || "guest";

  // Local Storage
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (existing) {
      const map: Record<string, UserDocument[]> = JSON.parse(existing);
      if (map[effectiveId]) {
        map[effectiveId] = map[effectiveId].filter((d) => d.id !== docId);
      }
      if (map["guest"]) {
        map["guest"] = map["guest"].filter((d) => d.id !== docId);
      }
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(map));
    }
  } catch (err) {
    console.error("Error deleting document locally:", err);
  }

  // Supabase Table
  if (userId && userId !== "guest") {
    try {
      await supabaseFetch(`user_documents?id=eq.${docId}&firebase_uid=eq.${userId}`, {
        method: "DELETE",
      });
    } catch {
      // Ignore error
    }
  }

  return true;
}

// Helper for direct Supabase REST API requests with retries and timeout
async function supabaseFetch(endpoint: string, options: RequestInit = {}, retries = 2) {
  if (!SUPABASE_ANON_KEY) {
    console.warn("VITE_SUPABASE_ANON_KEY is not defined. Falling back to local cache.");
    return null;
  }

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
    ...(options.headers || {}),
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      if (attempt === retries) {
        console.warn(`Supabase REST request failed after ${retries + 1} attempts:`, err);
      } else {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }

  return null;
}

export async function saveProfileToSupabase(profile: StudentProfile): Promise<boolean> {
  const effectiveId = profile.userId || "guest";
  try {
    // 1. Save to local storage cache for instant offline responsiveness
    const existing = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const profilesMap = existing ? JSON.parse(existing) : {};
    const updatedProfile = {
      ...profile,
      userId: effectiveId,
      updatedAt: new Date().toISOString(),
    };
    profilesMap[effectiveId] = updatedProfile;
    profilesMap["guest"] = updatedProfile;
    localStorage.setItem("boursio_latest_profile", JSON.stringify(updatedProfile));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profilesMap));

    // 2. Sync to Supabase `profiles` table with upsert header
    if (profile.userId && profile.userId !== "guest") {
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
        french_level:
          profile.frenchLevel ||
          profile.languages?.find((l) => l.language.toLowerCase().includes("fran"))?.level ||
          "Bilingue",
        english_level:
          profile.englishLevel ||
          profile.languages?.find((l) => l.language.toLowerCase().includes("ang"))?.level ||
          "Intermédiaire",
        target_fields: profile.targetFields || [profile.targetDegree],
        academic_goals: profile.academicGoals || "",
        cv_url: profile.cvUrl || "",
        photo_url: profile.photoUrl || "",
        avatar_url: profile.photoUrl || "",
      };

      await supabaseFetch("profiles", {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(payload),
      });
    }

    return true;
  } catch (err) {
    console.error("Error saving profile:", err);
    return true; // Local storage cache succeeded
  }
}

export async function getProfileFromSupabase(userId: string): Promise<StudentProfile | null> {
  const effectiveId = userId || "guest";

  try {
    // 1. Try Supabase profiles table first if valid user
    if (userId && userId !== "guest") {
      const remoteData = await supabaseFetch(`profiles?firebase_uid=eq.${userId}&select=*`);
      if (Array.isArray(remoteData) && remoteData.length > 0 && remoteData[0]?.full_name) {
        const row = remoteData[0];
        return {
          userId: row.firebase_uid || userId,
          fullName: row.full_name || "",
          dateOfBirth: row.birth_date || "",
          countryOfOrigin: row.nationality || "",
          countryOfResidence: row.country || "",
          studyLevel: row.education_level || "Licence 3",
          targetDegree:
            Array.isArray(row.target_fields) && row.target_fields.length > 0
              ? row.target_fields[0]
              : "Master",
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
    }
  } catch (err) {
    console.warn("Using cached profile fallback");
  }

  // 2. Local storage multi-level fallback
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (existing) {
      const profilesMap = JSON.parse(existing);
      if (profilesMap[effectiveId]?.fullName) return profilesMap[effectiveId];
      if (profilesMap["guest"]?.fullName) return profilesMap["guest"];
    }

    const latest = localStorage.getItem("boursio_latest_profile");
    if (latest) {
      return JSON.parse(latest);
    }
  } catch {
    return null;
  }

  return null;
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

