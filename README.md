# 🚀 Gemini Medical Record Organizer (Next.js App Router — No Auth Version)

A lightweight AI-powered medical record organizer built using **Next.js 14 (App Router)**, **Google Gemini**, and **Firebase Firestore**.

Users can paste unformatted medical text — or now **generate messy sample data automatically** — and the system will:

- Extract structured fields (patient name, diagnosis, medications, etc.)
- Generate a clean Markdown medical report
- Save structured results to Firestore
- Display all processed records in real time
- Download reports as `.md` files for reuse

This version includes **no authentication**, making it ideal for demos, prototypes, hackathons, and internal tooling.

---

# ✨ New Feature: “Load Sample Demo Data”

A brand-new button, **Load Sample Demo Data**, lets users:

- Generate **extremely messy, chaotic, unformatted synthetic medical notes**
- Auto-fill the input box instantly
- Demo the app with zero setup or real patient data
- Stress-test the AI parser with realistic clinician shorthand

This uses a dedicated Gemini prompt designed to mimic real, unstructured clinical notes.

---

# 📦 Features

- 🧠 AI medical text parsing using Gemini 2.5 Flash  
- 🧪 Random messy sample note generator  
- ⚡ Next.js App Router (modern, file-based structure)  
- 🔄 Real-time Firestore syncing (`onSnapshot`)  
- 📄 Automatic Markdown report generation  
- 📥 Download structured reports  
- 🎨 TailwindCSS styling  
- 🛠️ Anonymous auth optional (disabled by default)  

---

# 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| UI | React, TailwindCSS |
| Database | Firebase Firestore |
| AI Engine | Google Gemini |
| State | React Hooks |
| Deployment | Vercel |

---

# 📁 Project Structure

/app
/components
/MedicalRecordOrganizer
index.js
InputPanel.js
RecordsDisplay.js
RecordCard.js
DetailModal.js
utils.js
config.js
page.js

yaml
Copy code

---

# ⚙️ Installation

## 1️⃣ Install dependencies

```sh
npm install
2️⃣ Create .env.local
env
Copy code
NEXT_PUBLIC_GEMINI_API_KEY="YOUR_GEMINI_KEY"

NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

NEXT_PUBLIC_APP_INSTANCE_ID="medical-org"
Firebase config is located under:
Firebase Console → Project Settings → General → Your Web App

🔥 Firebase Setup
Enable Firestore
pgsql
Copy code
Build → Firestore Database → Create Database → Start in Test Mode
Optional: Enable Anonymous Auth
(Helps Firestore initialize; still considered no-auth mode since it doesn’t require login.)

mathematica
Copy code
Build → Authentication → Sign-in Method → Anonymous → Enable
Firestore Rules (Development Only)
txt
Copy code
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DEVELOPMENT ONLY (open read/write)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
⚠️ Do NOT use these rules for production.

▶️ Run the App
sh
Copy code
npm run dev
Visit:

arduino
Copy code
http://localhost:3000
🧠 AI Processing Pipeline (How the App Works)
User pastes raw medical text
OR clicks “Load Sample Demo Data”, which auto-generates realistic messy notes

The app sends the text → Gemini

Gemini returns structured JSON:

json
Copy code
{
  "patientName": "Jane Doe",
  "dob": "1985-01-28",
  "diagnosis": ["Iron Deficiency"],
  "provider": "Dr. Smith",
  "visitDate": "2025-01-12",
  "summary": "Patient evaluated for fatigue...",
  "medications": ["Ferrous sulfate"]
}
Next.js converts the JSON → Markdown

Firestore stores the data under:

swift
Copy code
artifacts/{APP_ID}/public/data/medicalRecords
onSnapshot listener updates the UI in real time

Users can view details → download the Markdown report

📄 Example Firestore Document
json
Copy code
{
  "patientName": "Jane Doe",
  "dob": "1985-01-28",
  "diagnosis": ["Iron deficiency anemia"],
  "provider": "Dr. Smith",
  "visitDate": "2025-01-12",
  "summary": "Patient reports fatigue...",
  "medications": ["Ferrous sulfate"],
  "markdownReport": "# Patient Medical Record Summary ...",
  "rawText": "pt c/o tiredness.. irregular diet ....",
  "createdAt": "timestamp",
  "processedBy": "user-uuid"
}
✨ UI Enhancement — Sample Data Button
The input panel now includes:

mathematica
Copy code
[ Process, Format & Save Record ]
[ Load Sample Demo Data ]
Benefits:
No need for real clinical text

Excellent for demos

Great for automated testing

Produces chaotic, realistic clinical text for AI pipelines

📦 Deployment (Recommended: Vercel)
Push project → GitHub

Import into Vercel

Add all environment variables

Deploy

Fully compatible with Next.js App Router.

💡 Future Enhancements
Full authentication system

Per-user Firestore isolation

Export to PDF

OCR support (image → text)

Admin dashboard

HIPAA-ready rule presets

📝 License
Recommended: MIT License

txt
Copy code
MIT License

Copyright (c) 2025 YOUR NAME

Permission is hereby granted, free of charge, to any person obtaining a copy...
🎉 Final Notes
This project demonstrates:

AI → JSON transformation

Real-time Firestore syncing

Clean modular architecture

Automatic sample data generation

Downloadable medical summaries

Perfect for:

Hackathons

Medical AI demos

Startup prototypes

Research tooling

yaml
Copy code

---

If you'd like, I can also generate:

✅ Automatic Table of Contents  
✅ Screenshot placeholders  
✅ Badges (Vercel, Firebase, Next.js)  
✅ A shorter “npm-style” README  

Just say the word!
