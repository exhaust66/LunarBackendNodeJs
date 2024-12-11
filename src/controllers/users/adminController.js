const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/users/admin');
const Student = require('../../models/users/student');
const User = require('../../models/users/user');
const Enrollment = require('../../models/enrollment');
const Applications = require('../../models/applications');

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

//hadling get request for applications
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

module.exports = { loginAdmin,fetchApplications,handleApplicationStatus };