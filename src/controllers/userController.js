const User=require('../models/user');
const bcrypt=require('bcryptjs');

const  createUser = async (req, res) => {
    try {
      const { name, email, password, role } = req.body; // Extract name and email from the request body
  
      if(!name || !email || !password || !role){
        return res.status(400).json({message:"All fields are required!!"});
      }
  
      //checking if user email already exists
      const alreadyExists = await User.findOne({where:{email}});
      if(alreadyExists ){
        return res.status(400).json({message:'User email already exists!!'})
      }
  
      //hashing password
      const saltRounds = 10; // Number of salt rounds
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      //creating new user
      const newUser = await User.create({
         name,
         email,
         password:hashedPassword,
         role
      }); 
  
      //if 
      return res.status(201).json({
        message:`New user ${name} created successfully`,
          user:{
            id:newUser.id,
            name:newUser.name,
            email:newUser.email,
            role:newUser.role
        }
      }); 
    } catch (err) {
      return res.status(500).json({ message: 'New user is not created'}); // Handle errors
    }
  };
  
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

  module.exports={createUser,getUsers};