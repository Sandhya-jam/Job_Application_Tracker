import JobRow from "./JobRow";

export default function JobTable({ jobs, handleStatusChange, openDetails, setJobToDelete, setShowDeleteModal,handleDateUpdate }) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="bg-violet-400 text-white">
          <th className="p-2">Company</th>
          <th className="p-2">Position</th>
          <th className="p-2">Status</th>
          <th className="p-2">Upcoming Event</th>
          <th className="p-2">Next Event Date</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs?.map((job) => (
          <JobRow
            key={job._id}
            job={job}
            handleStatusChange={handleStatusChange}
            openDetails={openDetails}
            setJobToDelete={setJobToDelete}
            setShowDeleteModal={setShowDeleteModal}
            handleDateUpdate={handleDateUpdate}
          />
        ))}
      </tbody>
    </table>
  );
}
