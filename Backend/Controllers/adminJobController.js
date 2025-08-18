import {Job} from '../Models/jobModel.js'

export const getAllJobsAdmin=async(req,res)=>{
    try {
        const page=Math.max(parseInt(req.query.page)||1,1)
        const limit=Math.min(parseInt(req.query.limit)||20,100)
        const skip=(page-1)*limit;

        const{
            search="",
            curr_status,
            role,
            company,
            dateFrom,
            dateTo,
            sortBy='-createdAt'
        }=req.body;

        const filter={}

        if(search.trim()){
            filter.$or=[
                {title:{$regex:search,$options:'i'}},
                {company:{$regex:search,$options:'i'}},
                {location:{$regex:search,$options:'i'}}
            ];
        }
        if(curr_status && curr_status!=='All') filter.curr_status=curr_status;
        if(role && role!=='All') filter.role=role;
        if (company && company !== "All") filter.company = company;
        
        if(dateFrom || dateTo){
            filter.createdAt={};
            if(dateFrom) filter.createdAt.$gte=new Date(dateFrom);
            if(dateTo) filter.createdAt.$lte=new Date(dateTo);
        }

        const [total,jobs]=await Promise.all([
            Job.countDocuments(filter),
            Job.find(filter)
               .populate("user","username email")
               .sort(sortBy)
               .skip(skip)
               .limit(limit)   
        ]);

        return res.status(201).json({
            page,
            limit,
            total,
            pages:Math.ceil(total/limit),
            jobs
        });
    } catch (error) {
        return res.status(500).json({message:"Failed to fetch jobs",error:error.message})
    }
};

export const deleteJobAdmin=async(req,res)=>{
    try {
        const job=await Job.findById(req.params.id)
        if(!job) return res.status(404).json({message:"Job not found"})
        
        await job.deleteOne();
        return res.status(201).json({message:"Job Deleted"})
    } catch (error) {
        return res.status(500).json({message:"Failed to delete job",error:error.message})
    }
}