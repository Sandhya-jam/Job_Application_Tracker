import mongoose from "mongoose";

const FIXED_STATUSES=['Applied','Interview','Offer','Accepted','Rejected']

//stage schema
const stageSchema=new mongoose.Schema({
    name:{type:String,required:true},
    date:{type:Date,default:null},
    note:{type:String}
},{_id:false});

const jobSchema=mongoose.Schema({
    title:{type:String,required:true},
    role:{type:String,enum:['Intern','FTE'],required:true},
    company:{type:String,required:true},
    location:{type:String,required:true},
    jobUrl:{type:String,trim:true},
    status:{type:[stageSchema],required:true},//merging list of satges
    curr_status:{type:String,required:true,default:"Applied"},
    notes:{type:String},
    contacts:[
        {
            name:String,
            email:String,
            phone:String,
            position:String,
            notes:String,
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    lastUpdated:{type:Date,default:Date.now}
},{timestamps:true});


function mergedStages(customStagesObj={},fixedStagesDates={}){
    const merged=[];

    for(let i=0;i<FIXED_STATUSES.length;i++){
        const fixed=FIXED_STATUSES[i];
        if(fixed==='Applied' && fixedStagesDates[fixed]===null){
            fixedStagesDates[fixed]=new Date
        }
        merged.push({name:fixed,date:fixedStagesDates[fixed] || null})
         
        //inserting custom stages
        if(customStagesObj && customStagesObj[fixed]){
            customStagesObj[fixed]?.forEach(cs=>{
                merged.push({
                    name:cs.name,
                    date:cs.date || null
                });
            });
        }
    }
    return merged;
}

function validateStageDates(job){
    //1.validate applied date
    const appliedStage=job.status?.find(s=>s.name==='Applied');
    if(appliedStage?.date && appliedStage.date>new Date()){
        return next(new Error("Applied date cannot be in the future."))
    }
    //Validate stage order
    for(let i=0;i<job.status?.length-1;i++){
        const curr=job.status[i]
        const nextStage=job.status[i+1]

        if(!FIXED_STATUSES.includes(nextStage.name) && nextStage.date && !curr.date){
            return next(new Error(`Cannot set date for "${nextStage.name}" before "${curr.name}" date.`));
        }

        if(curr.date && nextStage.date && curr.date>nextStage.date){
           return next(new Error(`"${nextStage.name}" date must be after "${curr.name}" date.`));
        }
    }   
}
const Job=mongoose.model('Job',jobSchema);
export {Job,mergedStages,FIXED_STATUSES,validateStageDates};