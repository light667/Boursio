import { StudentProfile } from "./types";

// Keys are loaded only from Vite env variables — never hardcoded here
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY ?? "";

export async function generateAICoachResponse(
  userQuery: string,
  profile: StudentProfile | null,
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

  const ragKnowledgeBase = `
=== BASE DE CONNAISSANCES OFFICIELES (RAG KNOWLEDGE) ===

1. PROCÉDURES OFFICIELLES DU PASSEPORT AU TOGO (DGDN - Direction Générale de la Documentation Nationale) :
Types de passeport couverts : Passeport ordinaire et Passeport de service.

A. Pièces à fournir pour une PREMIÈRE DEMANDE :
- L’original du certificat de nationalité + une photocopie légalisée ou le duplicata ;
- L’original du certificat de naissance + une photocopie légalisée ;
- L’attestation de personne à prévenir pour les adultes ou attestation parentale pour les mineurs, légalisée soit à la mairie soit à la préfecture ;
- Une photocopie simple de la carte nationale d’identité (CNI) ;
- Une photocopie simple de la preuve de profession (attestation de travail ou diplôme) ;
- Un certificat de mariage pour les dames légalement mariées ;
- Deux photos d’identité sur fond blanc ;
- Une quittance de 30.000 F CFA à payer sur la plateforme en ligne.

B. Pièces à fournir pour un RENOUVELLEMENT :
- Les originaux des actes ;
- L’attestation de personne à prévenir pour les adultes ou attestation parentale pour les mineurs, à faire légaliser soit à la mairie soit à la préfecture ;
- Une copie simple de la preuve de profession (attestation de travail ou diplôme) ;
- Une photocopie simple de la carte nationale d’identité (CNI) ;
- Votre ancien passeport ;
- Deux photos d’identité sur fond blanc ;
- Une copie du certificat de mariage pour les femmes légalement mariées ;
- Une quittance de 30.000 F CFA à payer sur la plateforme.

Note pour Passeport de Service : Le fonctionnaire doit fournir en plus une copie de la lettre envoyée par son ministère de tutelle au Ministère de la Sécurité.

C. Étapes de la procédure dématérialisée :
1. Remplir le formulaire en ligne sur la plateforme officielle (bouton « Faire la demande en ligne »).
2. Vérification par la DGDN. En cas d’erreur, notification reçue pour corriger et resoumettre. Si tout est conforme, notification de demande de paiement.
3. Paiement des frais de 30.000 F CFA via Flooz, Tmoney, Visa ou Mastercard.
4. Télécharger et imprimer en 2 exemplaires le formulaire de demande et le reçu de paiement.
5. Se présenter à la DGDN muni des 2 exemplaires imprimés et des pièces physiques requises. Jours de dépôt : Lundi, Mercredi, Vendredi (07h30 à 12h00 et 14h30 à 17h00).
6. Suivi & Retrait : Notifications par SMS/e-mail quand le passeport est prêt. Jours de retrait : Mardi et Jeudi (07h30-12h00 et 14h30-17h00) et Samedi (08h00-12h00).

2. DIRECTIVES ET RÈGLES DE RÉDACTION DE LETTRE DE MOTIVATION POUR BOURSE :
Règles d'or :
- Respecter les conventions de rédaction d’un courrier professionnel (en-tête clair, formules de politesse adaptées, sobriété).
- Présenter son projet professionnel et scolaire de manière mûrement réfléchie.
- Démontrer concrètement en quoi la bourse permettra de concrétiser le projet académique et professionnel.
- Joindre un portfolio détaillé si requis par la discipline.

Modèle de Référence (Exemple Type) :
---
Pauline Bertrand
pauline.bertrand@exemple.fr | 06 12 34 56 78 | 49 Place de la Madeleine, 75012 Paris

M. Pierre Tremblay, Service des admissions
Université de Laval, Québec, Canada

Paris, le 19 mars 2025
Objet : Demande de bourse pour le Baccalauréat en études et pratiques littéraires

Monsieur,
Titulaire d’un baccalauréat français avec la spécialité littérature, je vous adresse cette lettre dans l’espoir d’obtenir une bourse qui me permettrait de poursuivre mon ambition académique : intégrer le Baccalauréat en études et pratiques littéraires à l’Université Laval afin de me spécialiser dans la recherche et la transmission de la littérature québécoise.

Ma motivation est double : approfondir ma connaissance des corpus littéraires d’expression française et développer mes compétences en recherche littéraire. La structure du programme, alliant étude théorique et pratique de l’écriture, me permettra d’enrichir mon analyse critique et de m’ouvrir à de nouvelles perspectives d’interprétation. À terme, je souhaite poursuivre mes études en recherche littéraire et contribuer à la valorisation du patrimoine littéraire québécois.

Bénéficier de cette bourse représenterait une aide précieuse pour mener à bien mon projet académique. Elle me permettrait de me consacrer pleinement à mes études, de participer à des colloques et d’approfondir ma réflexion en littérature québécoise. Convaincue que cette formation constitue un tremplin idéal pour une carrière dans la recherche, je suis déterminée à m’investir pleinement dans ce parcours.

Je vous remercie pour l’attention portée à ma demande et reste à votre disposition pour toute information complémentaire.

Veuillez agréer, Monsieur, l’expression de mes salutations distinguées.
Pauline Bertrand
---
`;

  const systemPrompt = `Tu es le Coach IA officiel de la plateforme Boursio, un expert senior mondialement reconnu en orientation académique, bourses d'études internationales (Eiffel, Rhodes, Chevening, MEXT, Mastercard Foundation, Fulbright...), rédaction de CV/Lettres de Motivation, procédures de Passeport/Visa et accompagnement des étudiants africains et internationaux.

${profileContext}

${ragKnowledgeBase}

Directives de réponse :
1. Sois très chaleureux, encourageant et hautement professionnel.
2. Utilise la base de connaissances ci-dessus pour fournir des réponses précises sur le passeport (au Togo et autres), la constitution du dossier, les quittances de 30.000 FCFA, et les lettres de motivation (structure et exemple).
3. Structure clairement ta réponse avec du Markdown (Gras, Listes à puces, Conseils pratiques).
4. Adapte tes recommandations à la filière (${profile?.studyField || "l'étudiant"}) et au profil de l'utilisateur.
5. Réponds toujours en Français.`;

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

/**
 * Real AI Generator for tailored scholarship motivation letters
 */
export async function generateAILetterOfMotivation(params: {
  scholarshipTitle: string;
  targetUniv: string;
  degreeField: string;
  careerGoals: string;
  profile: StudentProfile | null;
}): Promise<string> {
  const applicantName = params.profile?.fullName || "Candidat Boursio";
  const originCountry = params.profile?.countryOfOrigin || "Togo";
  const gpa = params.profile?.gpaScore || 15;
  const level = params.profile?.studyLevel || "Licence 3";

  const prompt = `Rédige une Lettre de Motivation d'excellence académique complète et professionnelle pour postuler à la bourse suivante :
- Bourse : ${params.scholarshipTitle}
- Université : ${params.targetUniv}
- Filière : ${params.degreeField}
- Niveau actuel : ${level} (Moyenne : ${gpa}/20)
- Nom de l'étudiant : ${applicantName} (Pays d'origine : ${originCountry})
- Objectif de carrière : ${params.careerGoals}

Règles de rédaction strictes :
1. Respecte la structure officielle d'une lettre de motivation pour bourse internationale (En-tête, Objet, Introduction accrocheuse, Parcours académique et distinctions, Adéquation avec l'université d'accueil, Projet d'impact et de retour/contribution dans le pays d'origine, Formule de politesse formelle).
2. Ton très convaincant, soigné et académique.
3. Rédige en Français sans texte explicatif avant ou après la lettre.`;

  if (GROQ_API_KEY) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Tu es un expert mondial en rédaction de lettres de motivation pour bourses d'études prestigieuses (Eiffel, Chevening, Fulbright, Mastercard Foundation).",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    } catch (err) {
      console.warn("Groq API error during letter generation:", err);
    }
  }

  // Fallback template
  return `
${applicantName}
${params.profile?.userId ? "Candidat Boursio Certifié" : "Étudiant International"} | ${originCountry}

À l'attention des Membres du Comité de Sélection
Programme : ${params.scholarshipTitle}
Établissement cible : ${params.targetUniv}

Objet : Candidature à la ${params.scholarshipTitle} pour le cursus en ${params.degreeField}

Madame, Monsieur les Membres du Jury,

C’est avec une détermination profonde et un projet académique mûrement réfléchi que je vous adresse ma candidature pour bénéficier de la prestigieuse ${params.scholarshipTitle} au sein de ${params.targetUniv}.

Titulaire d’un parcours distingué en ${level} avec une moyenne académique de ${gpa}/20, j’ai développé des compétences solides en ${params.degreeField}. Mon ambition est d’approfondir mes connaissances au sein de votre établissement d'excellence afin de concrétiser mon objectif professionnel : ${params.careerGoals}.

Bénéficier de cette opportunité financière me permettra de me consacrer pleinement à l'excellence de mes travaux universitaires, sans contrainte matérielle, et de participer activement aux initiatives de recherche de ${params.targetUniv}. À terme, je souhaite mobiliser cette expertise de haut niveau pour contribuer significativement au développement technologique et économique de mon pays d'origine, le ${originCountry}.

Persuadé(e) que ce programme constitue le tremplin idéal pour réaliser cette ambition, je reste à votre entière disposition pour tout entretien de sélection.

Je vous prie d'agréer, Madame, Monsieur les Membres du Jury, l'expression de ma très haute considération.

${applicantName}
  `.trim();
}
