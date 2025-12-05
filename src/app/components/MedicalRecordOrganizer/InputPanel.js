// app/components/MedicalRecordOrganizer/InputPanel.js

import React from 'react';
import { Loader2, Save } from 'lucide-react';
import { GEMINI_API_KEY } from './config';

export default function InputPanel({
  rawInput,
  setRawInput,
  error,
  isLoading,
  isAuthReady,
  onProcess,
}) {
  const hasGeminiKey = !!GEMINI_API_KEY;

  return (
    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl border border-blue-100 h-fit sticky top-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        1. Input Raw Record Text
      </h2>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg h-56 resize-none focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="Paste unformatted patient notes, discharge summaries, or lab results here..."
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        disabled={isLoading}
      />

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          Error: {error}
        </div>
      )}

      <button
        onClick={onProcess}
        disabled={
          isLoading || !isAuthReady || !rawInput.trim() || !hasGeminiKey
        }
        className={`w-full mt-4 flex items-center justify-center space-x-2 font-bold py-3 px-4 rounded-lg transition duration-300 ${isLoading || !isAuthReady || !rawInput.trim() || !hasGeminiKey
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
          }`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        <span>
          {isLoading ? 'Processing with AI...' : 'Process, Format & Save Record'}
        </span>
      </button>

      {!isAuthReady && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Connecting to Database...
        </p>
      )}
      {!hasGeminiKey && (
        <p className="text-center text-xs text-red-500 mt-1">
          Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local.
        </p>
      )}
    </div>
  );
}
