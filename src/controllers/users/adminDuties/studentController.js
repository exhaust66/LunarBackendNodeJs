const User = require('../../../models/users/user');
const Student = require('../../../models/users/student');
const sequelize = require('../../../configs/sequelize');


//middleware for ADMIN to create student id
const checkStudentAuthenticity = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const isUser = await User.findOne({ where: { id: userId } });
        //if the ID not a userid and role not Student - "?" checks role only if isUser not undefined
        if (!(isUser?.role === 'Student')) {
            console.log("Not a Student id");//for debugging
            return res.status(500).json({ success: false, message: `Internal Error` }); // Handle errors
        }

        req.userId = isUser.id;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error); // Pass errors to error handling middleware
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
//handling status change and creating student and enrollment if accepted
// const acceptApplication = async (req, res) => {
//     try {
//         const { userId, applicationId, status } = req.params;

//         // Validate input
//         if (!userId || !applicationId || !status) {
//             return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
//         }

//         // Find the application by ID
//         const application = await Applications.findByPk(applicationId);

//         // Check if application exists
//         if (!application) {
//             return res.status(404).json({ success: false, message: 'Application not found!' });
//         }

//         // Handle 'Accepted' status
//         if (status === 'Accepted') {
//             // Create student and enrollment
//             const student = await createStudent(userId);
//             if (!student) {
//                 return res.status(500).json({ success: false, message: 'Failed to create student!' });
//             }

//             const enrollment = await createEnrollment(student.id, application.programId);
//             if (!enrollment) {
//                 return res.status(500).json({ success: false, message: 'Failed to create enrollment!' });
//             }

//             // Update the application status to "Accepted"
//             application.status = 'Accepted';
//             await application.save();

//             // Schedule application deletion after 24 hours
//             const deletionTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
//             schedule.scheduleJob(deletionTime, async () => {
//                 try {
//                     await application.destroy();
//                     console.log(`Application with id ${applicationId} deleted after 24 hours!`);
//                 } catch (err) {
//                     console.error('Error destroying application!', err);
//                 }
//             });

//             // Respond with student and enrollment data
//             res.status(200).json({
//                 success: true,
//                 message: 'Application Accepted!',
//                 data: { student, enrollment },
//             });
//         } else if (status === 'Rejected') {
//             // Handle 'Rejected' status
//             application.status = 'Rejected';
//             await application.save();

//             // Respond with rejection confirmation
//             res.status(200).json({
//                 success: true,
//                 message: 'Application Rejected!',
//             });
//         } else {
//             // Handle invalid status
//             return res.status(400).json({
//                 success: false,
//                 message: `Status '${status}' is not valid! Please provide either 'Accepted' or 'Rejected' status.`,
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: 'Internal Server Error!' });
//     }
// };

const handleApplication = async (req, res) => {
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

        if (status === 'Accepted') {
            application.status = 'Accepted';
            await application.save();

            res.status(200).json({ success: true, message: 'Application Accepted!' });
        } else if (status === 'Rejected') {
            // Handle 'Rejected' status
            application.status = 'Rejected';
            await application.save();

            // Respond with rejection confirmation
            res.status(200).json({
                success: true,
                message: 'Application Rejected!',
            });
        }
        // Schedule application deletion after  a week
        const deletionTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        schedule.scheduleJob(deletionTime, async () => {
            try {
                await application.destroy();
                console.log(`Application with id ${applicationId} deleted after 24 hours!`);
            } catch (err) {
                console.error('Error destroying application!', err);
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal Server Error!' });
    }
};
//create student and enrollment for users whose applications has been accepted
const createStudentAndEnrollment = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { applicationId, userId } = req.params;
        

        if (!userId || !applicationId) {
            return res.status(400).json({ success: false, message: 'Missing ApplicationId or UserId!' });
        }

        // Find the application by ID
        const application = await Applications.findByPk(applicationId);

        // Check if application exists
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found!' });
        }

        if (application.status !== 'Accepted') {
            return res.status(400).json({ success: false, message: 'Application must be accepted before creating student and enrollment.' });
        }
        
            const student = await createStudent(userId,{transaction:t});
            if(!student){
                await t.rollback();
                return res.status(500).json({success:false,message:'Failed To Create Student!'});
            }

            const enrollment = await createEnrollment(student.id, application.programId);

            if(!enrollment){
                await t.rollback();
                return res.status(500).json({success:false,message:'Failed To Create Enrollment!'});
            }

            await t.commit();
            res.status(201).json({
                success: true,
                message: 'Student and Enrollment Created Successfully!',
                data: { student, enrollment }
            });
    } catch (error) {
        await t.rollback();
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error!' });
    }
};


module.exports = {
    checkStudentAuthenticity, createStudent, fetchAllStudents,
    fetchStudentByName, handleApplication, createStudentAndEnrollment
};