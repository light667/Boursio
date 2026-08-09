import React, { useState, useEffect } from "react";
import { UserNotification, Bourse } from "@/lib/types";
import { getUserNotifications, markNotificationAsRead } from "@/lib/supabase";
import {
  Bell,
  CheckCircle,
  Calendar,
  Sparkles,
  Mail,
  Smartphone,
  Heart,
  Clock,
  ExternalLink,
  Sliders,
} from "lucide-react";

interface AlertesViewProps {
  userId: string;
  likedBourses: Bourse[];
}

export const AlertesView: React.FC<AlertesViewProps> = ({ userId, likedBourses }) => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    getUserNotifications(userId).then(setNotifications);
  }, [userId]);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(userId, id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-secondary/40 to-primary/10 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-accent shadow-glow">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Alertes & Notifications Personnalisées
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ne ratez plus aucune deadline. Recevez des notifications ciblées sur vos bourses favoris et nouvelles opportunités.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings Bar */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
          <Sliders className="h-4 w-4 text-accent" /> Canaux d'Alerte et Fréquence
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Email Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs font-semibold text-foreground">Alertes par E-mail</div>
                <div className="text-[11px] text-muted-foreground">Recevez les récapitulatifs</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
            />
          </div>

          {/* Push Phone Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-accent" />
              <div>
                <div className="text-xs font-semibold text-foreground">Notifications Mobile</div>
                <div className="text-[11px] text-muted-foreground">Alertes directes smartphone</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={pushNotifs}
              onChange={(e) => setPushNotifs(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-accent"
            />
          </div>

          {/* Frequency Selector */}
          <div className="flex flex-col justify-center rounded-xl border border-border bg-secondary/50 p-4">
            <div className="text-xs font-semibold text-foreground mb-1">Fréquence de rappel</div>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="rounded-lg border border-border bg-input px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="daily">Chaque jour (Quotidien)</option>
              <option value="weekly">Chaque semaine (Hebdomadaire)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liked Scholarships Deadline Watchlist */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" /> Bourses Suivies ({likedBourses.length})
          </h3>
          <span className="text-xs text-muted-foreground">Suivi automatique des dates limites</span>
        </div>

        {likedBourses.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-4 text-center">
            Vous n'avez pas encore liké de bourse. Cliquez sur le cœur ❤️ d'une bourse dans l'onglet Recommandations pour l'ajouter à vos alertes.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {likedBourses.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3.5 hover:border-primary/40 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-foreground line-clamp-1">{b.titre}</h4>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-primary" />{" "}
                    {b.deadline_raw || b.deadline || "Date à venir"}
                  </p>
                </div>
                <a
                  href={b.lien_candidature || b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-primary/20 p-2 text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications Feed */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Flux de Notifications Récentes
        </h3>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkAsRead(notif.id)}
              className={`flex items-start justify-between rounded-xl border p-4 transition-all cursor-pointer ${
                notif.read
                  ? "border-border bg-secondary/20 text-muted-foreground"
                  : "border-primary/30 bg-primary/5 text-foreground shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    notif.type === "deadline"
                      ? "bg-rose-500/20 text-rose-500"
                      : notif.type === "recommendation"
                      ? "bg-accent/20 text-accent"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {notif.type === "deadline" ? (
                    <Calendar className="h-4 w-4" />
                  ) : notif.type === "recommendation" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-foreground">{notif.title}</h4>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {notif.message}
                  </p>
                  <span className="mt-2 block text-[10px] opacity-60">{notif.date}</span>
                </div>
              </div>

              {!notif.read && (
                <button
                  type="button"
                  title="Marquer comme lu"
                  className="p-1 text-muted-foreground hover:text-accent"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
