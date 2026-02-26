
import { GoogleGenAI } from "@google/genai";
import * as Data from '../data';
import { planHospitalierData } from "../data_plan";

// Clés API (Supporte VITE_ pour Netlify et process.env pour le dev local)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";

// Liste de modèles OpenRouter (fallback)
const OPENROUTER_MODELS = [
  "google/gemini-2.0-flash-001",
  "google/gemini-flash-1.5",
  "meta-llama/llama-3.1-70b-instruct"
];

const systemInstruction = `
Tu es Vincent, l'assistant expert du Portail HPSJ. Tu dois être d'une précision chirurgicale.

### ⚠️ DISTINCTION CRUCIALE :
- **CONSULTATION** : Se déroule aux **PORTES** (RDC ou niveaux bas). C'est là où les patients viennent pour un RDV.
- **HOSPITALISATION / SERVICE** : Se déroule dans les **UNITÉS** (Niveaux 1, 2, 3, etc.). C'est là où les patients dorment.

### 📞 ANNUAIRE DES CONSULTATIONS (PAR PORTE) :
- **Porte 1** : Anesthésie (**7580**), Chir Plastie (**3771**)
- **Porte 2** : Chir Digestive (**3556**), Chir Urologie (**3821**), Chir Vasculaire (**3060**), Méd Vasculaire (**3184**), Orthopédie (**3430** / **7729** / **3580** / **3433** / **7845**)
- **Porte 3** : Proctologie (**3039**), Gastro (**3039**)
- **Porte 4** : Urgences Gynéco (**8170**), Maternité (**8282**)
- **Porte 5** : Gastro (Examens/Endoscopie)
- **Porte 8** : Cardio (**3746**), Diabéto (**6145**), Neuro (**3769**), Rythmo (**3725**)
- **Porte 10** : Maternité (**8282**), Endométriose (**7740**)
- **Porte 12** : HDJ Médecine (**3407**), HDJ Allergo (**7599**)
- **Porte 14** : Pneumo (**6747** / **3153**), Dermato (**3558** / **3559**), Rhumato/Méd Int (**7317**), Douleur (**6180**)
- **Porte 16** : Oncologie (**3189** / **3078**)
- **Porte K** : ORL / CMF (**3378**)
- **Centre Losserand (ENTRÉE 5)** : Mammographie, Gynéco, Centre du Sein, Endométriose.

### 🎀 CAS SPÉCIFIQUE : MAMMOGRAPHIE / CENTRE DU SEIN / ENDOMÉTRIOSE
Si on te demande pour la **Mammographie**, le **Centre du Sein**, la **Gynécologie** ou l'**Endométriose**, tu DOIS répondre EXACTEMENT avec ce format :

**Mammographie**
8h - 18h
Accès : **ENTRÉE 5**
✅ Ouvert

**Gynéco & Centre Sein**
8h - 18h
Accès : **ENTRÉE 5**
✅ Opérationnel

**Centre Endométriose**
8h - 18h
Accès : **ENTRÉE 5**
✅ Opérationnel

### 🏥 PLAN DES HOSPITALISATIONS (UNITÉS) :
${JSON.stringify(planHospitalierData.map(p => ({ pole: p.pole, service: p.libelleUg, etage: p.ul, tel: p.posteDeSoins })))}

### 📚 AUTRES DONNÉES (SECRETARIATS & LOSSERAND) :
- SECRETARIATS : ${JSON.stringify(Data.secretariatsData)}
- GARDES : ${JSON.stringify(Data.guardsData)}
- DRH : ${JSON.stringify(Data.drhData)}
- N° UTILES : ${JSON.stringify(Data.usefulNumbers)}

### RÈGLES DE RÉPONSE :
1. Si on demande une **CONSULTATION**, cherche d'abord dans l'ANNUAIRE DES CONSULTATIONS.
2. Pour la Mammographie/Sein/Endo, utilise TOUJOURS le format triple bloc ci-dessus (ENTRÉE 5).
3. Ne mentionne PLUS la Porte H pour le Centre du Sein, c'est désormais l'**ENTRÉE 5**.
4. Réponds toujours en français, de manière pro, courte et précise.
5. Numéros toujours en **gras**.
`;

export async function chatWithGemini(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  // 1. Tentative avec l'API Gemini Native (Primary)
  if (GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: [
          { role: "user", parts: [{ text: `INSTRUCTIONS : ${systemInstruction}` }] },
          { role: "model", parts: [{ text: "Compris. Je suis Vincent, l'assistant du Portail HPSJ." }] },
          ...history,
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          temperature: 0.1,
        }
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.error("Erreur Gemini Native:", err);
      // On continue vers le fallback OpenRouter
    }
  }

  // 2. Fallback vers OpenRouter (via Netlify Function pour cacher la clé)
  // Si on est sur Netlify, on utilise la fonction serverless pour ne pas exposer la clé.
  try {
    const messages = [
      { role: "user", content: `INSTRUCTIONS : ${systemInstruction}\n\nQUESTION : ${message}` }
    ];

    if (history.length > 0) {
      const formattedHistory = history.map(h => ({
        role: h.role === 'model' ? 'assistant' : 'user',
        content: h.parts[0].text
      }));
      messages.splice(0, 1, 
        { role: "user", content: `INSTRUCTIONS : ${systemInstruction}` },
        { role: "assistant", content: "Compris. Je suis Vincent." },
        ...formattedHistory,
        { role: "user", content: message }
      );
    }

    // On tente d'abord la fonction Netlify (Secure)
    const netlifyResponse = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001", // Modèle par défaut pour le proxy
        messages: messages,
        temperature: 0.1
      })
    });

    if (netlifyResponse.ok) {
      const data = await netlifyResponse.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
    }
  } catch (e) {
    // Si la fonction Netlify échoue (ex: en local), on continue vers le fallback client-side
    console.warn("Fonction Netlify indisponible, passage en mode client-side...");
  }

  // 3. Fallback Ultime : Client-side OpenRouter (Dev Only)
  if (OPENROUTER_API_KEY) {
    // ... (code existant pour l'appel direct)

    for (const model of OPENROUTER_MODELS) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.1,
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
          }
        }
      } catch (err) {
        console.error(`Erreur OpenRouter ${model}:`, err);
      }
    }
  }

  return `⚠️ ERREUR DE CONFIGURATION SUR NETLIFY ⚠️

  L'assistant a besoin d'une clé API pour fonctionner.
  
  POUR CORRIGER SUR NETLIFY (SÉCURISÉ) :
  1. Allez dans "Site configuration" > "Environment variables"
  2. Ajoutez la clé suivante (SANS "VITE_") :
     - Clé : OPENROUTER_API_KEY
     - Valeur : Votre clé OpenRouter (sk-or-...)
  
  3. Redéployez le site.
  
  Cela permettra à la fonction serveur de cacher votre clé.`;
}
