import ErrorState from './ui/ErrorState';
import PatientList from './PatientList';
import { usePatients } from '@/queries/patient';
import { useState } from 'react';

const PatientSearch = () => {
  const [searchName, setSearchName] = useState('');

  const { data, isLoading, isError, error, refetch } = usePatients(
    searchName ? { name: searchName } : undefined
  );

  if (isError) {
    return (
      <ErrorState
        message={`Failed to load patients: ${error instanceof Error ? error.message : 'Unknown error'}`}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="w-full space-y-4 mb-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient List</h2>
      <div className="flex flex-row gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search patients by name..."
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex-grow text-sm"
          aria-label="Search patients"
        />
        <button
          className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
          aria-label="Add a new patient"
        >
          Add Patient
        </button>
      </div>

      <PatientList isLoading={isLoading} patients={data?.patients ?? []} />
    </div>
  );
};

export default PatientSearch;
