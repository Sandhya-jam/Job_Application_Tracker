export default function DeleteModal({ show, job, onClose, onConfirm }) {
  if (!show || !job) return null;

  return (
    <div className="fixed inset-x-0 top-0 bg-opacity-50 flex justify-center pt-16 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg mt-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete <strong>{job.company} - {job.title}</strong>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
