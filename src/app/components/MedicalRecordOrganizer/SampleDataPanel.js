'use client';

import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { generateSampleRawMedicalText } from './utils';

export default function SampleDataPanel({ onFill }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setLocalError(null);
    setIsGenerating(true);

    try {
      const sample = await generateSampleRawMedicalText();
      onFill(sample); // fills rawInput in the parent
    } catch (e) {
      console.error('Sample data generation failed:', e);
      setLocalError(e.message || 'Failed to generate sample data.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-4 p-4 bg-white rounded-2xl shadow-md border border-dashed border-blue-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Need messy demo data?</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Click to generate a random, super unformatted sample medical note using Gemini.
            It will auto-fill the input box so you can run a demo instantly.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${isGenerating
              ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Generating…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              <span>Generate Sample</span>
            </>
          )}
        </button>
      </div>

      {localError && (
        <p className="mt-2 text-[11px] text-red-600">
          {localError}
        </p>
      )}
    </div>
  );
}
