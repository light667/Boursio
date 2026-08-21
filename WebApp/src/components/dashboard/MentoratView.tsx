import React, { useState } from "react";
import { MentorProfile, MentorshipBooking, StudentProfile } from "@/lib/types";
import { toast } from "sonner";
import {
  Users,
  Star,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Sparkles,
  Search,
  MessageSquare,
  BookOpen,
  Filter,
  Check,
} from "lucide-react";
import logo from "@/assets/logo.png";

const VERIFIED_MENTORS: MentorProfile[] = [
  {
    id: "m_benjamin",
    name: "DOH Kodzo Benjamin",
    avatar: "/ben_image.JPG",
    role: "Ingénieur en Génie Mécanique & Spécialiste Campus France",
    scholarshipObtained: "Procédures Campus France & Mobilité Internationale",
    university: "Écoles d'Ingénieurs & Universités (France)",
    country: "France 🇫🇷 (Origine : Togo 🇹🇬)",
    field: "Ingénierie Mécanique & Technologies",
    rating: 5.0,
    reviewCount: 1,
    bio: "Ingénieur en Génie Mécanique. J'accompagne les étudiants et futurs ingénieurs dans toutes les étapes de leur candidature Campus France, l'obtention des pré-inscriptions et la constitution de dossiers solides pour les bourses françaises.",
    topics: [
      "Accompagnement complet Campus France",
      "Relecture & Structuration de CV d'Ingénieur",
      "Préparation aux entretiens consulaires & Visa étudiant",
      "Stratégie de choix des universités et écoles en France",
    ],
    hourlyAvailability: "Créneaux disponibles cette semaine",
    verified: true,
  },
];

interface MentoratViewProps {
  userId?: string;
  studentProfile?: StudentProfile | null;
}

export const MentoratView: React.FC<MentoratViewProps> = ({ userId, studentProfile }) => {
  const [mentors] = useState<MentorProfile[]>(VERIFIED_MENTORS);
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [bookingTopic, setBookingTopic] = useState("Relecture de dossier & CV");
  const [bookingDate, setBookingDate] = useState("Samedi 15:00 GMT");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookings, setBookings] = useState<MentorshipBooking[]>(() => {
    try {
      const raw = localStorage.getItem(`boursio_mentorship_bookings_${userId || "guest"}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const filteredMentors = mentors.filter((m) => {
    const matchSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.scholarshipObtained.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.field.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCountry =
      countryFilter === "ALL" ||
      (countryFilter === "FR" && m.country.includes("France")) ||
      (countryFilter === "CA" && m.country.includes("Canada")) ||
      (countryFilter === "UK" && m.country.includes("Royaume-Uni")) ||
      (countryFilter === "JP" && m.country.includes("Japon"));

    return matchSearch && matchCountry;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    const newBooking: MentorshipBooking = {
      id: `book_${Date.now()}`,
      userId: userId || "guest",
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      topic: bookingTopic,
      date: new Date().toLocaleDateString("fr-FR"),
      timeSlot: bookingDate,
      status: "confirmed",
      meetingLink: "https://meet.google.com/bou-rsio-call",
      notes: bookingNotes,
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    try {
      localStorage.setItem(`boursio_mentorship_bookings_${userId || "guest"}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    toast.success(`Séance réservée avec succès avec ${selectedMentor.name} !`);
    setSelectedMentor(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Hub de Mentorat & Réseau d'Alumni
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Échangez en direct avec des lauréats des plus prestigieuses bourses mondiales pour
                sécuriser votre dossier.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booked Sessions Alert Banner if any */}
      {bookings.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Video className="h-4 w-4" /> Vos Sessions de Mentorat Programmées ({bookings.length})
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-emerald-500/20 bg-card p-3 space-y-1.5 text-xs text-foreground shadow-sm"
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{b.mentorName}</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                    Confirmé
                  </span>
                </div>
                <div className="text-muted-foreground text-[11px]">{b.topic} • {b.timeSlot}</div>
                {b.meetingLink && (
                  <a
                    href={b.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline pt-1"
                  >
                    <Video className="h-3.5 w-3.5" /> Rejoindre la visio Google Meet
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par mentor, bourse, discipline..."
            className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "Tous les pays" },
            { id: "FR", label: "France 🇫🇷" },
            { id: "CA", label: "Canada 🇨🇦" },
            { id: "UK", label: "UK 🇬🇧" },
            { id: "JP", label: "Japon 🇯🇵" },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setCountryFilter(btn.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                countryFilter === btn.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors Directory Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/40 transition-all space-y-4"
          >
            <div>
              {/* Header Profile */}
              <div className="flex items-start gap-4">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-primary/30 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-foreground truncate">
                      {mentor.name}
                    </h3>
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-500 shrink-0">
                      <Star className="h-3 w-3 fill-amber-500" /> {mentor.rating} ({mentor.reviewCount})
                    </span>
                  </div>

                  <p className="text-xs font-medium text-primary mt-0.5">{mentor.role}</p>
                  <p className="text-[11px] text-muted-foreground">{mentor.university}</p>
                </div>
              </div>

              {/* Scholarship Highlight Badge */}
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-2.5 flex items-center gap-2 text-xs text-primary font-semibold">
                <Award className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{mentor.scholarshipObtained}</span>
              </div>

              {/* Bio */}
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {mentor.bio}
              </p>

              {/* Topics */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {mentor.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground"
                  >
                    • {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-emerald-500" /> {mentor.hourlyAvailability}
              </span>

              <button
                type="button"
                onClick={() => setSelectedMentor(mentor)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-glow hover:opacity-90 transition-all"
              >
                <Calendar className="h-3.5 w-3.5" /> Réserver un créneau
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMentor.avatar}
                  alt={selectedMentor.name}
                  className="h-10 w-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    Réserver avec {selectedMentor.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{selectedMentor.scholarshipObtained}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMentor(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Objectif de la session :
                </label>
                <select
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Relecture de dossier & CV">Relecture & Correction de dossier / CV</option>
                  <option value="Simulation d'entretien oral">Simulation d'entretien oral devant jury</option>
                  <option value="Stratégie de bourse & Visa">Stratégie globale de sélection & Visa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Créneau souhaité :
                </label>
                <select
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Samedi 15:00 GMT">Samedi à 15:00 GMT (Visio 45 min)</option>
                  <option value="Dimanche 16:30 GMT">Dimanche à 16:30 GMT (Visio 45 min)</option>
                  <option value="Mercredi 18:00 GMT">Mercredi à 18:00 GMT (Visio 45 min)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Notes ou questions préalables pour le mentor (Optionnel) :
                </label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="ex: Je prépare le Master en Informatique à Sorbonne Université pour la bourse Eiffel..."
                  className="w-full rounded-xl border border-border bg-input p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-muted-foreground"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:opacity-90"
                >
                  Confirmer le Rendez-vous
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
