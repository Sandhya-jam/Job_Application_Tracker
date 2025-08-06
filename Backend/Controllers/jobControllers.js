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

export {createJob};