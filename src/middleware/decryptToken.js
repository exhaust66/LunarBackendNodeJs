const jwt = require('jsonwebtoken');

//take token from the header
const auth = async (req,res,next) =>{
    const token = req.header('auth-token');

    if(!token){
        return res.status(400).json({success:false,message:"User Token required"});
    }

    try {
        // Verify the token and decrypt its payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token is valid:", decoded);
        const {id,name,email,role} = decoded;
        
        req.user = {id,name,email,role};

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'Token expired'
        })
    }

    next();
    
}
module.exports = auth;