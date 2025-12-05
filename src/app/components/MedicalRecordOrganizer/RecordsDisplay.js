// app/components/MedicalRecordOrganizer/RecordsDisplay.js

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import RecordCard from './RecordCard';

export default function RecordsDisplay({ records, isLoading, onSelectRecord }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return records;

    const lowerCaseSearch = searchTerm.toLowerCase();

    return records.filter(
      (record) =>
        record.patientName?.toLowerCase().includes(lowerCaseSearch) ||
        record.provider?.toLowerCase().includes(lowerCaseSearch) ||
        record.diagnosis?.some((diag) =>
          diag.toLowerCase().includes(lowerCaseSearch),
        ),
    );
  }, [records, searchTerm]);

  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        2. Searchable Records ({filteredRecords.length})
      </h2>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by Patient Name, Diagnosis, or Provider..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {records.length === 0 && !isLoading && (
        <div className="text-center p-10 bg-white rounded-xl shadow-inner text-gray-500">
          No records found. Start by processing a record!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecords.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            onSelect={onSelectRecord}
          />
        ))}
      </div>
    </div>
  );
}
