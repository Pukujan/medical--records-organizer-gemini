// app/components/MedicalRecordOrganizer/utils.js

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
