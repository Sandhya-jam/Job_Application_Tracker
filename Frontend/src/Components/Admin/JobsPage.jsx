import { useState } from "react";
import {
  useGetJobsQuery,
  useDeleteJobMutation,
} from "../../Redux/api/adminApiSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading } = useGetJobsQuery({
    page,
    limit: 10,
    search,
    filters,
  });
  const [deleteJob] = useDeleteJobMutation();

  const handleDelete = async (id) => {
    try {
      await deleteJob(id).unwrap();
      toast.success("Job deleted");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete job");
    }
  };

  if (isLoading)
    return (
      <p className="text-center mt-10 text-lg font-semibold">Loading jobs...</p>
    );

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Jobs</h2>

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search jobs..."
          className="w-full sm:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Posted By</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <AnimatePresence component="tbody">
            {data?.jobs?.map((job, idx) => (
              <motion.tr
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{job.title}</td>
                <td className="p-3">{job.company}</td>
                <td className="p-3">{job.location}</td>
                <td className="p-3">{job.curr_status}</td>
                <td className="p-3">{job.user?.username}</td>
                <td className="p-3 text-center">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setConfirmDelete(job)}
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                  >
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {data?.jobs?.map((job, idx) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white shadow-md rounded-lg p-4"
          >
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-gray-500">{job.location}</p>
            <p className="mt-2">Status: {job.curr_status}</p>
            <p className="text-sm text-gray-400">
              Posted by: {job.user?.username}
            </p>
            <div className="flex gap-3 mt-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setConfirmDelete(job)}
                className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 shadow-lg w-96"
            >
              <h3 className="text-xl font-semibold mb-4 text-center">
                Confirm Deletion
              </h3>
              <p className="mb-6 text-gray-600 text-center">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{confirmDelete.title}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      <div className="mt-4 flex gap-2 justify-center">
        <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
            Prev
        </button>
        <span className="px-3 py-1 bg-gray-100 rounded">
            Page {data?.page} of {data?.pages}
        </span>
        <button
            onClick={() => setPage((p) => Math.min(p + 1, data?.pages || p + 1))}
            disabled={page === data?.pages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
            Next
        </button>
        </div>

    </div>
  );
}
