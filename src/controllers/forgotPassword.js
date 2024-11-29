
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Student = require('../models/student');

// Request OTP
const requestOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the student exists
        const student = await Student.findOne({ where: { email } });
        if (!student) {
            return res.status(404).json({ message: 'Student not found!' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the OTP for security
        const hashedOTP = await bcrypt.hash(otp, 10);

        // Store hashed OTP and expiry time in the database (e.g., in Student model)
        student.resetOtp = hashedOTP; // Add resetOtp and otpExpiry fields in the model
        student.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        await student.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use your email address
                pass: process.env.EMAIL_PASS, // Use your email password or app password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reset Password using OTP
const resetPasswordWithOTP = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Check if the student exists
        const student = await Student.findOne({ where: { email } });
        if (!student) {
            return res.status(404).json({ message: 'Student not found!' });
        }

        // Verify OTP and expiry
        if (!student.resetOtp || !student.otpExpiry || student.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        const isOTPValid = await bcrypt.compare(otp, student.resetOtp);
        if (!isOTPValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the student's password and clear OTP fields
        student.password = hashedPassword;
        student.resetOtp = null; // Clear OTP
        student.otpExpiry = null; // Clear expiry
        await student.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { requestOTP, resetPasswordWithOTP };
