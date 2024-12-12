const express=require('express');
const upload = require('../configs/multer');
const router=express.Router();


const {registerUser, loginUser} = require('../controllers/authController');
const { requestOTP, resetPasswordWithOTP } = require('../controllers/forgotPassword');


//auth users
router.post('/register',registerUser);
router.post('/login', loginUser);

//request otps---------------
router.post('/forgot-password/request-otp', requestOTP);
// Route for resetting password using OTP
router.post('/forgot-password/reset', resetPasswordWithOTP);


module.exports = router;