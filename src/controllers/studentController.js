const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');

// Register new student
const registerStudent = async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber, address, dateOfBirth } = req.body;

    try {
        // Check for missing required fields
        if (!firstName || !lastName || !email || !password || !phoneNumber || !address || !dateOfBirth) {
            return res.status(400).json({ status: 'error', message: 'Missing required fields!' });
        }

        // Check if the student with the same email already exists
        const existingStudent = await Student.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ status: 'error', message: 'Email is already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new student (resetOtp and otpExpiry fields are set to null by default)
        const newStudent = await Student.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
            dateOfBirth,
            resetOtp: null, // No OTP needed at registration
            otpExpiry: null, // No OTP expiry set at registration
        });

        // Send success response with the student details
        res.status(201).json({
            status: 'success',
            message: 'Student registered successfully',
            student: {
                id: newStudent.id,
                firstName: newStudent.firstName,
                lastName: newStudent.lastName,
                email: newStudent.email,
                phoneNumber: newStudent.phoneNumber,
                address: newStudent.address,
                dateOfBirth: newStudent.dateOfBirth,
            },
        });
    } catch (err) {
        console.error('Error registering student:', err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

// Login student
const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ where: { email } });

        if (!student) {
            return res.status(404).json({ status: 'error', message: 'Student not found!' });
        }

        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials!' });
        }

        // Create JWT token
        const token = jwt.sign({ id: student.id, email: student.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',  // Token expiration time
        });

        res.status(200).json({
            status: 'success',
            message: 'Login successful!',
            token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error!' });
    }
};

module.exports = { registerStudent, loginStudent };