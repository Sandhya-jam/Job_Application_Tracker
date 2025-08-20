import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../Redux/api/adminApiSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetUsersQuery({ page, limit: 10, search });
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "" });

  // Confirmation modal state
  const [confirmAction, setConfirmAction] = useState(null);

  if (isLoading)
    return (
      <p className="text-center mt-10 text-lg font-semibold">Loading users...</p>
    );

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted");
    } catch(err) {
      toast.error(err.data.message ||"Failed to delete user");
    }
  };

  const handleToggleAdmin = async (user) => {
    try {
      await updateUser({
        id: user._id,
        body: { isAdmin: !user.isAdmin },
      }).unwrap();
      toast.success("User updated");
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email });
  };

  const handleUpdate = async () => {
    try {
      await updateUser({
        id: editingUser._id,
        body: { ...formData },
      }).unwrap();
      toast.success("User updated");
      setEditingUser(null);
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h2>

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search users..."
          className="w-full sm:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="hidden md:block">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Admin</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data?.users?.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 text-center">
                    {user.isAdmin ? "✅" : "❌"}
                  </td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleEdit(user)}
                      className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() =>
                        setConfirmAction({
                          type: "toggleAdmin",
                          user,
                        })
                      }
                      className={`px-4 py-1 rounded-lg shadow-sm text-white ${
                        user.isAdmin
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() =>
                        setConfirmAction({ type: "delete", user })
                      }
                      className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
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
              <h3 className="text-xl font-semibold mb-4">Edit User</h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Name"
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email"
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
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
                {confirmAction.type === "delete"
                  ? `Delete ${confirmAction.user.name}?`
                  : confirmAction.user.isAdmin
                  ? `Revoke admin from ${confirmAction.user.name}?`
                  : `Make ${confirmAction.user.name} an admin?`}
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmAction.type === "delete") {
                      handleDelete(confirmAction.user._id);
                    } else {
                      handleToggleAdmin(confirmAction.user);
                    }
                    setConfirmAction(null);
                  }}
                  className={`px-4 py-2 text-white rounded-lg ${
                    confirmAction.type === "delete"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
        <div className="mt-6 flex justify-center gap-4 items-center">
        <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
        >
            Prev
        </button>
        <span className="font-medium">Page {page}</span>
        <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
            Next
        </button>
        </div>
    </div>
  );
}
