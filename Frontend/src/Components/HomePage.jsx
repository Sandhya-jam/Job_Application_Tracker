import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const HomePage = () => {

  return (
    <motion.div
    className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-6'
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration:0.8}}
    >
     <motion.div
     className='max-w-3xl w-full bg-white p-10 rounded-2xl shadow-2xl text-center'
     initial={{y:30,opacity:0}}
     animate={{y:0,opacity:1}}
     transition={{duration:0.6,delay:0.3}}>
     <motion.h1
     className='text-5xl font-extrabold text-blue-700 mb-6'
     initial={{scale:0.9}}
     animate={{scale:1}}
     transition={{duration:0.5}}>
       Job Application Tracker
     </motion.h1>
     <motion.p
     className='text-lg text-gray-700 mb-10'
     initial={{opacity:0}}
     animate={{opacity:1}}
     transition={{duration:0.8,delay:0.6}}>
      Keep your job hunt organized. Track applications, interviews, and more!
     </motion.p>
     <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Link to='/login'>
         <motion.button
         whileHover={{scale:1.05}}
         whileTap={{scale:0.95}}
         className='px-8 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 transition duration-300 hover:cursor-pointer'>
           Login
         </motion.button>
        </Link>
        <Link to='/register'>
          <motion.button
          whileHover={{scale:1.05}}
          whileTap={{scale:0.95}}
          className='px-8 py-3 bg-gray-300 text-gray-800 rounded-full text-lg hover:bg-gray-400 transition duration-300 hover:cursor-pointer'>
            Register
          </motion.button>
        </Link>
     </div>
     </motion.div>
    </motion.div>
  )
}

export default HomePage;