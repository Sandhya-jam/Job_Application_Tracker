import mongoose from "mongoose";
import { Job } from "../Models/jobModel.js";

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

const avgTimeBtwnStages=async(req,res)=>{
    try {
      const {from,to}=req.body;

      if(!from||!to){
         return res.status(400).json({message:"Provide correct stages"})
      }

      const jobs=await Job.find({
        user:req.user._id,
        status:{
            $all:[
                {$elemMatch:{name:from,date:{$ne:null}}},
                {$elemMatch:{name:to,date:{$ne:null}}}
            ]
        }
      });
      
      let totalDays=0;
      let count=0;
      jobs.forEach(job=>{
        const fromDate=job.status.find(s=>s.name===from)?.date;
        const toDate=job.status.find(s=>s.name===to)?.date;

        if(fromDate && toDate && toDate>=fromDate){
            const diffDays=Math.ceil((toDate-fromDate)/(1000*60*60*24));
            totalDays+=diffDays;
            count++;
        }
      });

      const averageDays=count>0 ? Math.ceil(totalDays/count):null;
      return res.status(201).json({
        user:req.user._id,
        fromStage:from,
        toStage:to,
        averageDays,
        jobsConsidered:count
      });
    } catch (error) {
        return res.status(500).json({message:"Error calculating average time"});
    }
};

const getConversionRate=async(req,res)=>{
    try {
        const {from,to}=req.body;

        if(!from || !to){
            return res.status(400).json({message:'Provide correct stages'})
        }

        const jobs=await Job.find({
            user:req.user._id,
            status:{$elemMatch: {name:from,date:{$ne:null}}}
        })

        let totalFrom=0,conversions=0;

        jobs.forEach(job=>{
            const fromStage=job.status.find(s=>s.name===from)
            const toStage=job.status.find(s=>s.name===to)
            const currStage=job.status.find(s=>s.name===job.curr_status)

            if(fromStage?.date && toStage?.date){
                if(fromStage?.date && currStage?.date && fromStage.date<=currStage.date){
                    totalFrom++;
                    if(toStage?.date && currStage?.date && toStage.date<=currStage.date){
                        conversions++;
                    }
               }
            }
        });

        const conversionRate=totalFrom>0 ? (conversions/totalFrom)*100 : null;

        return res.status(200).json({
            user:req.user._id,
            fromStage:from,
            toStage:to,
            totalFrom,
            conversions,
            conversionRate
        });
    } catch (error) {
        return res.status(500).json({
            message:"Error calculating conversion rate",
            error:error.message
        });
    }
};

export {getJobByMonth,getJobStatus,avgTimeBtwnStages,getConversionRate};