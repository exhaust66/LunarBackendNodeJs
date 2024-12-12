const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('../../configs/sequelize');
const {Op}=require('sequelize');
const Admin = require('../../models/users/admin');
const Student = require('../../models/users/student');
const User = require('../../models/users/user');
const Enrollment = require('../../models/enrollment');
const Applications = require('../../models/applications');
const Trainer = require('../../models/users/trainer');


const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log('Request received - Username:', username, 'Password:', password);

  try {
    const admin = await Admin.findOne({ where: { name: username } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: 'admin@gmail.com', role: 'Admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Admin Token:", token); //consoling the user token

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//handling get request for applications
const fetchApplications = async (req, res) => {
  try {
    const applications = await Applications.findAll();
    if (!applications) {
      res.status(400).json({ success: false, message: 'No Applications Found!' });
    }
    res.status(200).json({ success: true, data: applications });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'Failed', message: 'Internal Server Error', });
  }
};

//handling status change and creating student and enrollment if accepted
const handleApplicationStatus = async (req, res) => {
  try {
    const { applicationId, userId,status } = req.body;

    if (!applicationId || !status) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }
    const application = await Applications.findByPk(applicationId);

    if (!application) {
      res.status(400).json({ success: false, message: 'Application not found!' });
    }
    application.status = status;
    await application.save();

    if (status === 'Accepted') {
      const student = await createStudent(userId);
      const enrollment = await createEnrollment(student.id,application.programId);

      res.status(200).json({ status: 'Success', data: { student, enrollment } });
    }


  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};
//function to create student--is called when application is accepted
async function createStudent(userId) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found!');
    }

    const student = await Student.create({
      userId: userId,
      certificates: null,
    });

    return student;  // Return student data instead of using res
  } catch (err) {
    console.log(err);
    throw new Error('Internal Server Error!');
  }
};
//function to create enrollment--is called when application is accepted
async function createEnrollment(studentId, programId) {
  try {
    const student = await Student.findByPk(studentId);

    if (!student) {
      throw new Error(`Student not found with studentID ${studentId}`);
    }

    const enrollment = await Enrollment.create({
      studentId: student.id,
      programId: programId,
      enrolledAt: new Date(),
      status: 'Active',
      certificateIssued: false,
      completionDate: null,
    });

    return enrollment;  // Return enrollment data instead of using res
  } catch (err) {
    console.log(err);
    throw new Error('Internal Server Error!');
  }
};

//GET method to fetch all students
const fetchAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include:[{
        model: User, 
        as: 'user', 
        attributes: ['name', 'email', 'phone', 'address'], 
    },],
    });

    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, message: 'No students found!' });
    }

    res.status(200).json({
      success: true,
      message: 'Fetched all students.',
      data: students,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};

//GET method to fetch student by name
const fetchStudentByName=async (req,res)=>{
  
  try{
  const {name}=req.body;
     if(!name){
      return res.status(400).json({success:false,message:'Missing required field!'});
     }
    const students=await Student.findAll({
      include:{
          model:User,
          as:'user',
          where: { name: { [Op.like]: `%${name}%` } },
          attributes:['name','email','phone','address'],
    }});
    if(!students){
      return res.status(400).json({success:false,message:'Student not found!'});
    }
    res.status(200).json({success:true,data:students});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false,message:'Internal Server Error!'});
  }
};

//GET method to fetch all trainers
const fetchAllTrainers = async (req,res) =>{
  try {
      const trainers = await Trainer.findAll({
          attributes: ['id', 'userId', 'description', 'experience', 'assignedProgram'], // Only these fields from Trainer
          include:[
              {
                  model: User, 
                  as: 'user', 
                  attributes: ['name', 'email', 'phone', 'address'], 
              }
          ],
      });

      if(!trainers || trainers.length === 0){
          return res.status(404).json({success:false,message:"No Trainer Found"})
      }
      
      return res.status(200).json({success:true,data:trainers});

  } catch (error) {
      return res.status(404).json({success:false,message:"Cannot fetch the data"})
  }
}

//GET method to fetch student by name
const fetchTrainerByName=async (req,res)=>{
  
  try{
    const {name}=req.body;
     if(!name){
      return res.status(400).json({success:false,message:'Missing required field!'});
     }

    const trainers=await Trainer.findAll({
      attributes: ['id', 'userId', 'description', 'experience', 'assignedProgram'], // Only these fields from Trainer
      include:{
          model:User,
          as:'user',
          where: { name: { [Op.like]: `%${name}%` } },
          attributes:['name','email','phone','address'],
    }});
    if(!trainers || trainers.length ===0){
      return res.status(400).json({success:false,message:'Trainers not found!'});
    }
    res.status(200).json({success:true,data:trainers});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false,message:'Internal Server Error!'});
  }
};
module.exports = { loginAdmin,fetchApplications,handleApplicationStatus,fetchAllStudents ,
                    fetchStudentByName ,fetchAllTrainers,fetchTrainerByName};