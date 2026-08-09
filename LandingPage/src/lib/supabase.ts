import { StudentProfile, UserNotification } from "./types";

// In browser / client environment, we use local storage as sync layer + ready for Supabase client setup
const STORAGE_KEYS = {
  PROFILE: "boursio_user_profile",
  LIKES: "boursio_user_likes",
  NOTIFS: "boursio_user_notifications",
};

export async function saveProfileToSupabase(profile: StudentProfile): Promise<boolean> {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const profiles = existing ? JSON.parse(existing) : {};
    profiles[profile.userId] = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profiles));
    return true;
  } catch (err) {
    console.error("Error saving profile:", err);
    return false;
  }
}

export async function getProfileFromSupabase(userId: string): Promise<StudentProfile | null> {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!existing) return null;
    const profiles = JSON.parse(existing);
    return profiles[userId] || null;
  } catch (err) {
    console.error("Error loading profile:", err);
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
  } catch (err) {
    return [];
  }
}

export async function getUserNotifications(userId: string): Promise<UserNotification[]> {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (!existing) return getInitialNotifications(userId);
    const notifsMap: Record<string, UserNotification[]> = JSON.parse(existing);
    return notifsMap[userId] || getInitialNotifications(userId);
  } catch (err) {
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
