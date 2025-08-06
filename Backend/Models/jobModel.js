import mongoose from "mongoose";

const jobSchema=mongoose.Schema({
    title:{
       type:String,
       required:true
    },
    role:{
        type:String,
        enum:[
            'Intern',
            'FTE'
        ],
        required:true,
    },company:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },jobUrl:{
        type:String,
        trim:true
    },status:{
        type:String,
        enum:[
            'Wishlist',
            'Applied',
            'Interviewing',
            'Offered',
            'Rejected',
            'Accepted',
            'Declined',
            'Archieved'
        ],
        default:'Wishlist'
    },
    dateApplied:{
        type:Date,
        default:Date.now
    },lastUpdated:{
        type:Date,
        default:Date.now
    },
    notes:{
        type:String
    },
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
    }
},{timestamps:true});

const Job=mongoose.model('Job',jobSchema);
export default Job;