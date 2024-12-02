const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Otp = require('../models/otp');
const User = require('../models/user');

// Request OTP
const requestOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if student exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Generate OTP and hash it
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Set OTP expiry (10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Store OTP in the Otp table
        await Otp.create({
            userId: user.id,
            resetOtp: hashedOtp,
            otpExpiry: expiresAt,
        });

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to email.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Reset Password with OTP
const resetPasswordWithOTP = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Check if student exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Fetch OTP record from Otp table
        const otpRecord = await Otp.findOne({ where: { userId: user.id } });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP. Please request a new one.' });
        }
        
        //delete otp from otps table if expired otp is requested
        if (otpRecord.otpExpiry < Date.now()) {
            await Otp.destroy({ where: { userId: user.id } });
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }
        
        // Verify OTP
        const isOtpValid = await bcrypt.compare(otp, otpRecord.resetOtp);
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Hash and update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Delete OTP record after successful use
        await Otp.destroy({ where: { userId: user.id } });

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { requestOTP, resetPasswordWithOTP };
