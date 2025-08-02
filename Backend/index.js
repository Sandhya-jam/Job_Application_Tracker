import express from 'express'


const port=process.env.PORT || 9000
const app=express()

app.use(express.json()) //used to send req with json body to frontend

app.post('/api',(req,res)=>{
    res.send("Hello there!!")
})
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})
