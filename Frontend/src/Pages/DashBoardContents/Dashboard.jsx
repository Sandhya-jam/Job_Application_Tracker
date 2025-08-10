import { useState } from "react"
import { motion } from "framer-motion"
import { useLogoutMutation } from "../../Redux/api/usersApiSlice"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
 } from "recharts"
import { Edit, Plus, Trash2, User } from "lucide-react"
import { logout } from "../../Redux/authSlice"
import { toast } from "react-toastify"
import CreateForm from "./CreateForm"
const Dashboard = () => {

  const jobStats = [
    { name: "Applied", value: 35 },
    { name: "Interview", value: 10 },
    { name: "Offer", value: 5 },
    { name: "Rejected", value: 8 },
  ];
  
  const applicationsOverTime = [
    { month: "Jan", applications: 5 },
    { month: "Feb", applications: 8 },
    { month: "Mar", applications: 12 },
    { month: "Apr", applications: 7 },
    { month: "May", applications: 10 },
    { month: "Jun", applications: 14 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
  
  const initialJobs = [
  { id: 1, company: "Google", position: "Software Engineer", status: "Interview", date: "2025-07-01" },
  { id: 2, company: "Amazon", position: "Backend Developer", status: "Applied", date: "2025-07-05" },
  { id: 3, company: "Microsoft", position: "DevOps Engineer", status: "Rejected", date: "2025-06-20" },
];

  const [profile]=useState({
    name:'Sandhya Rani',
    email:'jamsandhyarani@yahoo.com',
    role:'Intern Seeker'
  });
  
  const [menuOpen,setMenuOpen]=useState(false)
  const toggleMenu=()=>setMenuOpen(!menuOpen)
  const [search,setSearch]=useState('')
  const [filter,setFilter]=useState('All')
  const [jobs,setJobs]=useState(initialJobs)
  const [openAdd,setOpenAdd]=useState(false)

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = `${job.company} ${job.position}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || job.status === filter;
    return matchesSearch && matchesFilter;
  });

  const dispatch=useDispatch()
  const navigate=useNavigate()
  
  const [logoutApiCall] =useLogoutMutation()

  const handlelogout=async()=>{
     try {
       await logoutApiCall().unwrap()
       dispatch(logout())
       navigate('/login')
     } catch (error) {
       console.log(error.message)
       toast.error('Failed to Logout')
     }
  }
  
  return (
    <motion.div
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration:0.5}}
    className="min-h-screen bg-gray-100 p-4 md:p-8">
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Job Application Dashboard</h1>
      <div className="relative">
       <button
       onClick={toggleMenu}
       className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition hover:cursor-pointer">
         <User className="w-5 h-5"/>
       </button>
       {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-purple-200 rounded-lg shadow-lg z-10">
          <button
          onClick={()=>navigate('/profile')}
          className="w-full text-left px-4 py-2 text-sm hover:bg-purple-100 rounded-t-lg hover:cursor-pointer">
           Profile
          </button>
          <button 
          onClick={handlelogout}
          className="w-full text-left px-4 py-2 text-sm hover:bg-pink-100 rounded-b-lg hover:cursor-pointer">
            Logout
          </button>
        </div>
       )}
      </div>
    </header>
     
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
      whileHover={{scale:1.02}}
      className="bg-blue-200 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Application Status</h2>
       <ResponsiveContainer width='100%' height={250}>
         <PieChart>
           <Pie
           data={jobStats}
           dataKey='value'
           nameKey='name'
           outerRadius={100}
           label>
             {jobStats.map((entry,index)=>(
              <Cell 
              key={`cell-${index}`}
              fill={COLORS[index%COLORS.length]}/>
             ))}
           </Pie>
           <Tooltip/>
         </PieChart>
       </ResponsiveContainer>
      </motion.div>

      <motion.div
      whileHover={{scale:1.02}} 
      className="bg-violet-200 p-4 rounded-lg shadow">
       <h2 className="text-xl font-semibold mb-4">Applications Over Time</h2>
       <ResponsiveContainer width='100%' height={250}>
         <LineChart data={applicationsOverTime}>
           <XAxis dataKey='month'/>
           <YAxis/>
           <Tooltip/>
           <Line
           type='monotone'
           dataKey='applications'
           stroke="#8884d8"
           strokeWidth={2}
           />
         </LineChart>
       </ResponsiveContainer>
      </motion.div>

      <motion.div
      whileHover={{scale:1.02}} className="bg-white p-4 rounded-lg shadow md:col-span-2">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">All Job Applications</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
          type="text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search Jobs.."
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"/>
          <select
          value={filter}
          onChange={(e)=>setFilter(e.target.value)}
          className="px-3 py-2 border border-gary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300">
            <option >All</option>
            <option >Applies</option>
            <option >Interview</option>
            <option >Offer</option>
            <option >Rejected</option>
          </select>
          <button
          onClick={()=>setOpenAdd(!openAdd)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:cursor-pointer">
           <Plus className="w-4 h-4"/>Add Job
          </button>
        </div>
       </div>
        
        <div className="overflow-auto rounded-sm">
          <table className="w-full text-left text-sm">
            <thead>
               <tr className="bg-violet-400">
                 <th className="p-2">Company</th>
                 <th className="p-2">Position</th>
                 <th className="p-2">Status</th>
                 <th className="p-2">Date Applied</th>
                 <th className="p-2 text-center">Actions</th>
               </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job)=>(
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{job.company}</td>
                    <td className="p-2">{job.position}</td>
                    <td className="p-2">{job.status}</td>
                    <td className="p-2">{job.date}</td>
                    <td className="p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                        //onClick={()=>handleUpdate()}
                        className="p-1 text-blue-600 hover:text-blue-800">
                         <Edit className="w-4 h-4"/>
                        </button>
                        <button
                        //onClick={()=>handledelete}
                        className="p-1 text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </motion.div>
     </div>
    {openAdd && (
       <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50"
       onClick={()=>setOpenAdd(false)}>
         <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full"
         onClick={(e)=>e.stopPropagation()}>
           <CreateForm/>
         </div>
       </div>
    )}
    </motion.div>
  )
}

export default Dashboard