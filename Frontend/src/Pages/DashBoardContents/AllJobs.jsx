import { useEffect,useState } from "react"
import { Edit,Trash2,Save,X} from "lucide-react"
import {format} from 'date-fns'
import { motion } from "framer-motion"
import { useDeleteMutation,useUpdateMutation } from "../../Redux/api/jobsApiSlice"
import { toast } from "react-toastify"
import { NextEvent } from "../../Utils/NextEvent"

const AllJobs = ({jobs:initialJobs}) => {
  const [updateJob]=useUpdateMutation()
  const [deleteJob]=useDeleteMutation()
  const [jobs, setJobs] = useState(initialJobs);

  const [selectedJob,setSelectedJob]=useState(null);
  const [isEditing,setIsEditing]=useState(false)
  const [editForm,setEditForm]=useState({})
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs])

  const openDetails=(job)=>{
    setSelectedJob(job)
    setIsEditing(false)
    setEditForm({
    title: job.title || "",
    role: job.role || "",
    company: job.company || "",
    location: job.location || "",
    notes: job.notes || "",
    status: job.status || [],
    jobUrl: job.jobUrl || "",
    contacts: job.contacts || [{
        "name":"","email":"","position":"","phone":""
    }],
  });
  };
  
  const handleStatusChange=async(jobId,newStatus)=>{
     try {
         setJobs(prev =>
        prev.map(job =>
          job._id === jobId ? { ...job, curr_status: newStatus } : job
        )
      );

        await updateJob({id:jobId,data:{curr_status:newStatus}}).unwrap()
        toast.success("Status updated successfully!");
     } catch (error) {
        toast.error(error?.data?.message || "Failed to update status")
     }
  };
   
  const handleSave=async(e)=>{
    e.preventDefault();
    try {
        await updateJob({id:selectedJob._id,data:editForm}).unwrap()
        setJobs(prev =>
        prev.map(job =>
          job._id === selectedJob._id ? { ...job, ...editForm } : job
        )
      );

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
                    <th className="p-2">Upcoming Event</th>
                    <th className="p-2">Upcoming Event</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {jobs?.map((job)=>(
                    <tr key={job._id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{job.company}</td>
                        <td className="p-2">{`${job.title} (${job.role})`}</td>
                        <td className="p-2">
                            <select
                            value={job.curr_status}
                            onChange={(e)=>{
                                handleStatusChange(job._id,e.target.value)
                            }}
                            className="border rounded px-2 py-1 text-sm w-30">
                                {job.status?.map((s)=>(
                                    <option value={s.name} className="w-auto">{s.name}</option>
                                ))}
                            </select>
                        </td>
                        <td className="p-2">{
                            NextEvent(job.curr_status,job.status)!=-1 ?(
                               job.status[NextEvent(job.curr_status,job.status)].name
                            ):(
                              "-"
                            )
                            }
                        </td>
                        <td className="p-2">{
                            NextEvent(job.curr_status,job.status)!=-1 ?(
                               new Date(job.status[NextEvent(job.curr_status, job.status)].date).toLocaleDateString()
                            ):(
                              "-"
                            )
                            }
                        </td>
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
                        await deleteJob(jobToDelete._id);
                        toast.success("Deleted successfully");
                        setShowDeleteModal(false);
                        setJobToDelete(null);
                        
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
                        <p><strong>Status:</strong> {selectedJob.curr_status}</p>
                        <p><strong>Date Applied:</strong> {new Date(selectedJob.status[0].date).toLocaleDateString()}</p>
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
                    <form 
                    className="overflow-y-auto h-[80vh] pt-3"
                    onSubmit={handleSave}>
  {/* Company */}
  <label className="font-bold p-1 mb-2">Company</label>
  <input
    type="text"
    value={editForm.company}
    onChange={e => setEditForm({ ...editForm, company: e.target.value })}
    className="border rounded px-2 py-1 w-full mb-2"
    placeholder="Company"
  />

  {/* Title */}
  <label className="font-bold p-1 mb-2">Title</label>
  <input
    type="text"
    value={editForm.title}
    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
    className="border rounded px-2 py-1 w-full mb-2"
    placeholder="Job Title"
  />

  {/* Role */}
  <label className="font-bold p-1 mb-2">Role</label>
  <input
    type="text"
    value={editForm.role}
    onChange={e => setEditForm({ ...editForm, role: e.target.value })}
    className="border rounded px-2 py-1 w-full mb-2"
    placeholder="Role"
  />

  {/* Location */}
  <label className="font-bold p-1 mb-2">Location</label>
  <input
    type="text"
    value={editForm.location}
    onChange={e => setEditForm({ ...editForm, location: e.target.value })}
    className="border rounded px-2 py-1 w-full mb-2"
    placeholder="Location"
  />

  {/* Job URL */}
  <label className="font-bold p-1 mb-2">Job URL</label>
  <input
    type="text"
    value={editForm.jobUrl}
    onChange={e => setEditForm({ ...editForm, jobUrl: e.target.value })}
    className="border rounded px-2 py-1 w-full mb-2"
    placeholder="Job URL"
  />

  {/* Notes */}
  <label className="font-bold p-1 mb-2">Notes</label>
  <textarea
    value={editForm.notes}
    onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
    className="border rounded px-2 py-1 w-full mb-2"
    placeholder="Notes"
  />

  {/* Contacts Section */}
  <div className="mt-4">
    <label className="font-bold mb-2">Contacts</label>
    {editForm.contacts?.map((contact, idx) => (
      <div key={idx} className="border rounded p-3 bg-white mb-3">
        <input
          type="text"
          value={contact.name}
          onChange={e => {
            const updated = [...editForm.contacts];
            updated[idx].name = e.target.value;
            setEditForm({ ...editForm, contacts: updated });
          }}
          placeholder="Name"
          className="border rounded px-2 py-1 w-full mb-1"
        />
        <input
          type="email"
          value={contact.email}
          onChange={e => {
            const updated = [...editForm.contacts];
            updated[idx].email = e.target.value;
            setEditForm({ ...editForm, contacts: updated });
          }}
          placeholder="Email"
          className="border rounded px-2 py-1 w-full mb-1"
        />
        <input
          type="text"
          value={contact.phone || ""}
          onChange={e => {
            const updated = [...editForm.contacts];
            updated[idx].phone = e.target.value;
            setEditForm({ ...editForm, contacts: updated });
          }}
          placeholder="Phone"
          className="border rounded px-2 py-1 w-full mb-1"
        />
        <input
          type="text"
          value={contact.position || ""}
          onChange={e => {
            const updated = [...editForm.contacts];
            updated[idx].position = e.target.value;
            setEditForm({ ...editForm, contacts: updated });
          }}
          placeholder="Position"
          className="border rounded px-2 py-1 w-full mb-1"
        />
        <button
          type="button"
          onClick={() => {
            const updated = editForm.contacts.filter((_, i) => i !== idx);
            setEditForm({ ...editForm, contacts: updated });
          }}
          className="text-red-500 mt-1 text-sm hover:underline"
        >
          Remove
        </button>
      </div>
    ))}

    {/* Add new contact */}
    <button
      type="button"
      onClick={() =>
        setEditForm({
          ...editForm,
          contacts: [...(editForm.contacts || []), { name: "", email: "", phone: "", position: "" }],
        })
      }
      className="text-blue-500 hover:underline text-sm"
    >
      + Add Contact
    </button>
  </div>

  {/* Form Actions */}
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
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded hover:cursor-pointer"
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