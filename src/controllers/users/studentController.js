const User=require('../../models/users/user');
const Student= require('../../models/users/student');

//middleware for ADMIN to create student id
const checkStudentAuthenticity = async(req,res,next) =>{
    try {
        const {userId} = req.body; 
  
        if(!userId){
            return res.status(400).json({message:'All fields are required!'});
        }
  
        const isUser = await User.findOne({where:{id:userId}});
        //if the ID not a userid and role not Student - "?" checks role only if isUser not undefined
        if(!(isUser?.role === 'Student')){
            console.log("Not a Student id");//for debugging
            return res.status(500).json({success:false, message: `Internal Error`}); // Handle errors
        }

        req.userId = isUser.id;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error); // Pass errors to error handling middleware
    }
}

//ADMIN accepts the student request by verifying and creating new student
const createStudent = async (req,res)=>{
    try {
        const userId = req.userId; // comes from middleware --checkStudentAuthenticity

        //check if student already exists
        const student = await Student.findOne({where:{userId}});
        if (student){
            return res.status(200).json({success:false,message:'User is already a Student'});
        }

        //creating new student
        const newStudent = await Student.create({userId});

        if(!newStudent){
            return res.status(400).json({success:false, message: 'New Student creation failed!'})
        }

        //changing the status of user at users table to verified
        const user = await User.findOne({where:{id:userId}});
        user.verification = 'Verified';
        user.save();

        return res.status(201).json({
            success:true,
            message:'New Student created successfully!'
        });

    } catch (error) {
        return res.status(500).json({ message: `Error: ${error}`}); // Handle errors
    }
}
    


module.exports = {checkStudentAuthenticity,createStudent};