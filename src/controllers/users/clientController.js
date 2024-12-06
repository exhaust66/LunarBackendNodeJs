const Client =require('../../models/users/client');
const User = require('../../models/users/user');

//middleware for ADMIN to create CLient id
const checkClientAuthenticity = async(req,res,next) =>{
    try {
        const {userId} = req.body;

        if(!userId){
            return res.status(400).json({message:'All fields are required!'});
        }

        const isUser = await User.findOne({where:{id:userId}});
        //if the ID not a userid and role not Client - "?" checks role only if isUser not undefined
        if(!(isUser?.role === 'Client')){
            console.log("Not a Client id");//for debugging
            return res.status(500).json({success:false, message: `Internal Error`}); // Handle errors
        }

        
        req.userId = isUser.id;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error); // Pass errors to error handling middleware
    }
}

//ADMIN accepts the Client request by verifying and creating new Client
const createClient = async (req,res)=>{
    try {
        const userId = req.userId; // userId comes from middleware  --checkClientAuthenticity--

        //check if Client already exists
        const client = await Client.findOne({where:{userId}});
        if (client){
            return res.status(200).json({success:false,message:'User is already a Client'});
        }

        //creating new Client
        const newClient = await Client.create({userId});

        if(!newClient){
            return res.status(400).json({success:false, message: 'New Client creation failed!'})
        }

        //changing the status of user at users table to verified
        const user = await User.findOne({where:{id:userId}});
        user.verification = 'Verified';
        user.save();

        return res.status(201).json({
            success:true,
            message:'New Client created successfully!'
        });

    } catch (error) {
        return res.status(500).json({success:false, message: `Error: ${error}`}); // Handle errors
    }
}

module.exports = {checkClientAuthenticity,createClient};