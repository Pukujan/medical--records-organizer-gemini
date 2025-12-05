// app/components/MedicalRecordOrganizer/config.js

// --- CONFIGURATION ---
// Next.js requires environment variables accessible in the browser to be prefixed with NEXT_PUBLIC_
export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';

// Use a user-defined unique instance ID for data separation, otherwise fall back to the Firebase ID.
export const APP_ID =
  process.env.NEXT_PUBLIC_APP_INSTANCE_ID ||
  FIREBASE_CONFIG.appId?.split(':')[2] ||
  'default-app-id';
