import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useLogoutMutation } from "../../Redux/api/usersApiSlice"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useGetByStatusQuery,useGetByMonthQuery, useGetAllJobsQuery} from "../../Redux/api/jobsApiSlice"
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
import {Plus,User } from "lucide-react"
import { logout } from "../../Redux/authSlice"
import { toast } from "react-toastify"
import CreateForm from "./CreateForm"
import AllJobs from "./AllJobs"
import Analytics from "./Analytics"

const Dashboard = () => {

  const {data:jobStats}=useGetByStatusQuery();
  const pieData = jobStats
  ? Object.entries(jobStats).map(([name, value]) => ({ name, value }))
  : [];

  const {data:monthData}=useGetByMonthQuery()
  const [selectedYear,setSelectedYear]=useState(new Date().getFullYear());
  const availableYrs=[...new Set(monthData?.map(item=>item.month.split("-")[0]))]
  
  const applicationsOverTime = useMemo(()=>{
    return monthData
    ?.filter(item=>item.month.startsWith(selectedYear.toString()))
    .map(item=>{
      const date=new Date(item.month+"-01");
      const monthLabel=date.toLocaleString("default",{month:'short'});
      return {month:monthLabel,applications:item.count};
    })
    .sort((a,b)=>{
      const monthOrder=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return monthOrder.indexOf(a.month)-monthOrder.indexOf(b.month);
    });
  },[monthData,selectedYear])

  const COLORS = [
  "#8884d8", // soft purple
  "#82ca9d", // green
  "#ffc658", // yellow
  "#ff8042", // orange
  "#8dd1e1", // light blue
  "#a4de6c", // lime green
  "#d0ed57", // bright yellow-green
  "#ff7f50"  // coral
];
  
  const {data:jobs}=useGetAllJobsQuery();

  const [menuOpen,setMenuOpen]=useState(false)
  const toggleMenu=()=>setMenuOpen(!menuOpen)
  const [search,setSearch]=useState('')
  const [filter,setFilter]=useState('All')
  const [openAdd,setOpenAdd]=useState(false)
  const [roleFilter,setRoleFilter]=useState('All')

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = `${job.company} ${job.title}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || job.curr_status === filter;
    const matchesRole= roleFilter ==="All" || job.role===roleFilter;
    return matchesSearch && matchesFilter && matchesRole;
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

    {/* PIE CHART */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
      whileHover={{scale:1.02}}
      className="bg-blue-200 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Application Status</h2>
      {pieData.length!==0 && (
          <ResponsiveContainer width='100%' height={250}>
         <PieChart>  
           <Pie
           //converting obj into array(as we are getting data as obj from backend)
           data={pieData} 
           dataKey='value'
           nameKey='name'
           outerRadius={100}
           label>
             {pieData.map((entry,index)=>(
              <Cell 
              key={`cell-${index}`}
              fill={COLORS[index%COLORS.length]}/>
             ))}
           </Pie>
           <Tooltip/>
         </PieChart>
       </ResponsiveContainer>
      )}

      {pieData.length===0 && (
         <p className="text-gray-600 text-lg text-center mt-[5rem]">No Job Stats Available</p>
      )}
       
      </motion.div>

      <motion.div
      whileHover={{scale:1.02}} 
      className=" relative bg-violet-200 p-4 rounded-lg shadow">
       <h2 className="text-xl font-semibold mb-4">Applications Over Time</h2>

       {/* Year dropdown */}
       <div className="flex justify-between items-center mb-4">
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {availableYrs.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Chart */}
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
     </div>

     {/* STATISTICS */}
        <div className="w-full mt-6">
          <Analytics/>
        </div>
     
     {/* FILTERS */}
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
          value={roleFilter}
          onChange={(e)=>setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300">
            <option value="All">All(role)</option>
            <option value="FTE">FTE</option>
            <option value="Intern">Intern</option>
          </select>
          <select
          value={filter}
          onChange={(e)=>setFilter(e.target.value)}
          className="px-3 py-2 border border-gary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300">
            <option value="All">All(status)</option>
            <option value="Wishlist">Wishlist</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offered">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
            <option value="Archieved">Archieved</option>
          </select>
          <button
          onClick={()=>setOpenAdd(!openAdd)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:cursor-pointer">
           <Plus className="w-4 h-4"/>Add Job
          </button>
        </div>
       </div>
        
        <AllJobs jobs={(roleFilter==='All' && search==='' && filter==='All')?jobs:filteredJobs}/>

      </motion.div>
    {openAdd && (
       <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50"
       onClick={()=>setOpenAdd(false)}>
         <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full"
         onClick={(e)=>e.stopPropagation()}>
        <button
        onClick={() => setOpenAdd(false)}
        className=" relative left-112 -top-2 text-gray-600 hover:text-gray-900 focus:outline-none 
         hover:bg-red-500 h-7 w-6 rounded-sm hover:cursor-pointer"
        >X</button>
        <CreateForm/>
         </div>
       </div>
    )}

    </motion.div>

  )
}

export default Dashboard