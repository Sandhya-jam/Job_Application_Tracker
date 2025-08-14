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
            fixedStagesDates[fixed]=new Date().now();
        }
        merged.push({name:fixed,date:fixedStagesDates[fixed]? new Date(fixedStagesDates[fixed]):null})
         
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

function validateStageDates(job) {
    const parseDate = (d) => (d ? new Date(d) : null);
    const today = new Date();

    const appliedStage = job.status?.find(s => s.name === 'Applied');
    const appliedDate = parseDate(appliedStage?.date);

    if (appliedDate && appliedDate > today) {
        throw new Error("Applied date cannot be in the future.");
    }

    for (let i = 0; i < job.status?.length - 1; i++) {
        const curr = job.status[i];
        const nextStage = job.status[i + 1];

        const currDate = parseDate(curr.date);
        const nextDate = parseDate(nextStage.date);

        if (!FIXED_STATUSES.includes(nextStage.name) && nextDate && !currDate) {
            throw new Error(`Cannot set date for "${nextStage.name}" before "${curr.name}" date.`);
        }

        if (currDate && nextDate && currDate > nextDate) {
            throw new Error(`"${nextStage.name}" date must be after "${curr.name}" date.`);
        }
    }
}


const Job=mongoose.model('Job',jobSchema);
export {Job,mergedStages,FIXED_STATUSES,validateStageDates};