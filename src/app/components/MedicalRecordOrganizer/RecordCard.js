// app/components/MedicalRecordOrganizer/RecordCard.js

import React from 'react';
import { FileText } from 'lucide-react';

export default function RecordCard({ record, onSelect }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800 truncate">
          {record.patientName || 'Unknown Patient'}
        </h3>
        <p className="text-sm text-blue-600 font-medium">
          {record.provider || 'N/A Provider'}
        </p>
        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-semibold">Diagnosis:</span>{' '}
            {record.diagnosis?.[0] || 'No primary diagnosis'}
          </p>
          <p>
            <span className="font-semibold">Visit Date:</span>{' '}
            {record.visitDate || 'N/A'}
          </p>
        </div>
      </div>
      <button
        onClick={() => onSelect(record)}
        className="mt-4 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
      >
        <FileText className="w-4 h-4" />
        <span>View Report</span>
      </button>
    </div>
  );
}
