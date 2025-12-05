# 🚀 Gemini Medical Record Organizer (Next.js App Router — No Auth Version)

A lightweight AI-powered medical record organizer built using **Next.js 14 (App Router)**, **Google Gemini**, and **Firebase Firestore**.

Users paste unformatted medical text, and the system automatically:
- Extracts structured fields (patient name, diagnosis, medications, etc.)
- Generates a clean Markdown report
- Saves the output to Firestore
- Displays all processed records in real time

This version uses **no traditional password login**. It is ideal for demos, prototypes, hackathons, and internal tools.

---

## 📦 Features

- 🧠 **AI medical record parsing** using Gemini 2.5 Flash  
- ⚡ **Next.js App Router architecture**  
- 🔄 **Realtime Firestore updates (onSnapshot)**  
- 📄 **Downloadable Markdown reports**  
- 🎨 **TailwindCSS UI**  
- 💾 **Firestore persistence under a shared namespace**  

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Frontend | React |
| Styling | TailwindCSS |
| Database | Firebase Firestore |
| AI Engine | Google Gemini |
| Auth | Optional anonymous auth |
| State | React Hooks |

---

## 📁 Project Structure

```
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
  /page.js
```

---

## ⚙️ Installation

### 1️⃣ Install dependencies
```sh
npm install
```

---

## 2️⃣ Create `.env.local`

```
NEXT_PUBLIC_GEMINI_API_KEY="YOUR_GEMINI_KEY"

NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

NEXT_PUBLIC_APP_INSTANCE_ID="medical-org"
```

> You can find Firebase config under  
> **Firebase Console → Project Settings → General → Your Web App**

---

## 🔥 Firebase Setup

### Enable Firestore
```
Build → Firestore Database → Create Database
```
Use **Start in Test Mode** for development.

---

### Optional: Enable Anonymous Auth  
(Recommended so the Firebase client SDK can make requests.)

```
Build → Authentication → Sign-in Method → Anonymous → Enable
```

---

### Firestore Rules (safe for development)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Open access for local development only
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ Do **not** use these rules in production.

---

## ▶️ Run the App

```sh
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 🧠 How It Works (AI Pipeline)

1. User pastes raw medical text  
2. App sends text → Gemini  
3. Gemini returns structured JSON:  
```json
{
  "patientName": "...",
  "dob": "...",
  "diagnosis": ["..."],
  "provider": "...",
  "visitDate": "...",
  "summary": "...",
  "medications": ["..."]
}
```
4. App formats a Markdown report  
5. App saves everything to Firestore under:

```
artifacts/{APP_ID}/public/data/medicalRecords
```

6. Firestore listener (`onSnapshot`) updates UI instantly  
7. User can view & download reports  

---

## 📄 Example Firestore Document

```json
{
  "patientName": "Jane Doe",
  "dob": "1985-01-28",
  "diagnosis": ["Iron deficiency"],
  "provider": "Dr. Smith",
  "visitDate": "2025-01-12",
  "summary": "Patient evaluated for fatigue...",
  "medications": ["Ferrous sulfate"],
  "markdownReport": "# Patient Medical Record Summary ...",
  "rawText": "Patient presents with...",
  "createdAt": "...timestamp..."
}
```

---

## 📦 Deployment (Next.js)

Recommended deployment: **Vercel**

1. Push your repo to GitHub  
2. Import into Vercel  
3. Add all environment variables  
4. Build & deploy  

Works flawlessly with Next.js App Router.

---

## 💡 Future Enhancements

- Add full authentication  
- Per-user isolated Firestore datastores  
- PDF export  
- OCR image → text extraction  
- Admin dashboard  
- HIPAA-friendly rule system  

---

## 📝 License

You may choose MIT, Apache 2.0, GPL, or no license.

For MIT (most common):

```
MIT License

Copyright (c) 2025 YOUR NAME

Permission is hereby granted, free of charge, to any person obtaining a copy
...
```

---

## 🎉 Final Notes

This project demonstrates:

- Fast AI → JSON processing using Gemini  
- Real-time Firestore syncing  
- Clean Next.js App Router architecture  
- Modular component design  
- Downloadable medical summaries  

Perfect for medical tooling prototypes, demos, or internal workflows.

