const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('../../../configs/sequelize');
const { Op } = require('sequelize');
const Admin = require('../../../models/users/admin');
const Program = require('../../../models/program');
const Student = require('../../../models/users/student');
const User = require('../../../models/users/user');
const Enrollment = require('../../../models/enrollment');
const Applications = require('../../../models/applications');
const Trainer = require('../../../models/users/trainer');
const schedule = require('node-schedule');
const Job = require('../../../models/job');
const JobApplication = require('../../../models/jobApplication');
const { Product } = require('../../../models/product');
const Client = require('../../../models/users/client');
const Employee = require('../../../models/users/employee');

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
    const applications = await Applications.findAll({
      include: [
        {
          model: User, 
          as: 'user',  
          attributes: ['id','name'],  
        },
        {
          model: Program,
          as:'program',  
          attributes: ['title'], 
        },
      ],
      attributes: { exclude: ['userId', 'programId'] },  // Exclude userId and programId from the Application model
    });
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
    const { userId, applicationId, status } = req.params;

    // Validate input
    if (!userId || !applicationId || !status) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }

    // Find the application by ID
    const application = await Applications.findByPk(applicationId);

    // Check if application exists
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found!' });
    }

    // Handle 'Accepted' status
    if (status === 'Accepted') {
      // Create student and enrollment
      const student = await createStudent(userId);
      if (!student) {
        return res.status(500).json({ success: false, message: 'Failed to create student!' });
      }

      const enrollment = await createEnrollment(student.id, application.programId);
      if (!enrollment) {
        return res.status(500).json({ success: false, message: 'Failed to create enrollment!' });
      }

      // Update the application status to "Accepted"
      application.status = 'Accepted';
      await application.save();

      // Schedule application deletion after 24 hours
      const deletionTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      schedule.scheduleJob(deletionTime, async () => {
        try {
          await application.destroy();
          console.log(`Application with id ${applicationId} deleted after 24 hours!`);
        } catch (err) {
          console.error('Error destroying application!', err);
        }
      });

      // Respond with student and enrollment data
      res.status(200).json({
        success: true,
        message: 'Application Accepted!',
        data: { student, enrollment },
      });
    } else if (status === 'Rejected') {
      // Handle 'Rejected' status
      application.status = 'Rejected';
      await application.save();

      // Respond with rejection confirmation
      res.status(200).json({
        success: true,
        message: 'Application Rejected!',
      });
    } else {
      // Handle invalid status
      return res.status(400).json({
        success: false,
        message: `Status '${status}' is not valid! Please provide either 'Accepted' or 'Rejected' status.`,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error!' });
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
const postJob = async (req, res) => {
  try {
    const { title, description, salary, location, jobType, applicationDeadline } = req.body;

    if (!title || !description || !salary || !jobType || !applicationDeadline) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }

    const postedJob = await Job.create({
      title,
      description,
      salary,
      jobType,
      applicationDeadline,
      location,
    });

    if (!postedJob) {
      return res.satus(400).json({ success: false, message: 'Failed to post job!' });
    }

    res.status(200).json({ success: true, data: postedJob, message: 'Job posted successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};
//get req to fetch all job applications
const fetchJobApplications = async (req, res) => {
  try {
    const jobApplications = await JobApplication.findAll({
      include: [
        {
          model: User,
          as:'users',
          attributes: ['name', 'email'], // Include only the username and email fields
        },
      ],
    });

    // Check if jobApplications is an empty array
    if (jobApplications.length === 0) {
      console.log("Empty Job Applications");
      return res.status(404).json({ success: false, message: 'No applications found!' });
    }

    return res.status(200).json({ success: true, data: jobApplications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};


//handling job applications
const handleJobApplications = async (req, res) => {
  try {
    const {  status } = req.body;
    const {applicationId} = req.params;

    if (!applicationId || !status) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }

    const update = await Applications.update({ status: status }, { where: { id: applicationId } });
    if(status==="Accepted"){
      return res.status(200).json({ success: true, data: update, message: 'Application Accepted!' });
    }
    if(status==="Rejected"){
      res.status(200).json({ success: true, data: update, message: 'Application Rejected!' });
      }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};


const createEmployee = async (req, res) => {
  try {
    const { name, position, dateOfHire, salary, type, arrivalTime, departureTime } = req.body;

    if (!name || !dateOfHire || !type) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }

    // const isUser = await User.findByPk(userId);

    // if (!isUser) {
    //   return res.status(400).json({ success: false, message: 'User Not Found!' });
    // }

    const createdEmployee = await Employee.create({
      name,
      position,
      dateOfHire,
      salary,
      type,
      arrivalTime,
      departureTime,
    });

    if (!createdEmployee) {
      return res.status(400).json({ success: false, message: 'Failed To Create Employee!' });
    }

    return res.status(200).json({ success: true, message: 'Employee Created Successful!', data: createdEmployee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};
//fetch All Employees
const fetchAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll(
    //   {
    //   include: [{
    //     model: User,
    //     as: 'user',
    //     attributes: ['name', 'email', 'address'],
    //   }]
    // }
  );

    if (!employees) {
      return res.status(400).json({ success: false, message: 'Failed To Fetch Employees!' });
    }

    res.status(200).json({ success: true, data: employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};

//edit employee details
const editEmployeeDetails = async (req, res) => {
  try {
    const {  position, dateOfHire, salary, type, arrivalTime, departureTime } = req.body;
    const {employeeId} = req.params;

    if ( !position || !dateOfHire || !salary || !type || !arrivalTime || !departureTime) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }

    const [affectedRows] = await Employee.update({ position: position, dateOfHire: dateOfHire, salary: salary, type: type, arrivalTime: arrivalTime, departureTime: departureTime }, { where: { id: employeeId } });

    if (affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Failed To Update!' });
    }
    const update = await Employee.findByPk(employeeId);

    if (!update) {
      return res.status(400).json({ success: false, message: 'Failed To Find Employee!' });
    }

    res.status(200).json({ success: true, data: update, message: 'Updated Employee Details' });

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};

//delete a employee
const deleteEmployee = async (req, res)=>{

    try{
        
    const {id} = req.params;

    if(!id){
        return res.status(400).json({success:false,message:'Employee Id Required'});
    }
    const employee = await Employee.findByPk(id);

    if(!employee){
        return res.status(404).json({success:false,message:'Cannot Find Employee!'});
    }

    await employee.destroy();

    res.status(200).json({success:true,message:'Employee Deleted Successfully!'});
    }catch(err){
        res.status(500).json({success:false,message:'Internal Server Error!'});
    }
};
module.exports = {
  loginAdmin, fetchApplications, acceptApplication, fetchAllStudents,
  fetchStudentByName, fetchAllTrainers, fetchTrainerByName, postJob, fetchJobApplications,
  handleJobApplications
};