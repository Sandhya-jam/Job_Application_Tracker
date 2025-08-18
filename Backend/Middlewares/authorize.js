import asyncHandler from "./asyncHandler.js";

export const authorize=asyncHandler(async(req,res,next)=>{
    try {
        if(req.user && req.user.isAdmin) return next();
        return res.status(403).json({message:"Not authorized as Admin"});
    } catch (error) {
        return res.status(500).json({message:"Admin Check failed",error:error.message})
    }
});