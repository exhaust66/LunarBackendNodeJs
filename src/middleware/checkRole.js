const isAdmin = async(req,res,next) => {
    if(!req.user.role.includes('Admin')){
        return res.status(400).json({
            success:false,
            message:"Access Denied !!"
        })
    }
    next();
}

const isClient = async(req,res,next) => {
    if(!req.user.role.includes('Client')){
        return res.status(400).json({
            success:false,
            message:"Access Denied !!"
        })
    }
    next();
}
const isStudent = async(req,res,next) => {
    if(!req.user.role.includes('Student')){
        return res.status(400).json({
            success:false,
            message:"Access Denied !!"
        })
    }
    next();
}
const isTrainer = async(req,res,next) => {
    if(!req.user.role.includes('Trainer')){
        return res.status(400).json({
            success:false,
            message:"Access Denied !!"
        })
    }
    next();
}

module.exports ={isAdmin,isTrainer,isClient,isStudent};