import { useState } from "react";
import DateModal from "./DateModal";

export default function StatusSelect({ job, onChange, onDateUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const handleChange = (e) => {
    const selectedStatus = e.target.value;
    const statusObj = job.status.find((s) => s.name === selectedStatus);

    if (statusObj?.date) {
      onChange(job._id, selectedStatus);
    } else {
      setPendingStatus(selectedStatus);
      setShowModal(true);
    }
  };

  return (
    <>
      <select
        value={job.curr_status}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm w-30"
      >
        {job.status?.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      {showModal && (
        <DateModal
          statusName={pendingStatus}
          jobId={job._id}
          onClose={() => {
            setPendingStatus(null);
            setShowModal(false);
          }}
          onSave={(date) => {
            onDateUpdate(job._id, pendingStatus, date);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
