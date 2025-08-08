import { motion } from "framer-motion"
import { User,Mail,Briefcase } from "lucide-react"
import { useEffect, useState } from "react";
import { useGetProfileQuery,useUpdateProfileMutation } from "../Redux/api/usersApiSlice";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import {setCredientials} from '../Redux/authSlice'

const Profile = () => {
   
   const [editing,setEditing]=useState(false)
   const [formData,setFormData]=useState({
    username:'',
    email:'',
    bio:'',
    location:'',
    role:''
  })
   const {data}=useGetProfileQuery()

   const [updateProfile]=useUpdateProfileMutation();
   const dispatch=useDispatch()
   
   useEffect(()=>{
     setFormData(prev=>({
       ...prev,
       username:data?.username,
       email:data?.email,
       bio:data?.bio,
       location:data?.location,
       role:data?.role
     }))
   },[data])
   
   const handleChange=(e)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
   };

   const handleSave=async()=>{
     try {
       const res=await updateProfile({
          _id:data._id,
          username:formData.username,
          email:formData.email,
          role:formData.role,
          bio:formData.bio,
          location:formData.location
       }).unwrap()
       dispatch(setCredientials({...res}))
       toast.success('Profile updated Successfully')
     } catch (error) {
       toast.error(error?.data?.message || error.message)
     }
     setEditing(false)
   };
   
  return (
    <motion.div
    initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5}}
    className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-3xl font-semibold shadow-md">
                <User className="w-10 h-10"/>
            </div>
            <div className="flex-1">
              {editing?(
                <input
                type="text"
                name="username"
                value={formData?.username}
                onChange={handleChange}
                className="text-2xl font-bold text-gray-800 border-b w-full"/>
              ):(
                <h2 className="text-2xl font-bold text-gray-800">{formData?.username}</h2>
              )}
              <p className='text-sm text-gray-500'>Joined {data?.joined}</p>
            </div>
            <button
            onClick={()=>(editing ? handleSave():setEditing(true))}
            className='px-4 py-2 text-sm rounded-md bg-purple-500 text-white hover:bg-purple-600 hover:cursor-pointer'>
                {editing ? 'Save':'Edit'}
            </button>
        </div>
        <div className='space-y-4'>
            <div className='flex items-center gap-3'>
                <Mail className='w-5 h-5 text-purple-500'/>
                {editing?(
                   <input
                   type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleChange}
                    className="border-b flex-1"/> 
                ):(
                <p className="text-gray-700">{formData?.email}</p>
                )}
            </div>

            <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-pink-500" />
            {editing ? (
              <input
                type="text"
                name="role"
                value={formData?.role}
                onChange={handleChange}
                className="border-b flex-1"
              />
            ) : (
              <p className="text-gray-700">Role: {formData?.role}</p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Bio</h3>
            {editing ? (
              <textarea
                name="bio"
                value={formData?.bio}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm"
              />
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed">{formData?.bio}</p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Location</h3>
            {editing ? (
              <input
                type="text"
                name="location"
                value={formData?.location}
                onChange={handleChange}
                className="border-b w-full"
              />
            ) : (
              <p className="text-gray-600 text-sm">{formData?.location}</p>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default Profile