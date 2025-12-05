// app/components/MedicalRecordOrganizer/utils.js
import { API_URL, GEMINI_API_KEY } from './config';
/**
 * Handles fetch requests with exponential backoff for resilience.
 * @param {string} url The API endpoint URL.
 * @param {object} options Fetch options (method, headers, body).
 * @param {number} retries Max number of retries.
 * @returns {Promise<Response>} The fetch response.
 */
export const fetchWithBackoff = async (url, options, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status !== 429) return response;

      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
      console.warn(`Rate limit encountered. Retrying in ${Math.round(delay / 1000)}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (e) {
      console.error('Fetch error:', e);
      if (i === retries - 1) throw e;
    }
  }
  throw new Error('API request failed after multiple retries.');
};

/**
 * Converts structured medical data into a formatted Markdown report (spreadsheet simulation).
 */
export const createMarkdownReport = (data) => {
  const safeJoin = (arr) =>
    Array.isArray(arr) && arr.length > 0 ? arr.join('; ') : 'None listed.';

  return `
# Patient Medical Record Summary
***
## Patient Information
| Field | Value |
| :--- | :--- |
| **Patient Name** | ${data.patientName || 'N/A'} |
| **Date of Birth** | ${data.dob || 'N/A'} |
| **Visit Date** | ${data.visitDate || 'N/A'} |
| **Primary Provider** | ${data.provider || 'N/A'} |

## Clinical Details
| Field | Details |
| :--- | :--- |
| **Primary Diagnosis** | ${safeJoin(data.diagnosis)} |
| **Medications** | ${safeJoin(data.medications)} |

## Summary of Visit Notes
> ${data.summary || 'No detailed summary provided by AI analysis.'}
`;
};

export async function generateSampleRawMedicalText() {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing. Check your .env.local file.');
  }

  const systemPrompt =
    "You generate realistic, messy, unstructured patient medical notes for testing. " +
    "Do NOT format anything as JSON or Markdown. Do NOT add explanations. " +
    "Output only the raw note text, as a single block of text, with line breaks, " +
    "shorthand, abbreviations, and inconsistent formatting like rushed clinician notes.";

  const userPrompt = `
Make up a new patient encounter note with details like:

- chief complaint
- brief history
- meds
- allergies
- physical exam
- assessment / plan

But keep it VERY UNFORMATTED:
- inconsistent spacing
- weird punctuation
- shorthand
- partial sentences
- messy line breaks

Again: DO NOT wrap in code fences. DO NOT use Markdown headings. Just raw text.
`;

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: 'text/plain',
    },
  };

  const res = await fetchWithBackoff(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini sample generator error ${res.status}: ${text}`);
  }

  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts?.[0]?.text ||
    json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!text) {
    throw new Error('Gemini returned an empty sample note.');
  }

  // Just in case Gemini still tries to be "clever"
  const clean = text.replace(/```[\s\S]*?```/g, '').trim();
  return clean;
}
