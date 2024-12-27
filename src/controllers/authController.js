const bcrypt = require('bcryptjs');
const upload = require('../configs/multer');
const jwt = require('jsonwebtoken');
const User = require('../models/users/user');

// Register new User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // Extract name and email from the request body
    
        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(422).json({ success: false, message: "All fields are required!" });
        }

        // Validate role against allowed values
        const allowedRoles = ["Student", "Trainer", "Client"];
        if (!allowedRoles.includes(role)) {
            console.error("Invalid role provided:", role); 
            return res.status(422).json({ success: false, message: "Invalid role! Must be Student, Trainer, or Client." });
        }
        //checking if user email already exists
        const alreadyExists = await User.findOne({where:{email}});
        if(alreadyExists ){
          return res.status(409).json({message:'User email already exists!!'})
        }
    
        //hashing password
        const saltRounds = 10; // Number of salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        //creating new user
        await User.create({
           name,
           email,
           password:hashedPassword,
           role,
        }); 
    
        return res.status(201).json({
            success:true,
            message: 'New user created successfully!!'
        }); 
    } catch (err) {
        console.error('Error Creating User!',err);
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
            }, process.env.JWT_SECRET,  //1 day expiryDate
        ); 

        res.status(200).json({
            success: true,
            message: 'Login successfull !',
            token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false,data:user, message: 'Internal server error!' });
    }
};

module.exports = { registerUser, loginUser };