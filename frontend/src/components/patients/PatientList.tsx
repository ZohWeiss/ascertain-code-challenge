import LoadingState from './ui/LoadingState';
import { Patient } from '@queries/patient';
import { PatientDetailsModal } from './PatientDetailsModal';
import PatientRow from '@components/patients/PatientRow';
import { isEmpty } from 'lodash-es';
import pluralize from 'pluralize';
import { useState } from 'react';

interface PatientListProps {
  isLoading: boolean;
  patients: Patient[];
}

const PatientList = ({ isLoading, patients }: PatientListProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <>
      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
              >
                DOB
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
              >
                Resource Type
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <LoadingState />}
            {!isLoading && isEmpty(patients) ? (
              <tr>
                <td colSpan={5}>No patients found. Please try again.</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <PatientRow
                  key={patient.id}
                  patient={patient}
                  onClickView={() => setSelectedPatient(patient)}
                />
              ))
            )}
          </tbody>
        </table>

        {!isEmpty(patients) && (
          <div className="flex justify-center gap-1 text-sm text-gray-700 p-5">
            Showing <strong>{patients.length}</strong> {pluralize('patient', patients.length)}
          </div>
        )}
      </div>

      {selectedPatient && (
        <PatientDetailsModal
          opened={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          patient={selectedPatient}
        />
      )}
    </>
  );
};

export default PatientList;
