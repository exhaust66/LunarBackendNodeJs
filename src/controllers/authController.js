const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users/user');

// Register new User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // Extract name and email from the request body
    
        //if any became true, whole statement became true and execute
        if(!name || !email || !password || !role){
          return res.status(400).json({message:"All fields are required!!"});
        }

        //if any became false, whole statement became false and ignore
        if(!role.includes('Student') && !role.includes('Trainer') && !role.includes('Client') ){ 
          console.log("Invalid role spelling"); //for debugging
          return res.status(500).json({message:"Internal Error !"});
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
        await User.create({
           name,
           email,
           password:hashedPassword,
           role
        }); 
    
        return res.status(201).json({
            success:true,
            message: 'New user created successfully!!'
        }); 
    } catch (err) {
    return res.status(500).json({success:false, message: 'New user creation unsucessfull!!'}); // Handle errors
    }
};

// Login User
const loginUser = async (req, res) => {    
    try {
        const {password} = req.body;
        const user = await User.findOne({ where: { email :req.body.email} });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid Credentials!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials!' });
        }

        // Create JWT token
        const {id,name,email,role} = user;
        
        const token = jwt.sign({ 
                id,name,email,role 
            }, process.env.JWT_SECRET, {expiresIn: '1d'} //1 day expiryDate
        ); 

        res.status(200).json({
            success: true,
            message: 'Login successfull !',
            token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
};

module.exports = { registerUser, loginUser };