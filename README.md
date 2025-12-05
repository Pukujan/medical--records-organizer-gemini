# 🚀 Gemini Medical Record Organizer (Next.js App Router — No Auth Version)

A lightweight AI-powered medical record organizer built using **Next.js 14 (App Router)**, **Google Gemini**, and **Firebase Firestore**.

Users can paste unformatted medical text — or now **generate messy sample data automatically** — and the system will:

- Extract structured fields (patient name, diagnosis, medications, etc.)
- Generate a clean Markdown medical report
- Save structured results to Firestore
- Display all processed records in real time
- Download reports as `.md` files for reuse

This version includes **no authentication**, making it ideal for demos, prototypes, hackathons, and internal tooling.

Vercel Demo: https://medical-records-organizer-gemini.vercel.app/
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
| Deployment | Vercel |  

---

# 📁 Project Structure

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
  page.js
```

---

# ⚙️ Installation

## 1️⃣ Install dependencies

```
npm install
```

---

## 2️⃣ Create `.env.local`

```env
NEXT_PUBLIC_GEMINI_API_KEY="YOUR_GEMINI_KEY"

NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

NEXT_PUBLIC_APP_INSTANCE_ID="medical-org"
```

---

# 🔥 Firebase Setup

## Enable Firestore

Build → Firestore Database → Create Database → Start in Test Mode

---

## Optional: Enable Anonymous Auth

Helps Firestore initialize more smoothly.

Build → Authentication → Sign-in Method → Anonymous → Enable

---

## Firestore Rules (Development Only)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ Not for production use.

---

# ▶️ Run the App

```
npm run dev
```

Visit:

http://localhost:3000

---

# 🧠 AI Processing Pipeline

1. User pastes medical text  
   OR clicks **Load Sample Demo Data**  
2. Text is sent to Gemini  
3. Gemini returns structured JSON  
4. The app converts it to Markdown  
5. Firestore stores the data under:  

```
artifacts/{APP_ID}/public/data/medicalRecords
```

6. UI updates in real-time  
7. User can open and download the report  

---

# 📄 Example Firestore Document

```json
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
```

---

# ✨ UI Enhancement — Sample Data Button

Displayed as:

```
[ Process, Format & Save Record ]
[ Load Sample Demo Data ]
```

---

# 📦 Deployment (Vercel Recommended)

1. Push to GitHub  
2. Import into Vercel  
3. Add environment variables  
4. Deploy  

---

# 💡 Future Enhancements

- Full authentication  
- Per-user Firestore isolation  
- Export to PDF  
- OCR support  
- Admin interface  
- HIPAA-ready mode  

---

# 📝 License

MIT License recommended:

```txt
MIT License
Copyright ...
```
