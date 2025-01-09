const Job = require('../../models/job');
const JobApplication = require('../../models/jobApplication');
const User=require('../../models/users/user');

// Controller to fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Retrieve all users from the database

    // Map through the users array to extract the necessary fields from each user
    const usersData = users.map(user => {
      const { id, name, email, role, phone, address, profileImage } = user;
      return { id, name, email, role, phone, address, profileImage };
    });

    return res.status(200).json({data:usersData}); // Respond with the list of users
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

//UPDATE profile by the Users Themselves
const updateUserProfile = async (req,res)=>{
  const{email,phone,address }=req.body;
  const profileImage=req.file?.filename;

  const userId = req.user.id; //  comes from middleware 

  if(!email ){
      return res.status(400).json({ success:false,message:'Email Required!'});
  }
  if(!email || !phone || !address || !profileImage ){
    console.log('Missing Required Fields!');
  }
  try {
      const user = await User.findOne({where:{id:userId}});
      if(!user){
          console.log('no User available of this id');//for logging
          return res.status(400).json({success:false,message:'Internal Error'})
      }
      user.email=email;
      user.phone = phone;
      user.address = address;
      user.profileImage=profileImage;
      //save the name of picture here
      user.save();

      return res.status(200).json({success:true,message:'Data updated Successfully'});
      
  } catch (error) {
      return res.status(400).json({
          success:false,
          message:`Some problem: ${error.message}`
      });
  }
};
//send job applications
const sendJobApplication=async (req,res)=>{
  try{
      const {jobId,userId} = req.params;
      const {contact}=req.body;
      const resume=req.file?.filename;

      if(!jobId || !userId  || !contact ){
        return res.status(400).json({success:false,message:'Missing Required Fields!'});
      }

      if(!resume){
        return res.status(400).json({succes:false,message:'Missing resume!'});
      }

      const isUser=await User.findByPk(userId);
      const isJob=await Job.findByPk(jobId);
      const didUserAlreadyApplied=await JobApplication.findAll({where:{userId:userId,jobId,jobId}});

      if(!isUser){
        return res.status(400).json({success:false,message:'User not found!'});
      }

      if(!isJob){
        return res.status(400).json({success:false,message:'Job not found!'});
      }
      if(!didUserAlreadyApplied){
        return res.status(400).json({success:false,message:'You have already applied for the job!'});
      }
  

      const sentApplication=await JobApplication.create({
        jobId,
        userId,
        contact,
        resume,
      });

      if(!sentApplication){
        return res.status(400).json({success:false,message:'Failed to send job application!'});
      }
      res.status(200).json({succes:true,data:sentApplication,message:'Job Application sent successfully!'});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false,message:'Internal Server Error!'});
  }
}

module.exports={getUsers,updateUserProfile,sendJobApplication};