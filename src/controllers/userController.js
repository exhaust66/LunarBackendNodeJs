const User=require('../models/user');

// Controller to fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Retrieve all users from the database

    // Map through the users array to extract the necessary fields from each user
    const usersData = users.map(user => {
      const { id, name, email, role, phone, address, profileImage } = user;
      return { id, name, email, role, phone, address, profileImage };
    });

    return res.status(200).json({usersData}); // Respond with the list of users
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

//UPDATE profile by the Users Themselves
const updateUserProfile = async (req,res)=>{
  const{phone,address}=req.body;
  const userId = req.user.id; //  comes from middleware 

  if(!phone || !address ){
      return res.status(400).json({ success:false,message:'All fields are required'});
  }
  try {
      const user = await User.findOne({where:{id:userId}});
      if(!user){
          console.log('no User available of this id');//for logging
          return res.status(400).json({success:false,message:'Internal Error'})
      }

      user.phone = phone;
      user.address = address;
      user.save();

      return res.status(200).json({success:true,message:'Data updated Successfully'});
      
  } catch (error) {
      return res.status(400).json({
          success:false,
          message:`Some problem: ${error.message}`
      });
  }
}

module.exports={getUsers,updateUserProfile};