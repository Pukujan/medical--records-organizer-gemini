// app/components/MedicalRecordOrganizer/index.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  onSnapshot,
  collection,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { ScanText } from 'lucide-react';

import InputPanel from './InputPanel';
import RecordsDisplay from './RecordsDisplay';
import DetailModal from './DetailModal';
import { FIREBASE_CONFIG, GEMINI_API_KEY, API_URL, APP_ID } from './config';
import { fetchWithBackoff, createMarkdownReport } from './utils';

export default function MedicalRecordOrganizer() {
  // Firebase State
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Application State
  const [rawInput, setRawInput] = useState('');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // 1. Firebase Initialization and Anonymous Authentication
  useEffect(() => {
    if (!FIREBASE_CONFIG.apiKey) {
      setError('Firebase API Key is missing. Check your .env.local file.');
      return;
    }

    try {
      const app = initializeApp(FIREBASE_CONFIG);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);

      setDb(firestore);

      signInAnonymously(authInstance)
        .then((userCredential) => {
          setUserId(userCredential.user.uid);
          setIsAuthReady(true);
        })
        .catch((e) => {
          console.error('Anonymous Sign-in failed:', e);
          setError(
            'Failed to authenticate with Firebase. Ensure Anonymous Auth is enabled in your console.',
          );
        });
    } catch (e) {
      console.error('Firebase initialization error:', e);
      setError('Failed to initialize database connection.');
    }
  }, []);

  // 2. Firestore Listener for Real-time Data
  useEffect(() => {
    if (!isAuthReady || !db) return;

    const collectionPath = `artifacts/${APP_ID}/public/data/medicalRecords`;
    const recordsCollection = collection(db, collectionPath);
    const q = query(recordsCollection);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedRecords = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          .sort((a, b) => {
            if (
              a.createdAt &&
              b.createdAt &&
              typeof a.createdAt.toDate === 'function'
            ) {
              return b.createdAt.toDate() - a.createdAt.toDate();
            }
            return 0;
          });

        setRecords(fetchedRecords);
      },
      (dbError) => {
        console.error('Firestore Snapshot error:', dbError);
        setError('Failed to fetch records from database.');
      },
    );

    return () => unsubscribe();
  }, [isAuthReady, db]);

  // 3. Main Processing Logic: LLM Call & Firestore Save
  const processRecord = useCallback(async () => {
    if (isLoading) return;

    if (!rawInput.trim()) {
      setError('Please enter unformatted text to process.');
      return;
    }

    if (!isAuthReady || !db || !userId) {
      setError(
        'Database connection not ready. Please wait for authentication to complete.',
      );
      return;
    }

    if (!GEMINI_API_KEY) {
      setError(
        'Please set your NEXT_PUBLIC_GEMINI_API_KEY in the .env.local file.',
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    const systemPrompt =
      "You are a professional medical record organizer. Your task is to extract key medical information from the provided unformatted text and structure it into a clean JSON object. If a field is not found, use 'N/A' for strings or an empty array [] for lists.";

    const userQuery = `Organize the following unformatted patient healthcare record text:\n\n---\n\n${rawInput}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            patientName: { type: 'STRING' },
            dob: { type: 'STRING' },
            diagnosis: { type: 'ARRAY', items: { type: 'STRING' } },
            provider: { type: 'STRING' },
            visitDate: { type: 'STRING' },
            summary: { type: 'STRING' },
            medications: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['patientName', 'diagnosis', 'provider', 'summary'],
        },
      },
    };

    let structuredData;
    let jsonText;

    try {
      // 1️⃣ Call Gemini
      const response = await fetchWithBackoff(
        `${API_URL}?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned status ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!jsonText) {
        console.error('Full API response:', result);
        throw new Error('API response was empty or malformed. No text in candidates.');
      }

      const cleanJsonText = jsonText.replace(/```json\n|```/g, '').trim();
      structuredData = JSON.parse(cleanJsonText);

      const reportText = createMarkdownReport(structuredData);

      // 2️⃣ Try to write to Firestore, but with a 10s timeout
      const collectionRef = collection(
        db,
        `artifacts/${APP_ID}/public/data/medicalRecords`,
      );

      const writePromise = addDoc(collectionRef, {
        ...structuredData,
        markdownReport: reportText,
        rawText: rawInput,
        createdAt: serverTimestamp(),
        processedBy: userId,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Firestore write timed out after 10s')),
          10_000,
        ),
      );

      await Promise.race([writePromise, timeoutPromise]).catch((err) => {
        console.error('Firestore write failed or timed out:', err);
        // Surface a softer error but don’t break the entire flow
        setError(
          'Record was processed locally but saving to Firestore failed or timed out. Check your network or Firebase setup.',
        );
      });

      // 3️⃣ Update local state so you see it even if Firestore is borked
      setRecords((prev) => [
        {
          id: `local-${Date.now()}`,
          ...structuredData,
          markdownReport: reportText,
          rawText: rawInput,
        },
        ...prev,
      ]);

      setRawInput('');
    } catch (e) {
      console.error('Processing failed:', e);

      let errorMessage = 'Failed to process record. ';
      if (jsonText) {
        console.log(
          '[processRecord] Received jsonText:',
          jsonText.substring(0, 200) + '...',
        );
      }

      errorMessage += `Error: ${e.message}`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [rawInput, isAuthReady, db, userId, isLoading]);


  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center space-x-2">
          <ScanText className="w-8 h-8 text-blue-600" />
          <span>Gemini Medical Record Organizer</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Structure unformatted text using AI and persist data via Firestore.
        </p>
        <div className="mt-4 text-xs text-gray-400">
          User ID:{' '}
          {userId ? `${userId.substring(0, 8)}...` : 'Authenticating...'} | App
          ID: {APP_ID}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <InputPanel
          rawInput={rawInput}
          setRawInput={setRawInput}
          error={error}
          isLoading={isLoading}
          isAuthReady={isAuthReady}
          onProcess={processRecord}
        />

        <RecordsDisplay
          records={records}
          isLoading={isLoading}
          onSelectRecord={setSelectedRecord}
        />
      </div>

      {selectedRecord && (
        <DetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}
