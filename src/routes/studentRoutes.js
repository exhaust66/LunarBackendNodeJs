const express = require('express');
const { registerStudent, loginStudent } = require('../controllers/studentController'); // Import controller functions
const { requestOTP, resetPasswordWithOTP } = require('../controllers/forgotPassword');
const router = express.Router();

// POST route to register a new student
router.post('/register', registerStudent);

// POST route for student login
router.post('/login', loginStudent);


// Route for requesting OTP
router.post('/forgot-password/request-otp', requestOTP);

// Route for resetting password using OTP
router.post('/forgot-password/reset', resetPasswordWithOTP);

module.exports = router;