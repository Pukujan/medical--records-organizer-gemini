##📄 README.md — Gemini Medical Record Organizer (Next.js App Router, No Auth Version)

An AI-powered medical record organizer built using Next.js 14 (App Router), Google Gemini, and Firebase Firestore.

Users paste unformatted medical text, and the system automatically:

Extracts structured medical fields

Generates a clean Markdown report

Saves the output to Firestore

Displays all processed records in real time

This version uses no traditional login — it relies on either no auth or anonymous Firebase authentication, making it ideal for demos, prototypes, internal tooling, and pre-production environments.

🚀 Features
🧠 AI Medical Parsing

Uses Google Gemini 2.5 Flash with structured JSON output via responseSchema.

⚡ Built with Next.js App Router

/app directory

Server & Client Components

Fast refresh & edge-friendly architecture

🔄 Real-Time Database Updates

Records stored under:

artifacts/{APP_ID}/public/data/medicalRecords


Firestore listeners update UI automatically.

📄 Downloadable Markdown Reports

After processing, users can view or download a .md file summarizing the entire record.

🎨 TailwindCSS UI

Clean, minimal design with:

Input panel

Real-time records list

Detail modal with markdown preview

🧱 Tech Stack
Layer	Technology
Framework	Next.js 14+ (App Router)
Frontend	React, Client Components
Styling	TailwindCSS
AI Engine	Google Gemini 2.5 Flash
Database	Firebase Firestore
Authentication	Optional anonymous auth
State	React Hooks
📁 Project Structure (Next.js App Router)
/app
  /components
    /MedicalRecordOrganizer
      index.js               # Main container (Firestore connection + AI logic)
      InputPanel.js          # User input + processing button
      RecordsDisplay.js      # Searchable real-time list of results
      RecordCard.js          # UI card for each record
      DetailModal.js         # Full markdown + download
      utils.js               # Gemini + helper utilities
      config.js              # Firebase + Gemini configuration
  /page.js                   # Entry point for Next.js App Router


➡ This is the standard Next.js App Router architecture (not /pages).

⚙️ Setup Instructions
1️⃣ Install dependencies
npm install

2️⃣ Create .env.local
NEXT_PUBLIC_GEMINI_API_KEY="YOUR_GEMINI_KEY"

NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

NEXT_PUBLIC_APP_INSTANCE_ID="medical-org"


You can find Firebase config in:

Firebase Console → Project Settings → General → Your Web App

🔥 Firebase Setup
➤ Enable Firestore
Build → Firestore Database → Create Database


Choose Start in Test Mode.

➤ (Optional) Enable Anonymous Auth

Since Next.js interacts with Firestore via the client SDK, Firebase requires some form of auth.

Enable this:

Build → Authentication → Sign-in Method → Anonymous → Enable


No user interaction required.

➤ Firestore Rules (open for development)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Allows full read/write for development.
    match /{document=**} {
      allow read, write: if true;
    }
  }
}


Click Publish.

⚠️ Do NOT use these in production — they allow public access.

▶️ Run the Next.js App
npm run dev


Visit:

http://localhost:3000

🧠 AI Processing Workflow
1. User pastes raw text

In the InputPanel.

2. Gemini transforms it → structured JSON

Using responseSchema:

{
  "patientName": "...",
  "dob": "...",
  "diagnosis": ["..."],
  "provider": "...",
  "visitDate": "...",
  "summary": "...",
  "medications": ["..."]
}

3. Markdown report is auto-generated

Stored as markdownReport.

4. Data is saved to Firestore

Path:

artifacts/{APP_ID}/public/data/medicalRecords

5. Firestore onSnapshot updates UI

Records appear instantly in the list.

6. Users download or view the report

Modal includes a Markdown preview + download button.

📄 Example Firestore Document
{
  "patientName": "John Doe",
  "dob": "1983-02-05",
  "diagnosis": ["Hypertension"],
  "provider": "Dr. Smith",
  "visitDate": "2025-01-12",
  "summary": "...",
  "medications": ["Lisinopril"],
  "markdownReport": "# Patient Medical Record Summary ...",
  "rawText": "Patient presents with...",
  "createdAt": "...timestamp...",
  "processedBy": "anonymous-uid",
}

💡 Future Enhancements

Add full auth (email/password, Google OAuth, etc.)

Export PDF instead of Markdown

OCR image upload → AI extraction

Improve record validation

Per-user Firestore isolation (if authentication added)

HIPAA-ready rule configuration

📦 Deployment (Next.js)
Recommended: Vercel

Push project to GitHub

Import repo into Vercel

Add all .env.local values to Vercel environment variables

Deploy → Works instantly with App Router

📝 License

MIT License — free to use, modify, and distribute.
