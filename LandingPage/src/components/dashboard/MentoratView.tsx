import React, { useState } from "react";
import { Mentor } from "@/lib/types";
import {
  Users,
  Star,
  Award,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Globe,
  Search,
  Sparkles,
  X,
  Send,
} from "lucide-react";

export const MentoratView: React.FC = () => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [messageTopic, setMessageTopic] = useState("Revue de dossier & Lettre de motivation");
  const [searchQuery, setSearchQuery] = useState("");

  const mockMentors: Mentor[] = [
    {
      id: "mentor-1",
      name: "Dr. Amadou Diallo",
      title: "Boursier Rhodes & Chercheur IA",
      universityOrCompany: "University of Oxford",
      country: "Royaume-Uni / Sénégal",
      scholarshipsWon: ["Bourse Rhodes Oxford", "Bourse Eiffel Excellence"],
      specialties: ["Rédaction de dossier Master/PhD", "Entretiens de bourse", "Sciences & IA"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      rating: 4.9,
      reviewsCount: 38,
      available: true,
      bio: "Ancien boursier à Oxford et Paris-Saclay, j'ai accompagné plus de 50 étudiants africains à décrocher des financements complets pour leurs études supérieures.",
    },
    {
      id: "mentor-2",
      name: "Fatou Kéré",
      title: "Alumni MEXT & Ingénieure Data",
      universityOrCompany: "Tokyo Institute of Technology",
      country: "Japon / Burkina Faso",
      scholarshipsWon: ["Bourse MEXT Gouvernement Japonais"],
      specialties: ["Candidatures Asie & Japon", "Procédures Visa", "Lettres de recommandation"],
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      rating: 5.0,
      reviewsCount: 24,
      available: true,
      bio: "Spécialiste des bourses gouvernementales asiatiques MEXT et CSC China. Je vous aide à préparer un projet de recherche irréprochable.",
    },
    {
      id: "mentor-3",
      name: "Emmanuel Koffi",
      title: "Boursier Mastercard Foundation",
      universityOrCompany: "University of Toronto",
      country: "Canada / Côte d'Ivoire",
      scholarshipsWon: ["Mastercard Foundation Scholars", "Bourse d'Excellence"],
      specialties: ["Bourses Canada & USA", "Essay & Lettre de Motivation", "Vie étudiante nord-américaine"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      rating: 4.8,
      reviewsCount: 42,
      available: true,
      bio: "Diplômé de Toronto, j'aide les jeunes leaders francophones à structurer leurs récits personnels (essais) pour séduire les universités canadiennes et américaines.",
    },
    {
      id: "mentor-4",
      name: "Dr. Sarah Benali",
      title: "Médecin & Boursière Fulbright",
      universityOrCompany: "Harvard Medical School",
      country: "USA / Maroc",
      scholarshipsWon: ["Fulbright Program USA", "Bourse Chevening"],
      specialties: ["Santé Publique & Médecine", "Anglais Académique", "Preuve d'impact social"],
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
      rating: 4.9,
      reviewsCount: 19,
      available: true,
      bio: "Experte des programmes Fulbright et Chevening. Je revois vos projets d'étude pour aligner vos ambitions médicales ou scientifiques avec les attentes des jurys.",
    },
  ];

  const filteredMentors = mockMentors.filter(
    (m) =>
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.scholarshipsWon.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.specialties.some((sp) => sp.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendBookingRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-secondary/40 to-primary/10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-accent shadow-glow">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Mentorat & Coaching Humain
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Échangez directement avec des étudiants et diplômés expérimentés ayant décroché les bourses les plus prestigieuses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un mentor, une bourse (Rhodes, MEXT, Eiffel...)..."
          className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>

      {/* Mentors Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-card hover:border-primary/40 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="h-16 w-16 rounded-2xl object-cover border border-primary/20 shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-foreground">{mentor.name}</h3>
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400" /> {mentor.rating} ({mentor.reviewsCount})
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-accent">{mentor.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Globe className="h-3 w-3 text-primary" /> {mentor.universityOrCompany} ({mentor.country})
                  </p>
                </div>
              </div>

              {/* Scholarships Won Badges */}
              <div className="flex flex-wrap gap-1.5">
                {mentor.scholarshipsWon.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-lg bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent border border-accent/30"
                  >
                    <Award className="h-3 w-3" /> {s}
                  </span>
                ))}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {mentor.bio}
              </p>

              {/* Specialties */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Domaines d'accompagnement :
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.specialties.map((spec, i) => (
                    <span key={i} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-foreground">
                      • {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => {
                  setSelectedMentor(mentor);
                  setShowBookingModal(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-90 transition-all"
              >
                <MessageSquare className="h-4 w-4" /> Réserver un accompagnement avec {mentor.name.split(" ")[0]}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 shadow-2xl sm:p-8 space-y-5">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedMentor.avatar}
                alt={selectedMentor.name}
                className="h-12 w-12 rounded-xl object-cover border border-accent/40"
              />
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Demande de Mentorat avec {selectedMentor.name}
                </h3>
                <p className="text-xs text-accent">{selectedMentor.title}</p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
                <h4 className="font-bold text-foreground">Demande envoyée avec succès !</h4>
                <p className="text-xs text-muted-foreground">
                  {selectedMentor.name} prendra contact avec vous dans les 24h par e-mail ou messagerie Boursio.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendBookingRequest} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Sujet principal du coaching *
                  </label>
                  <select
                    value={messageTopic}
                    onChange={(e) => setMessageTopic(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Revue de dossier & Lettre de motivation">Revue de dossier & Lettre de motivation</option>
                    <option value="Préparation à l'entretien de sélection">Préparation à l'entretien de sélection</option>
                    <option value="Stratégie de candidature Bourse MEXT/Rhodes/Chevening">Stratégie de candidature Bourse MEXT/Rhodes/Chevening</option>
                    <option value="Conseils sur le logement et le Visa">Conseils sur le logement et le Visa</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Votre message / Vos questions spécifiques *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Présentez votre projet d'étude et ce que vous souhaitez travailler durant la session..."
                    className="w-full rounded-xl border border-border bg-input p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-border bg-secondary/50 p-3 text-xs text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent shrink-0" />
                  <span>Session individuelle de 30-45 minutes réservée aux membres Boursio.</span>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 py-3 text-xs font-semibold text-white shadow-glow hover:opacity-90"
                >
                  <Send className="h-4 w-4" /> Envoyer ma demande au Mentor
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
