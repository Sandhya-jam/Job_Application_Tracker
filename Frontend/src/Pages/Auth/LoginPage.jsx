import { motion } from "framer-motion"
import { useState } from "react"
import { Link } from "react-router-dom"
const LoginPage = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

  return(
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center p-4">
    <motion.div
    className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
    initial={{opacity:0,y:100}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.8}}
    >
    <h2 className="text-2xl font-bold mb-6 text-center font-serif">Login to Your Account</h2>
    <form className="space-y-4">
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
        <button className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition cursor-pointer">Login</button>
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