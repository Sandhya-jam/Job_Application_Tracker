import mongoose from 'mongoose';
import {Job,FIXED_STATUSES,mergedStages,validateStageDates} from '../Models/jobModel.js'
import { insertCustomStages } from '../Utils/StagesUpdate.js';
const createJob=async(req,res)=>{
    try {
        const{
            title,
            role,
            company,
            location,
            jobUrl,
            notes,
            contacts,
            fixedStageDates,
            customStages,
            curr_status,
        }=req.body

        const stages=mergedStages(customStages,fixedStageDates);
        validateStageDates(stages);

        const exist=stages?.findIndex(s=>s.name===curr_status);
        if(exist==-1) return res.status(401).json({message:'error in curr status'});
    
        const job=new Job({
            title,
            role,
            company,
            location,
            jobUrl,
            notes,
            contacts,
            status:stages,
            user:req.user._id
        });
        await job.save()
        res.status(201).json(job)
    } catch (error) {
        res.status(400).json({message:'Falied to create Job',error:error.message});
    }
};

const updateJob=async(req,res)=>{
    try {
        const jobId=req.params.id;

        const{
            title,
            role,
            location,
            company,
            jobUrl,
            notes,
            contacts,
            fixedStageDates,
            customStages,
            curr_status
        }=req.body

        let job=await Job.findById(jobId)
        if(!job) return res.status(404).json({message:'Job not found'});

        if (title !== undefined) job.title = title;
        if (role !== undefined) job.role = role;
        if (company !== undefined) job.company = company;
        if (location !== undefined) job.location = location;
        if (jobUrl !== undefined) job.jobUrl = jobUrl;
        if (notes !== undefined) job.notes = notes;
        if (contacts !== undefined) job.contacts = contacts;
        if (curr_status !== undefined) job.curr_status = curr_status;

        //update fixed state dates
        if (fixedStageDates) {
            for (let stage of job.status) {
                if (fixedStageDates[stage.name] !== undefined) {
                stage.date = fixedStageDates[stage.name];
                }
            }
        }
        
        if (customStages) {
           job.status = insertCustomStages(job.status, customStages);
        }

        validateStageDates(job.status)

        job.lastUpdated=new Date()
        await job.save()

        res.status(200).json(job);
        
    } catch (error) {
        res.status(500).json({ message: "Error updating job", error: error.message });
    }
}

const getAllJobs=async(req,res)=>{
   const userId=req.user._id
   try {
    const jobs=await Job.find({user:userId})
    return res.status(200).json(jobs)
   } catch (error) {
     res.status(500).json({message:'Error fetching jobs',error:error.message})
   }
}

const getJobStatus=async(req,res)=>{
    const userId=req.user._id
    try {
        const stats=await Job.aggregate([
            {$match:{user:new mongoose.Types.ObjectId(userId)}},
            {
                $group:{
                    _id:"$curr_status",
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
            {
                $match:{
                    user:new mongoose.Types.ObjectId(userId),
                }
            },
            {
                $addFields: {
                    firstStatusDate: { $arrayElemAt: ["$status.date", 0] }
                }
            },
            {
                $group:{
                    _id:{
                        year:{$year:'$firstStatusDate'},
                        month:{$month:'$firstStatusDate'}
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
export {createJob,updateJob,getJobStatus,getJobByMonth,
deleteJob,getAllJobs};