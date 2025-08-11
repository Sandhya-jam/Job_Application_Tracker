import { useMemo, useState } from "react"
import { Edit,Trash2,Save,X} from "lucide-react"
import {format} from 'date-fns'
import { motion } from "framer-motion"
import { useDeleteMutation,useUpdateMutation } from "../../Redux/api/jobsApiSlice"
import { toast } from "react-toastify"

const AllJobs = ({jobs}) => {
  const [updateJob]=useUpdateMutation()
  const [deleteJob]=useDeleteMutation()

  const [selectedJob,setSelectedJob]=useState(null);
  const [isEditing,setIsEditing]=useState(false)
  const [editForm,setEditForm]=useState({})
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  
  const openDetails=(job)=>{
    setSelectedJob(job)
    setIsEditing(false)
    setEditForm({
    title: job.title || "",
    role: job.role || "",
    company: job.company || "",
    location: job.location || "",
    notes: job.notes || "",
    status: job.status || "",
    jobUrl: job.jobUrl || "",
    contacts: job.contacts || [],
  });
  };
  
  const handleStatusChange=async(jobId,newStatus)=>{
     try {
        await updateJob({id:jobId,data:{status:newStatus}}).unwrap()
        toast.success("Status updated successfully!");
     } catch (error) {
        toast.error(error?.data?.message || "Failed to update status")
     }
  };
   
  const handleDelete=async(job)=>{
     try {
        await deleteJob(job._id).unwrap()
        toast.success("Deleted Sucessfully")
     } catch (error) {
        toast.error('Error deleting the job')
     }
  }
  const handleSave=async(e)=>{
    e.preventDefault();
    try {
        await updateJob({id:selectedJob._id,data:editForm}).unwrap()

        toast.success("Job Updated Successfully")
        setIsEditing(false)
        setSelectedJob(null)
    } catch (error) {
        toast.error(error?.data?.message || "Failed to Update Job")
    }
  };

  return (
    <div className="overflow-auto rounded-sm">
        {/* Table */}
        <table className="w-full text-left text-sm">
            <thead>
                <tr className="bg-violet-400 text-white">
                    <th className="p-2">Company</th>
                    <th className="p-2">Position</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Date Applied</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {jobs?.map((job)=>(
                    <tr key={job._id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{job.company}</td>
                        <td className="p-2">{job.title}</td>
                        <td className="p-2">
                            <select
                            value={job.status}
                            onChange={(e)=>handleStatusChange(job._id,e.target.value)}
                            className="border rounded px-2 py-1 text-sm">
                                <option value="Wishlist">Wishlist</option>
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offered">Offered</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Declined">Declined</option>
                                <option value="Archieved">Archieved</option>
                            </select>
                        </td>
                        <td className="p-2">{new Date(job.dateApplied).toLocaleString()}</td>
                        <td className="p-2 text-center">
                            <button
                            onClick={()=>openDetails(job)}
                            className="bg-violet-500 hover:bg-violet-600 hover:cursor-pointer
                             text-white px-3 py-1 rounded text-sm">
                               View
                            </button>
                            <button
                            onClick={()=>{
                                setJobToDelete(job);
                                setShowDeleteModal(true)
                            }}
                            className="hover:cursor-pointer text-red-500 px-3 items-center hover:scale-90"
                            >
                              <Trash2 size={23}/>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* DELETE WINDOW */}
        {showDeleteModal && (
            <div className="fixed inset-x-0 top-0 bg-opacity-50 flex justify-center pt-16 z-50 "
            style={{ alignItems: 'flex-start' }}>
                <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg mt-4">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="mb-6">Are you sure you want to delete <strong>{jobToDelete.company} - {jobToDelete.title}</strong>?</p>
                <div className="flex justify-end gap-4">
                    <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={async () => {
                        try {
                        await deleteJob({ id: jobToDelete._id }).unwrap();
                        toast.success("Deleted successfully");
                        setShowDeleteModal(false);
                        setJobToDelete(null);
                        // optionally refetch jobs here
                        refetch();
                        } catch (error) {
                        toast.error("Error deleting the job");
                        }
                    }}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                    Delete
                    </button>
                </div>
                </div>
            </div>
            )}

        {/* Modal */}
        {selectedJob && (
            <div className="fixed inset-0 items-center flex justify-center z-50 bg-opacity-50">
                <motion.div
                initial={{scale:0.8,opacity:0}}
                animate={{scale:1,opacity:1}}
                className="bg-blue-200 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                  <button 
                  onClick={()=>setSelectedJob(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 hover:bg-red-500 hover:cursor-pointer h-6 w-5">X</button>

                  {!isEditing ? (
                      <>
                       <h2 className="text-xl font-semibold mb-4">{selectedJob.company}</h2>
                       <p><strong>Position:</strong> {selectedJob.title} ({selectedJob.role})</p>
                        <p><strong>Location:</strong> {selectedJob.location}</p>
                        <p><strong>Status:</strong> {selectedJob.status}</p>
                        <p><strong>Date Applied:</strong> {new Date(selectedJob.dateApplied).toLocaleDateString()}</p>
                        <p><strong>Job URL:</strong> <a href={selectedJob.jobUrl} target="_blank" className="text-blue-500 underline">{selectedJob.jobUrl}</a></p>
                        <p className="mt-3"><strong>Notes:</strong> {selectedJob.notes || "—"}</p>
                        

                        {selectedJob.contacts.length > 0 && (
                        <div className="mt-3">
                            <strong>Contacts:</strong>
                            <ul className="list-disc list-inside text-sm">
                            {selectedJob.contacts.map((c, idx) => (
                                <li key={idx}>{c.name} — {c.email}</li>
                            ))}
                            </ul>
                        </div>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 hover:cursor-pointer text-white px-4 py-1 rounded"
                        >
                            Edit
                        </button>
                        </div>
                    </>
                  ):(
                    <form onSubmit={handleSave}>
                        <label className="font-bold p-1 mb-2">Company</label>
                        <input
                        type="text"
                        value={editForm.company}
                        onChange={e=>setEditForm({...editForm,company:e.target.value})}
                        className="border rounded px-2 py-1 w-full mb-2"
                        placeholder="Company"
                        />
                        <label className="font-bold p-1 mb-2">Title</label>
                        <input
                        type="text"
                        value={editForm.title}
                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                        className="border rounded px-2 py-1 w-full mb-2"
                        placeholder="Job Title"
                        />
                        <label className="font-bold p-1 mb-2">Role</label>
                        <input
                        type="text"
                        value={editForm.role}
                        onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                        className="border rounded px-2 py-1 w-full mb-2"
                        placeholder="Role"
                        />
                        <label className="font-bold p-1 mb-2">Location</label>
                        <input
                        type="text"
                        value={editForm.location}
                        onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                        className="border rounded px-2 py-1 w-full mb-2"
                        placeholder="Location"
                        />
                        <label className="font-bold p-1 mb-2">Notes</label>
                        <textarea
                        value={editForm.notes}
                        onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                        className="border rounded px-2 py-1 w-full mb-2"
                        placeholder="Notes"
                        />

                         <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-300 px-4 py-1 rounded hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white px-4 py-1 rounded"
                        >
                            Save
                        </button>
                        </div>
                    </form>
                  )}
                </motion.div>
            </div>
        )}
    </div>
  );
}

export default AllJobs