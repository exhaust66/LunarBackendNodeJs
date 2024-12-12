const Attendance = require('../models/attendance');
const Enrollment = require('../models/enrollment');
const Student = require('../models/users/student');
const User = require('../models/users/user');

//function to get enrollments by ProgramId
const getEnrollmentsByProgramId = async (programId) => {
    try {
        const enrollments = await Enrollment.findAll({
            where: { programId },
            include: [
                {
                    model: Student,
                    attributes: ['id'],
                    include: [
                        {
                            model: User,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
        });

        return enrollments;

    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch enrollments'); 
    }
};

//get handler that is used to fetch enrollments of particual program with its programId
const fetchEnrollmentsOfProgram = async (req, res) => {
    const { programId } = req.body;

    if (!programId) {
        return res.status(400).json({ status: 'Failed', message: 'Required Program Id' });
    }

    try {
        const enrollments = await getEnrollmentsByProgramId(programId);

        if (!enrollments || enrollments.length === 0) {
            return res.status(404).json({ status: 'Failed', message: 'No enrollments found in the Program!' });
        }

        return res.status(200).json({ status: 'Success', data: enrollments });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 'Failed', message: 'Internal Server Error!' });
    }
};

//recording attendance ----handling POST request for attendance
const postAttendance = async (req, res) => {
    try {
        const { programId, attendanceRecords } = req.body;

        if (!programId || !attendanceRecords || !Array.isArray(attendanceRecords)) {
            return res.status(400).json({ status: 'Failed', message: 'Missing or Invalid Fields!' });
        }

        const enrollments = await getEnrollmentsByProgramId(programId);

        if (!enrollments || enrollments.length === 0) {
            return res.status(404).json({ status: 'Failed', message: 'No enrollments found for the given Program!' });
        }

        const attendanceData = [];
        attendanceRecords.forEach((record) => {
            const matchedEnrollment = enrollments.find(
                (enrollment) => enrollment.id === record.enrollmentId
            );

            if (matchedEnrollment) {
                attendanceData.push({
                    enrollmentId: matchedEnrollment.id,
                    date: record.date,
                    status: record.status,
                    programId:record.programId
                });
            }
        });

        if (attendanceData.length === 0) {
            return res.status(400).json({ status: 'Failed', message: 'No matching enrollments found for attendance records!' });
        }

        await Attendance.bulkCreate(attendanceData);

        return res.status(200).json({ status: 'Success', data: attendanceData });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 'Failed', message: 'Internal Server Error!' });
    }
};


// Get attendance by ProgramId
const getAttendance = async (req, res) => {
    try {
        const { programId } = req.body;

        if (!programId) {
            return res.status(400).json({ status: 'Failed', message: 'Required ProgramId' });
        }

        const attendanceRecords = await Attendance.findAll({ where: { programId } });

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ status: 'Failed', message: 'No attendance records found for the given Program' });
        }

        return res.status(200).json({ status: 'Success', data: attendanceRecords });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 'Failed', message: 'Internal Server Error!' });
    }
};



module.exports = { fetchEnrollmentsOfProgram,postAttendance,getAttendance};
