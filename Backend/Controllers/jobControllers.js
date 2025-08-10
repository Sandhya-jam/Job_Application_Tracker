import mongoose from 'mongoose';
import Job from '../Models/jobModel.js'

const createJob=async(req,res)=>{
    try {
        const{
            title,
            role,
            company,
            location,
            jobUrl,
            status,
            dateApplied,
            notes,
            contacts,
        }=req.body;
        if(!title && !role && !company && !location){
            res.status(400).send({error:'Required to fill titlle,role,comapany & location'})
        }

        const newJob=new Job({
            title,
            role,
            company,
            location,
            jobUrl,
            status,
            dateApplied,
            notes,
            contacts,
            user:req.user._id
        });

        const savedJob=await newJob.save()
        res.status(201).json(savedJob)
    } catch (error) {
        console.error('Error creating job',error)
        res.status(500).json({error:'Server error'});
    }
};

const updateJob=async(req,res)=>{
    const jobId=req.params.id
    
    const allowedUpdates=[
        'title',
        'role',
        'company',
        'location',
        'jobUrl',
        'status',
        'notes',
        'contacts'
    ];

    const updates={};
    for(const key of allowedUpdates){
        if(req.body[key]!==undefined){
            updates[key]=req.body[key];
        }
    }

    updates.lastUpdated=new Date()

   try {
     const updatedJob=await Job.findByIdAndUpdate(jobId,updates,{
        new:true,
        runValidators:true
     });

     if(!updateJob){
        return res.status(404).json({message:'Job not found'})
     }

     res.status(200).json(updatedJob)
   } catch (error) {
     res.status(500).json({message:'Error Updaating job',error:error.message});
   }
}

const getJobStatus=async(req,res)=>{
    const userId=req.user._id
    try {
        const stats=await Job.aggregate([
            {$match:{user:new mongoose.Types.ObjectId(userId)}},
            {
                $group:{
                    _id:"$status",
                    count:{$sum:1}
                }
            }
        ]);

        const formatData={};
        stats.forEach(item=>{
            formatData[item._id]=item.count;
        });
        res.status(200).json(formatData)
    } catch (error) {
        res.status(500).json({message:'Error fetching stats by status',error:error.message})
    }
}

const deleteJob=async(req,res)=>{
    const jobId=req.params.id;

    try {
        const deleteJob=await Job.findByIdAndDelete(jobId)
        if(!deleteJob){
            return res.status(401).json({message:'No Job Found'})
        }

        return res.status(200).json({message:'Job Deleted Successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Error deleting the job', error: error.message })
    }
}

const getJobByMonth=async(req,res)=>{
    const userId=req.user._id;
    try {
        const stats=await Job.aggregate([
            {$match:{user:new mongoose.Types.ObjectId(userId)}},
            {
                $group:{
                    _id:{
                        year:{$year:'$dateApplied'},
                        month:{$month:'$dateApplied'}
                    },
                    count:{$sum:1}
                }
            },
            {
                $sort:{'_id.year':-1,"_id.month":-1}
            }
        ]);

        const formatted=stats.map(item=>({
            month:`${item._id.year}-${String(item._id.month).padStart(2,'0')}`,
            count:item.count
        }));

        res.status(200).json(formatted)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats by month', error: error.message });
    }
}
export {createJob,updateJob,getJobStatus,getJobByMonth,deleteJob};