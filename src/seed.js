const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('./models/users/admin'); 

async function seedAdmin() {
  try {
    const adminUsername = process.env.ADMIN_USERNAME; 
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set!');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await Admin.findOne({ where: { name: adminUsername } });

    if (!existingAdmin) {
      const admin = await Admin.create({
        name: adminUsername,
        password: hashedPassword
      });

      const {id,name} = admin;
      const token = jwt.sign({ id,name,email:'admin@gmail.com',role:'Admin' }, process.env.JWT_SECRET,{ expiresIn: '365d' }); 
      
      
      console.log("Admin Token:",token); //consoling the user token

      console.log('Admin created successfully!');
      
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message); 
  }
}

module.exports=seedAdmin;