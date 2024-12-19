const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('../../configs/sequelize');
const { Op } = require('sequelize');
const Admin = require('../../models/users/admin');
const Student = require('../../models/users/student');
const User = require('../../models/users/user');
const Enrollment = require('../../models/enrollment');
const Applications = require('../../models/applications');
const Trainer = require('../../models/users/trainer');
const { schedule } = require('node-schedule');
const Job=require('../../models/job');
const JobApplication = require('../../models/jobApplication');
const { application } = require('express');
const { Product } = require('../../models/product');
const Client = require('../../models/users/client');

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
const acceptApplication = async (req, res) => {
  try {
    const { applicationId, userId, status } = req.body;

    if (!applicationId || !status) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }
    const application = await Applications.findByPk(applicationId);

    if (!application) {
      return res.status(400).json({ success: false, message: 'Application not found!' });
    }
    //create student and enrollment when application is accepted
    if (status === 'Accepted') {
      const student = await createStudent(userId);
      const enrollment = await createEnrollment(student.id, application.programId);
      if (!enrollment || !student) {
        return res.status(500).json({ success: false, message: ' Failed to create student or enrollment!' });
      }
      application.status='Accepted';//the accepted application will remain for 24hrs
      application.save();
      //delete the application after 24hrs of being accepted
      const deletionTime = new Date(Date.now()+ 24 * 60 * 60 * 1000);
      schedule.scheduleJob(deletionTime, async()=>{
          try{
            await application.destroy();
            console.log(`Application with id ${applicationId} deleted!`);
          }catch(err){
            console.error('Error destroying Application!',err);
          }
      });
      res.status(200).json({ success: true, data: { student, enrollment } });
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
    user.verification = 'Verified';
    await user.save();

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
      include: [{
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
const fetchStudentByName = async (req, res) => {

  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Missing required field!' });
    }
    const students = await Student.findAll({
      include: {
        model: User,
        as: 'user',
        where: { name: { [Op.like]: `%${name}%` } },
        attributes: ['name', 'email', 'phone', 'address'],
      }
    });
    if (!students) {
      return res.status(400).json({ success: false, message: 'Student not found!' });
    }
    res.status(200).json({ success: true, data: students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};

//GET method to fetch all trainers
const fetchAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll({
      attributes: ['id', 'userId', 'description', 'experience', 'assignedProgram'], // Only these fields from Trainer
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'phone', 'address'],
        }
      ],
    });

    if (!trainers || trainers.length === 0) {
      return res.status(404).json({ success: false, message: "No Trainer Found" })
    }

    return res.status(200).json({ success: true, data: trainers });

  } catch (error) {
    return res.status(404).json({ success: false, message: "Cannot fetch the data" })
  }
}

//GET method to fetch student by name
const fetchTrainerByName = async (req, res) => {

  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Missing required field!' });
    }

    const trainers = await Trainer.findAll({
      attributes: ['id', 'userId', 'description', 'experience', 'assignedProgram'], // Only these fields from Trainer
      include: {
        model: User,
        as: 'user',
        where: { name: { [Op.like]: `%${name}%` } },
        attributes: ['name', 'email', 'phone', 'address'],
      }
    });
    if (!trainers || trainers.length === 0) {
      return res.status(400).json({ success: false, message: 'Trainers not found!' });
    }
    res.status(200).json({ success: true, data: trainers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};

//handling posting a job
const postJob=async (req,res)=>{
  try{
      const {title,description,salary,location,jobType,applicationDeadline}=req.body;

      if(!title || !description || !salary || !jobType || !applicationDeadline){
          return res.status(400).json({success:false,message:'Missing Required Fields!'});
      }

      const postedJob=await Job.create({
        title,
        description,
        salary,
        jobType,
        applicationDeadline,
        location,
      });

      if(!postedJob){
          return res.satus(400).json({success:false,message:'Failed to post job!'});
      }

      res.status(200).json({success:true,data:postedJob,message:'Job posted successfully!'});

  }catch(err){
    console.error(err);
    res.status(500).json({success:false,message:'Internal Server Error!'});
  }
};
//get req to fetch all job applications
const fetchJobApplications=async (req,res)=>{
  try{
      const jobApplications=await JobApplication.findAll();

      if(!jobApplications){
        return res.status(400).json({success:false,message:'No any applications found!'});
      }
      return res.status(200).json({success:true,data:jobApplications});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false,message:'Internal Server Error!'});
  }
};

//handling job applications
const handleJobApplications=async (req,res)=>{
 try{
  const {applicationId,status}=req.body;

  if(!applicationId || !status){
    return res.status(400).json({success:false,message:'Missing Required Fields!'});
  }

  const update=await Applications.update({status:status},{where:{id:applicationId}});
  
  res.status(200).json({success:true,data:update,message:'Application Accepted!'});
 }catch(err){
  console.error(err);
  res.status(500).json({success:false,message:'Internal Server Error!'});
 }
};

//create client  after package purchase
const createClient=async (req,res)=>{
  try{
    const {userId,productId,startDate,endDate,contactNo,package,renewalStatus,details}=req.body;

    if(!userId || !productId || !startDate || !endDate || !contactNo || !package || !renewalStatus || !details){
      return res.status(400).json({success:false,message:'Missing Required Fields!'});
    }

    const isUser=await User.findOne({where:{id:userId}});
    const isProduct=await Product.findOne({where:{productId:productId}});

    if(!isUser){
      return res.status(400).json({success:false,message:"User doesn't exist!"});
    }
    if(!isProduct){
      return res.status(400).json({success:false,message:"Product doesn't exist!"});
    }

    const client=await Client.create({
      userId:userId,
      productId:productId,
      startDate,
      endDate,
      contactNo,
      package,
      renewalStatus,
      details
    });

    if(!client){
      return res.status(400).json({success:false,message:'Failed to Create Client!'});
    }

    res.status(200).json({success:true,data:client,message:'Client Created Successfully!'});

  }catch(err){
    console.error(err);
    res.status(500).json({status:false,message:'Internal Server Error!'});
  }
};

//fetch All Clients
const fetchAllClients = async (req,res)=>{
  try{
    const clients=await Client.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email','address'],
      },{
    model:Product,
    as:'product',
    attributes:['productName'],
    }],
    });

    if(!clients){
      return res.status(400).json({success:false,message:'Failed to Fetch Clients!'});
    }

    res.status(200).json({success:true,data:clients,message:'Clients Fetched Successfully!'});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false,message:'Internal Server Error!'});
  }
};
//update renewal status
const updateRenewalStatus = async (req,res)=>{
  try{
    const {id,renewalStatus} = req.body;

    if(!id || !renewalStatus){
      return res.status(400).json({success:false,message:'Missing Required Fields!'});
    }

    const isClient=await Client.findByPk(id);

    if(!isClient){
      return res.status(400).json({success:false,message:"Client doesn't exist!"});
    }

    const update=await Client.update({renewalStatus:renewalStatus},{where:{id:id}});

    res.status(200).json({success:true,data:update,message:'Renewal Status Updated'});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false,message:'Internal Server Error!'});
  }
};

const editClientDetails = async (req,res)=>{
  try{
    const {clientId,contactNo,startDate,package,endDate,details}=req.body;

  if(!clientId || !contactNo || !startDate || !package || !endDate || !details){
    return res.status(400).json({success:false,message:'Missing Required Fields!'});
  }

  const [affectedRows]=await Client.update({contactNo:contactNo,startDate:startDate,package:package,endDate:endDate,details:details},{where:{id:clientId}});

  if(affectedRows===0){
    return res.status(400).json({success:false,message:'Update Failed!'});
  }

  const update=await Client.findByPk(clientId);

  
  res.status(200).json({success:true,data:update});
}
  catch(err){
    console.error(err);
    res.status(500).json({success:false,message:'Internal Server Error!'});
  }
};
module.exports = {
  loginAdmin, fetchApplications, acceptApplication, fetchAllStudents,
  fetchStudentByName, fetchAllTrainers, fetchTrainerByName,postJob,fetchJobApplications,
  handleJobApplications,createClient,updateRenewalStatus,fetchAllClients,editClientDetails
};