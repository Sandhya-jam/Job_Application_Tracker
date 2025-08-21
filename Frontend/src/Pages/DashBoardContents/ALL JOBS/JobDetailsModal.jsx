import { motion } from "framer-motion";

export default function JobDetailsModal({ job, isEditing, setIsEditing, editForm, setEditForm, onClose, onSave }) {
  return (
    <div className="fixed inset-0 items-center flex justify-center z-50 bg-opacity-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-blue-200 rounded-lg shadow-lg p-6 w-full max-w-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 hover:bg-red-500 hover:cursor-pointer h-6 w-5"
        >
          X
        </button>

        {!isEditing ? (
          <>
            <h2 className="text-xl font-semibold mb-4">{job.company}</h2>
            <p><strong>Position:</strong> {job.title} ({job.role})</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Status:</strong> {job.curr_status}</p>
            <p><strong>Date Applied:</strong> {new Date(job.status[0].date).toLocaleDateString()}</p>
            <p><strong>Job URL:</strong> <a href={job.jobUrl} target="_blank" className="text-blue-500 underline">{job.jobUrl}</a></p>
            <p className="mt-3"><strong>Notes:</strong> {job.notes || "—"}</p>

            {job.contacts.length > 0 && (
              <div className="mt-3">
                <strong>Contacts:</strong>
                <ul className="list-disc list-inside text-sm">
                  {job.contacts.map((c, idx) => (
                    <li key={idx}>{c.name} — {c.email}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
              >
                Edit
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={onSave} className="overflow-y-auto h-[80vh] pt-3">
            {/* Form fields same as before */}
            {/* (Company, Title, Role, Location, Job URL, Notes, Contacts...) */}
          </form>
        )}
      </motion.div>
    </div>
  );
}
