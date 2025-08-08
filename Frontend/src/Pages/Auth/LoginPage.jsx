import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {useDispatch,useSelector} from 'react-redux'
import {useLoginMutation} from '../../Redux/api/usersApiSlice'
import { toast } from "react-toastify"
import {setCredientials} from '../../Redux/authSlice'

const LoginPage = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [login,{isLoading}]=useLoginMutation()

    const {userInfoJ}=useSelector(state=>state.auth)

    const submitHandler=async(e)=>{
      e.preventDefault();
      try {
        const res=await login({email,password}).unwrap()
        dispatch(setCredientials({...res}))
        toast.success('Login Successfull')
      } catch (error) {
        console.log(error)
        toast.error(error?.data?.message || error.message)
      }
    }

    useEffect(()=>{
      if(userInfoJ){
        navigate('/dashboard')
      }
    },[navigate,userInfoJ])

  return(
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center p-4">
    <motion.div
    className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
    initial={{opacity:0,y:100}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.8}}
    >
    <h2 className="text-2xl font-bold mb-6 text-center font-serif">Login to Your Account</h2>
    <form onSubmit={submitHandler}
    className="space-y-4">
        <label className="text-2xl font-serif">Email</label>
        <input type="text"
        placeholder="Enter your email"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:bg-purple-500 placeholder:text-gray-800 placeholder:text-lg"
        value={email} onChange={(e)=>setEmail(e.target.value)}
        />
        <label className="text-2xl font-serif">Password</label>
        <input type="password"
        placeholder="Enter password"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:bg-purple-500
        placeholder:text-gray-800 placeholder:text-lg"
        value={password} onChange={(e)=>setPassword(e.target.value)}
        />
        <button 
        type="submit"
        className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition cursor-pointer">
        Login</button>
    </form>
    <p className="text-center text-lg text-gray-800 mt-4">
        Don't have an account?{" "}
        <Link to='/register' 
        className="text-purple-600 font-medium hover:underline">Register</Link>
    </p>
    </motion.div>
    </div>
  )
}

export default LoginPage