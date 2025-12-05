// app/components/MedicalRecordOrganizer/DetailModal.js

import React from 'react';
import { X, Download } from 'lucide-react';

export default function DetailModal({ record, onClose }) {
  if (!record) return null;

  const handleDownload = () => {
    if (!record.markdownReport) return;

    const blob = new Blob([record.markdownReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const patientName =
      record.patientName?.replace(/[^a-z0-9]/gi, '_') || 'Patient';
    const visitDate =
      record.visitDate?.replace(/\//g, '-') ||
      new Date().toISOString().slice(0, 10);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${patientName}_${visitDate}_Medical_Report.md`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-start justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl transform transition-all my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Report: {record.patientName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-1 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="prose max-w-none text-gray-800 h-[60vh] overflow-y-auto p-4 border rounded-lg bg-gray-50">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {record.markdownReport}
            </pre>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-semibold">Original Unformatted Text:</p>
            <p className="mt-1 italic whitespace-pre-wrap max-h-24 overflow-y-auto">
              {record.rawText}
            </p>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            <Download className="w-5 h-5" />
            <span>Download Report (Markdown)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
