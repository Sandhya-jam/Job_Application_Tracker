import User from "../Models/userModel.js";

export const getAllUsers=async(req,res)=>{
    try {
        const page=Math.max(parseInt(req.query.page) || 1,1);
        const limit=Math.min(parseInt(req.query.limit)||20,100);
        const skip=(page-1)*limit;
        const search=(req.query.search || "").trim();

        const filter=search ?{
            $or:[
                {username:{$regex:search,$options:"i"}},
                {email:{$regex:search,$options:"i"}},
            ],
        }:{};
        
        const [total,users]=await Promise.all([
            User.countDocuments(filter),
            User.find(filter)
                .select('-password')
                .sort({createdAt:-1})
                .skip(skip)
                .limit(limit)
        ]);

        res.status(200).json({
            page,
            limit,
            total,
            pages:Math.ceil(total/limit),
            users
        });
    } catch (error) {
        res.status(500).json({message:"Failed to fetch users",error:error.message})
    };
}

export const getUserById=async(req,res)=>{
    try {
        const ExistUser=await User.findById(req.params.id).select('-password')
        if(!ExistUser) return res.status(404).json({message:"User not found"})
        res.json(ExistUser);
    } catch (error) {
        return res.status(500).json({message:"Failed to fetch user",error:error.message})
    }
};

export const updateUser=async(req,res)=>{
    try {
        const updates={};
        ["username","email","isAdmin"].forEach((k)=>{
            if(req.body[k]!=undefined) updates[k]=req.body[k];
        });

        const updated=await User.findByIdAndUpdate(req.params.id,updates,{
            new:true,
            runValidators:true,
            select:'-password',
        });
        
        if(!updated) return res.status(404).json({message:'Usernot found'});
        res.json(updated)
    } catch (error) {
        res.status(500).json({message:"Failed to update user",error:error.message})
    }
};

export const deleteUser=async(req,res)=>{
    try {
        if(String(req.user._id)===String(req.params.id)){
            return res.status(400).json({message:"Admins Cannot delete themselves"})
        }
        const u=await User.findById(req.params.id);
        if(!u) return res.status(404).json({message:"User not found"})
        if(u.isAdmin) return res.status(400).json({message:"Cannot delete Admin"})
        
        await u.deleteOne();
        return res.status(201).json({message:"User Deleted"})
    } catch (error) {
        return res.status(500).json({message:"Failed to delete User",error:error.message})
    }
}