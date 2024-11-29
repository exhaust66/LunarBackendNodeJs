const bcrypt = require('bcryptjs');
const Admin = require('./models/admin'); 

async function seedAdmin() {
  try {
    const adminUsername = "admin"; 
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log('admin pass', adminPassword); 

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set!');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await Admin.findOne({ where: { userName: adminUsername } });

    if (!existingAdmin) {
      await Admin.create({
        userName: adminUsername,
        password: hashedPassword
      });
      console.log('Hashed password stored:', hashedPassword);
      console.log('Admin created successfully!');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message); 
  }
}

module.exports=seedAdmin;