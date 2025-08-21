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
        try {
            validateStageDates({status:stages})
        } catch (error) {
            return res.status(400).json({message:error?.message})
        }
        const job=new Job({
            title,
            role,
            company,
            location,
            jobUrl,
            notes,
            contacts,
            status:stages,
            curr_status,
            user:req.user._id
        });
        await job.save()
        res.status(201).json(job)
    } catch (error) {
        res.status(400).json({message:'Falied to create Job',error:error.message});
    }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const {
      title,
      role,
      location,
      company,
      jobUrl,
      notes,
      contacts,
      curr_status,
      statusName,
      date,
      statusUpdates
    } = req.body;

    let job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (title !== undefined) job.title = title;
    if (role !== undefined) job.role = role;
    if (company !== undefined) job.company = company;
    if (location !== undefined) job.location = location;
    if (jobUrl !== undefined) job.jobUrl = jobUrl;
    if (notes !== undefined) job.notes = notes;
    if (contacts !== undefined) job.contacts = contacts;
    if (curr_status !== undefined) job.curr_status = curr_status;

    if (statusName && date) {
      const stage = job.status.find(s => s.name === statusName);
      if (stage) {
        stage.date = date;
      }
    }

    if (statusUpdates?.length) {
      statusUpdates.forEach(update => {
        const stage = job.status.find(s => s.name === update.name);
        if (stage) {
          stage.date = update.date;
        }
      });
    }

    validateStageDates(job);

    job.lastUpdated = new Date();
    await job.save();

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error: error.message });
  }
};

const getAllJobs=async(req,res)=>{
   const userId=req.user._id
   try {
    const jobs=await Job.find({user:userId})
    return res.status(200).json(jobs)
   } catch (error) {
     res.status(500).json({message:'Error fetching jobs',error:error.message})
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

export {createJob,updateJob,
deleteJob,getAllJobs};