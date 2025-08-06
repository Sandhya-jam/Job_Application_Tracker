import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from 'cookie-parser'

import connectDB from './Config/db.js'
import userRoutes from './Routes/userRoutes.js'
import jobRoutes from './Routes/jobRoutes.js'

dotenv.config()
const port=process.env.PORT || 9000

connectDB();

const app=express()

app.use(express.json()) //used to send req with json body to frontend
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/users',userRoutes)
app.use('/api/jobs',jobRoutes)

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})
