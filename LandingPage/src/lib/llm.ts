import { StudentProfile } from "./types";

// Keys are loaded only from Vite env variables — never hardcoded here
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY ?? "";

export async function generateAICoachResponse(
  userQuery: string,
  profile: StudentProfile | null
): Promise<string> {
  const profileContext = profile
    ? `Profil Étudiant actuel :
Nom: ${profile.fullName}
Pays d'origine: ${profile.countryOfOrigin} (Résidence: ${profile.countryOfResidence})
Niveau d'étude: ${profile.studyLevel}
Grade recherché: ${profile.targetDegree}
Filière: ${profile.studyField}
Moyenne Générale: ${profile.gpaScore}/20 (Dernier diplôme: ${profile.lastDegreeGpa}/20)
Langues: ${profile.languages?.map((l) => `${l.language} (${l.level})`).join(", ")}`
    : "Profil étudiant par défaut : Candidat africain cherchant des bourses de Master/Doctorat à l'international.";

  const systemPrompt = `Tu es le Coach IA officiel de la plateforme Boursio, un expert senior mondialement reconnu en orientation académique, bourses d'études internationales (Eiffel, Rhodes, Chevening, MEXT, Mastercard Foundation, Fulbright...), rédaction de CV/Lettres de Motivation, procédures de Passeport/Visa et accompagnement des étudiants africains et internationaux.

${profileContext}

Directives de réponse :
1. Sois très chaleureux, encourageant et hautement professionnel.
2. Structure clairement ta réponse avec du Markdown (Gras, Listes à puces, Conseils pratiques).
3. Adapte tes recommandations à la filière (${profile?.studyField || "l'étudiant"}) et au profil de l'utilisateur.
4. Réponds toujours en Français.`;

  // 1. Try Groq API (Ultra-fast llama-3.3-70b-versatile)
  if (GROQ_API_KEY) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        const answer = data.choices?.[0]?.message?.content;
        if (answer) return answer;
      }
    } catch (err) {
      console.warn("Groq API error, trying fallback:", err);
    }
  }

  // 2. Fallback to Mistral API
  if (MISTRAL_API_KEY) {
    try {
      const mistralRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery },
          ],
          temperature: 0.7,
        }),
      });

      if (mistralRes.ok) {
        const data = await mistralRes.json();
        const answer = data.choices?.[0]?.message?.content;
        if (answer) return answer;
      }
    } catch (err) {
      console.warn("Mistral API error, using fallback:", err);
    }
  }

  // 3. Structured offline fallback
  return `🎓 **Conseil Stratégique Boursio**\n\nPour réussir votre projet d'étude en **${
    profile?.targetDegree || "Master"
  }** en **${profile?.studyField || "votre filière"}** :\n\n1. **Dossier Académique** : Mettez en avant votre moyenne (${
    profile?.gpaScore || "15"
  }/20) et vos mentions.\n2. **Lettre de Motivation** : Expliquez clairement l'impact que vous aurez dans votre pays d'origine (${
    profile?.countryOfOrigin || "votre pays"
  }) après l'obtention du diplôme.\n3. **Langues** : Valorisez vos certifications (${
    profile?.languages?.map((l) => l.language).join(", ") || "Français / Anglais"
  }).\n\nDes questions précises sur le visa, le CV ou les entretiens ? Posez-les moi !`;
}
