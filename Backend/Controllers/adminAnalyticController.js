import { Job } from "../Models/jobModel.js";
import User from "../Models/userModel.js";

export const getAdminStats=async(req,res)=>{
    try {
        //users and jobs
        const [totalUsers,totalJobs]=await Promise.all([
            User.countDocuments({}),
            Job.countDocuments({}),
        ]);

        //jobs by curr status
        const byCurrStatus=await Job.aggregate([
            {$group:{_id:"$curr_status",count:{$sum:1}}},
            {$project:{_id:0,status:"$_id",count:1}},//Renames the _id field into status.
            {$sort:{count:-1}}
        ]);

        //Jobs by role
        const byRole=await Job.aggregate([
            {$group:{_id:'$role',count:{$sum:1}}},
            {$project:{_id:0,role:"$_id",count:1}},
            {$sort:{count:-1}}
        ]);

        //New Jobs last 7 days
        const now=new Date()
        const sevenDaysAgo=new Date(now)
        sevenDaysAgo.setDate(now.getDate()-6); //including today

        const last7days=await Job.aggregate([
            {$match:{createdAt:{$gte:new Date(sevenDaysAgo.setHours(0,0,0,0))}}},
            {
                $group:{
                    _id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},
                    count:{$sum:1},
                }
            },
            {$project:{_id:0,day:"$_id",count:1}},
            {$sort:{day:1}}
        ]);

        return res.status(201).json({
            totals:{users:totalUsers,jobs:totalJobs},
            byCurrStatus,
            byRole,
            last7days
        })
    } catch (error) {
        return res.status(500).json({message:"Failed to get admin Stats",error:error.message})
    }
}

export const getJobsByMonth=async(req,res)=>{
    try {
        const data=await Job.aggregate([
            {
                $group:{
                    _id:{$dateToString:{format:"%Y-%m",date:'$createdAt'}},
                    count:{$sum:1},
                }
            },
            {$project:{_id:0,month:'$_id',count:1}},
            {$sort:{month:1}},
        ]);
        return res.status(201).json(data)
    } catch (error) {
        return res.json(500).json({message:"Failed to get jobs by month",error:error.message})
    }
};

const getStageDate=(stages,stageName)=>{
    const s=stages?.find((x)=>x.name===stageName && x.date);
    return s?new Date(s.date) : null;
}

export const getConversionsRates=async(req,res)=>{
    try {
        const jobs=await Job.find({}).select("status curr_status")

        const pairs=[
            {from:"Applied",to:"Interview"},
            {from:"Interview",to:"Offer"},
            {from:"Offer",to:"Rejected"},
        ];

        const result=[];

        pairs.forEach(({from,to})=>{
            let totalFrom=0;
            let reachedTo=0;

            jobs.forEach((job)=>{
                const fromDate=getStageDate(job.status,from);
                const toDate=getStageDate(job.status,to);
                const currSdate=getStageDate(job.status,job.curr_status)

                if(fromDate && toDate){
                    if(currSdate && fromDate<=currSdate){
                        totalFrom+=1;
                        if(toDate<=currSdate) reachedTo+=1;
                    }
                }
            });

            result.push({
                from,
                to,
                totalFrom,
                reachedTo,
                conversionRate:totalFrom?(reachedTo/totalFrom)*100:0
            })
        });

        return res.status(201).json({conversions:result});
    } catch (error) {
        return res.status(500).json({message:"Failed to get conversion Rates",error:error.message})
    }
}

export const getAvgDaysPairs=async(req,res)=>{
    try {
        const jobs=await Job.find({}).select("status");

        const pairs = [
            { from: "Applied", to: "Interview" },
            { from: "Applied", to: "Offer" },
            { from: "Applied", to: "Rejected" },
            { from: "Interview", to: "Offer" },
            { from: "Interview", to: "Rejected" },
        ];

        const result=[];

        pairs.forEach(({from,to})=>{
            let totalDays=0;
            let count=0;

            jobs.forEach((job)=>{
                const fromDate=getStageDate(job.status,from)
                const toDate=getStageDate(job.status,to)
                if(fromDate && toDate && toDate>=fromDate){
                    const diffDays=Math.ceil((toDate-fromDate)/(1000*60*60*24))
                    totalDays+=diffDays
                    count+=1
                }
            });

            result.push({
                from,
                to,
                jobsConsidered:count,
                averageDays:count?Math.ceil(totalDays/count) : null,
            });
        })

        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({message:"Failed to compute avg days",error:error.message});
    }
}