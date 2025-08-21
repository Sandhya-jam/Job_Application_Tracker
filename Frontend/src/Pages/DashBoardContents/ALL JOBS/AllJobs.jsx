import { useEffect, useState } from "react";
import { useDeleteMutation, useUpdateMutation } from "../../../Redux/api/jobsApiSlice";
import { toast } from "react-toastify";

import JobTable from "./JobTable";
import DeleteModal from "./DeleteModal";
import JobDetailsModal from "./JobDetailsModal";

const AllJobs = ({ jobs: initialJobs }) => {
  const [updateJob] = useUpdateMutation();
  const [deleteJob] = useDeleteMutation();
  const [jobs, setJobs] = useState(initialJobs);

  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  // handle status change
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, curr_status: newStatus } : job
        )
      );
      await updateJob({ id: jobId, data: { curr_status: newStatus } }).unwrap();
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };
  
  const handleDateUpdate=async(jobId,statusName,date)=>{
    try {
      await updateJob({
        id:jobId,
        data:{statusName,date}
      }).unwrap();

      setJobs(prev =>
      prev.map(job =>
        job._id === jobId
          ? {
              ...job,
              status: job.status.map((s) =>
                s.name === statusName ? { ...s, date } : s
              ),
              curr_status: statusName,
            }
          : job
      )
    );
    toast.success("Status date updated!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status date");
    }
  }
  // open job details
  const openDetails = (job) => {
    setSelectedJob(job);
    setIsEditing(false);
    setEditForm({
      title: job.title || "",
      role: job.role || "",
      company: job.company || "",
      location: job.location || "",
      notes: job.notes || "",
      status: job.status || [],
      jobUrl: job.jobUrl || "",
      contacts: job.contacts || [{ name: "", email: "", position: "", phone: "" }],
    });
  };

  // save job edits
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateJob({ id: selectedJob._id, data: editForm }).unwrap();
      setJobs((prev) =>
        prev.map((job) =>
          job._id === selectedJob._id ? { ...job, ...editForm } : job
        )
      );
      toast.success("Job Updated Successfully");
      setIsEditing(false);
      setSelectedJob(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to Update Job");
    }
  };

  // delete job
  const confirmDelete = async () => {
    try {
      await deleteJob(jobToDelete._id);
      setJobs((prev) => prev.filter((job) => job._id !== jobToDelete._id));
      toast.success("Deleted successfully");
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      toast.error("Error deleting the job");
    }
  };

  return (
    <div className="overflow-auto rounded-sm">
      <JobTable
        jobs={jobs}
        handleStatusChange={handleStatusChange}
        openDetails={openDetails}
        setJobToDelete={setJobToDelete}
        setShowDeleteModal={setShowDeleteModal}
        handleDateUpdate={handleDateUpdate}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDeleteModal}
        job={jobToDelete}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      {/* Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          onClose={() => setSelectedJob(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AllJobs;
