// app/components/MedicalRecordOrganizer/InputPanel.js
'use client';

import React, { useState } from 'react';
import { Loader2, Save, Sparkles } from 'lucide-react';
import { GEMINI_API_KEY } from './config';
import { generateSampleRawMedicalText } from './utils';

export default function InputPanel({
  rawInput,
  setRawInput,
  error,
  isLoading,
  isAuthReady,
  onProcess,
}) {
  const [isSampleLoading, setIsSampleLoading] = useState(false);
  const [sampleError, setSampleError] = useState(null);

  const handleLoadSample = async () => {
    if (isSampleLoading) return;
    setSampleError(null);
    setIsSampleLoading(true);

    try {
      const sample = await generateSampleRawMedicalText();
      setRawInput(sample);
    } catch (e) {
      console.error('Sample data generation failed:', e);
      setSampleError(e.message || 'Failed to generate sample data.');
    } finally {
      setIsSampleLoading(false);
    }
  };

  const mainButtonDisabled =
    isLoading || !isAuthReady || !rawInput.trim() || !GEMINI_API_KEY;

  const sampleButtonDisabled = isSampleLoading || !GEMINI_API_KEY;

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

      {/* Main error from processing */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          Error: {error}
        </div>
      )}

      {/* Local error just for sample generation */}
      {sampleError && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg text-xs">
          Sample generator: {sampleError}
        </div>
      )}

      {/* Primary button: Process, format & save */}
      <button
        onClick={onProcess}
        disabled={mainButtonDisabled}
        className={`w-full mt-4 flex items-center justify-center space-x-2 font-bold py-3 px-4 rounded-lg transition duration-300 ${mainButtonDisabled
            ? 'bg-gray-400 cursor-not-allowed text-white'
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

      {/* Secondary button: Load Sample Data */}
      <button
        type="button"
        onClick={handleLoadSample}
        disabled={sampleButtonDisabled}
        className={`w-full mt-3 flex items-center justify-center space-x-2 font-semibold py-2.5 px-4 rounded-lg border transition duration-200 text-sm ${sampleButtonDisabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
          }`}
      >
        {isSampleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4 text-yellow-500" />
        )}
        <span>{isSampleLoading ? 'Loading sample...' : 'Load Sample Demo Data'}</span>
      </button>

      {!isAuthReady && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Connecting to Database...
        </p>
      )}
    </div>
  );
}
