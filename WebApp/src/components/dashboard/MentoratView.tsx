import React, { useState } from "react";
import { MentorProfile, MentorshipBooking, StudentProfile } from "@/lib/types";
import { toast } from "sonner";
import { useLang } from "@/hooks/use-lang";
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
  BookOpen,
  Check,
  Building,
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
  const { lang, t } = useLang();
  const tm = t.dashboard[lang].mentorat;

  const [mentors] = useState<MentorProfile[]>(VERIFIED_MENTORS);
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [bookingTopic, setBookingTopic] = useState(lang === "fr" ? "Relecture de dossier & CV" : "Application & CV Review");
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
      date: new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US"),
      timeSlot: bookingDate,
      status: "confirmed",
      meetingLink: "https://meet.google.com/bou-rsio-call",
      notes: bookingNotes,
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    try {
      localStorage.setItem(
        `boursio_mentorship_bookings_${userId || "guest"}`,
        JSON.stringify(updated),
      );
    } catch (err) {
      console.error(err);
    }

    toast.success(tm.modal.success);
    setSelectedMentor(null);
    setBookingNotes("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Users className="h-3.5 w-3.5" />
              <span>{tm.verifiedAlumni}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {tm.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {tm.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmed Bookings list if any */}
      {bookings.length > 0 && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {lang === "fr" ? "Vos Sessions de Mentorat Réservées" : "Your Booked Mentoring Sessions"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{b.mentorName}</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                    {lang === "fr" ? "Confirmé" : "Confirmed"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{b.topic}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border text-[10px] text-muted-foreground">
                  <span>{b.timeSlot}</span>
                  {b.meetingLink && (
                    <a
                      href={b.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <Video className="h-3 w-3" /> {lang === "fr" ? "Lien Visio" : "Meeting Link"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "fr" ? "Rechercher un mentor, pays, domaine..." : "Search mentor, country, field..."}
            className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "ALL", label: lang === "fr" ? "Tous les pays" : "All Countries" },
            { id: "FR", label: "France 🇫🇷" },
            { id: "CA", label: "Canada 🇨🇦" },
            { id: "UK", label: "UK 🇬🇧" },
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

      {/* Mentors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/50 hover:shadow-glow transition-all"
          >
            <div className="space-y-4">
              {/* Mentor Header */}
              <div className="flex items-start gap-3.5">
                <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/40 bg-secondary">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="h-full w-full object-cover object-top"
                  />
                  {mentor.verified && (
                    <span className="absolute bottom-0 right-0 bg-primary text-white rounded-tl-lg p-0.5">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-sm font-bold text-foreground truncate">
                      {mentor.name}
                    </h3>
                  </div>
                  <p className="text-[11px] font-semibold text-primary line-clamp-1">{mentor.role}</p>
                  <p className="text-[10px] text-muted-foreground">{mentor.country}</p>
                </div>
              </div>

              {/* Verified Badge and Specialization */}
              <div className="rounded-xl border border-border/80 bg-secondary/40 p-3 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
                  <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{mentor.scholarshipObtained}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Building className="h-3 w-3 shrink-0" />
                  <span className="truncate">{mentor.university}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {mentor.bio}
              </p>

              {/* Topics Covered */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {tm.topicsCovered}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-foreground border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Card Bottom */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[11px]">{tm.availableThisWeek}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMentor(mentor)}
                className="rounded-xl bg-gradient-to-r from-primary to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-glow hover:opacity-90 transition-all inline-flex items-center gap-1.5"
              >
                <Video className="h-3.5 w-3.5" />
                <span>{tm.bookSession}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" />
                {tm.modal.title} {selectedMentor.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedMentor(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {tm.modal.selectTopic}
                </label>
                <select
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value={lang === "fr" ? "Relecture & Structuration de CV d'Ingénieur" : "Engineering CV Review & Structuring"}>
                    {lang === "fr" ? "Relecture & Structuration de CV d'Ingénieur" : "Engineering CV Review & Structuring"}
                  </option>
                  <option value={lang === "fr" ? "Accompagnement complet Campus France" : "Full Campus France Guidance"}>
                    {lang === "fr" ? "Accompagnement complet Campus France" : "Full Campus France Guidance"}
                  </option>
                  <option value={lang === "fr" ? "Préparation aux entretiens consulaires & Visa étudiant" : "Consular & Student Visa Interview Prep"}>
                    {lang === "fr" ? "Préparation aux entretiens consulaires & Visa étudiant" : "Consular & Student Visa Interview Prep"}
                  </option>
                  <option value={lang === "fr" ? "Stratégie de choix des universités et écoles en France" : "French University & Engineering School Strategy"}>
                    {lang === "fr" ? "Stratégie de choix des universités et écoles en France" : "French University & Engineering School Strategy"}
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    {tm.modal.selectDate}
                  </label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Samedi 10:00 GMT">Samedi 10:00 GMT</option>
                    <option value="Samedi 15:00 GMT">Samedi 15:00 GMT</option>
                    <option value="Dimanche 14:00 GMT">Dimanche 14:00 GMT</option>
                    <option value="Dimanche 18:00 GMT">Dimanche 18:00 GMT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    {lang === "fr" ? "Format :" : "Format:"}
                  </label>
                  <div className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-xs text-foreground font-semibold flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5 text-primary" /> Google Meet (45 min)
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {tm.modal.notes}
                </label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder={tm.modal.notesPlaceholder}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {tm.modal.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:opacity-90"
                >
                  {tm.modal.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
