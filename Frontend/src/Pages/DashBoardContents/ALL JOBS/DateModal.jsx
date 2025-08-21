import { useState } from "react";

export default function DateModal({ statusName, jobId, onClose, onSave }) {
  const [selectedDate, setSelectedDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate) return;
    onSave(selectedDate); // Pass date back to parent
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          Set Date for <span className="text-violet-600">{statusName}</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-4"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
