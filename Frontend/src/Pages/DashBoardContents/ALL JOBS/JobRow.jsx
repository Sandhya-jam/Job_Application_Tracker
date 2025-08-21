import { Trash2 } from "lucide-react";
import StatusSelect from "./StatusSelect";
import { NextEvent } from "../../../Utils/NextEvent";

export default function JobRow({ job, handleStatusChange, openDetails, setJobToDelete, setShowDeleteModal,handleDateUpdate }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2">{job.company}</td>
      <td className="p-2">{`${job.title} (${job.role})`}</td>
      <td className="p-2">
        <StatusSelect 
        job={job} 
        onChange={handleStatusChange} 
        onDateUpdate={handleDateUpdate}/>
      </td>
      <td className="p-2">
        {NextEvent(job.curr_status, job.status) !== -1
          ? job.status[NextEvent(job.curr_status, job.status)].name
          : "-"}
      </td>
      <td className="p-2">
        {NextEvent(job.curr_status, job.status) !== -1 &&
        job.status[NextEvent(job.curr_status, job.status)]?.date
          ? new Date(job.status[NextEvent(job.curr_status, job.status)].date).toLocaleDateString()
          : "-"}
      </td>
      <td className="p-2 text-center">
        <button
          onClick={() => openDetails(job)}
          className="bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 rounded text-sm"
        >
          View
        </button>
        <button
          onClick={() => {
            setJobToDelete(job);
            setShowDeleteModal(true);
          }}
          className="text-red-500 px-3 hover:scale-90"
        >
          <Trash2 size={23} />
        </button>
      </td>
    </tr>
  );
}
