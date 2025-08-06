import { motion } from "framer-motion"
import { useState,useEffect } from "react"
import { Link,redirect,useLocation,useNavigate } from "react-router-dom"
import { setCredientials } from "../../Redux/authSlice"
import { toast } from "react-toastify"
import {useRegisterMutation} from '../../Redux/api/usersApiSlice'
import { useDispatch,useSelector } from "react-redux"

const Register = () => {
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")

    const dispatch=useDispatch()
    const navigate=useNavigate()

    const [register,{isLoading}]=useRegisterMutation()
    const {userInfo}=useSelector(state=>state.auth)

    const submitHandler=async(e)=>{
       e.preventDefault()
       if(password!==confirmPassword){
        toast.error('Password do not match')
       }else{
         try {
            const res=await register({username,email,password}).unwrap()
            dispatch(setCredientials({...res}))
            toast.success('User Successfully registered')
         } catch (error) {
           console.log(error)
           toast.error(error?.data?.message || 'Registration failed')
         }
       }
    }

    // useEffect(()=>{
    //   if(userInfo){
    //      navigate('/')
    //   }
    // },[redirect,userInfo])

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4">
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
        >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={submitHandler}
        className="space-y-4">
          <label className="text-lg">Username</label>
          <input 
          type="text" 
          placeholder="Enter Your Name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={username} onChange={(e)=>setUsername(e.target.value)}/>
          <label className="text-lg">Email</label>
          <input 
          type="email" 
          placeholder="Enter Your Email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <label className="text-lg">Password</label>
          <input 
          type="password" 
          placeholder="Enter Password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <label className="text-lg">Confirm Password</label>
          <input 
          type="password" 
          placeholder="Confirm Password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition hover:cursor-pointer"
          >
           Register
          </button>
        </form>
         <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to='/login'
            className="text-pink-600 font-medium hover:underline">Login</Link>
         </p>
        </motion.div>
    </div>
  )
}

export default Register