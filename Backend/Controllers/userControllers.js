import asyncHandler from "../Middlewares/asyncHandler.js";
import bycrypt from 'bcryptjs'
import User from "../Models/userModel.js"
import createToken from '../Utils/createToken.js'

const createUser=asyncHandler(async(req,res)=>{
    const {username,email,password,role,bio,location}=req.body;

    if(!username || !email || !password || !role){
        throw new Error('Please Fill all fields')
    }

    const userExists=await User.findOne({email})
    if(userExists) res.status(400).send("User Already exists")
    
    const salt=await bycrypt.genSalt(10)
    const hashPass=await bycrypt.hash(password,salt)

    const newUser=new User({username,email,password:hashPass,role,joined:Date.now(),bio,location})

    try {
        await newUser.save()
        createToken(res,newUser._id)
        res.status(200).json({_id:newUser._id,
            username:newUser.username,
            email:newUser.email,
            role:newUser.role,
            joined:newUser.joined,
            bio:newUser.bio,
            location:newUser.location
        })
    } catch (error) {
      res.status(400)
      throw new Error('Invalid user data')   
    } 
});

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body

    if(!email || !password){
        throw new Error("Please fill all inputs")
    }

    const existingUser=await User.findOne({email})
    if(existingUser){
        const isPassValid=await bycrypt.compare(password,existingUser.password)

        if(isPassValid){
            createToken(res,existingUser._id)

            res.status(200).json({_id:existingUser._id,
                username:existingUser.username,
                email:existingUser.email,
                isAdmin:existingUser.isAdmin,
                role:existingUser.role,
                joined:existingUser.joined,
                bio:existingUser.bio,
                location:existingUser.location
            })

            return;
        }else{
            throw new Error("Incorrect email or password")
        }
    }else{
        throw new Error("Incorrect email or password")
    }
})

const logoutUser=asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({message:"Logged Out Successfully"})
})

const getProfile=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id)
    if(user){
        res.json({
            _id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
            joined:user.joined,
            bio:user.bio,
            location:user.location
        })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

const updateProfile=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id)

    if(user){
        user.username=req.body.username || user.username
        user.email=req.body.email || user.email
        user.role=req.body.role || user.role
        user.bio=req.body.bio || user.bio
        user.location=req.body.location || user.location
        if(req.body.password){
            const salt=await bycrypt.genSalt(10)
            const hashPass=await bycrypt.hash(req.body.password,salt)
            user.password=hashPass
        }

        const updatedUser=await user.save();

        res.json({
            _id:updatedUser._id,
            username:updatedUser.username,
            email:updatedUser.email,
            role:updatedUser.role,
            bio:updatedUser.bio,
            location:updatedUser.location
        });
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

export {createUser,loginUser,logoutUser,getProfile,updateProfile}
