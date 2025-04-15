import { Modal } from '@mantine/core';
import { Patient } from '@/queries/patient';
import { noop } from 'lodash-es';

export type PatientDetailsModalProps = {
  opened: boolean;
  onClose: () => void;
  patient: Patient;
};

export const PatientDetailsModal = ({
  opened,
  onClose = noop,
  patient,
}: PatientDetailsModalProps) => {
  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      title={<div className="text-2xl font-bold">{patient.full_name}</div>}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[140px_1fr] gap-2">
          <strong className="text-gray-700">ID:</strong>
          <span>{patient.id}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr] gap-2">
          <strong className="text-gray-700">Date of Birth:</strong>
          <span>{patient.birth_date}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr] gap-2">
          <strong className="text-gray-700">Resource Type:</strong>
          <span>{patient.resourceType}</span>
        </div>
      </div>
    </Modal>
  );
};
