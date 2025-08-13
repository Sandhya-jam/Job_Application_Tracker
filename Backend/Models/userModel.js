import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    joined:{
        type:Date,
        default:Date.now()
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        required:true
    },
    bio:{
        type:String,
    },
    location:{
        type:String,
    }
},{timestamps:true});

const User=mongoose.model('User',userSchema)

export default User;