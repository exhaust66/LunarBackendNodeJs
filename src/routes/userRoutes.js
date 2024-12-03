const express=require('express');
const router=express.Router();
//middlewares
const auth = require('../middleware/decryptToken');
const {isTrainer} = require('../middleware/checkRole');

//required imports
const {registerUser, loginUser} = require('../controllers/authController');
const { requestOTP, resetPasswordWithOTP } = require('../controllers/forgotPassword');
const {checkTrainerAuthenticity,updateTrainerProfile } = require('../controllers/trainerController');
const {updateUserProfile} = require('../controllers/userController');


//auth users
router.post('/register', registerUser);
router.post('/login', loginUser);

//request otps---------------
router.post('/forgot-password/request-otp', requestOTP);
// Route for resetting password using OTP
router.post('/forgot-password/reset', resetPasswordWithOTP);

//update the contents from users to their profile
router.post('/updateUserProfile',[auth],updateUserProfile);

//trainer - to add experience and description
router.post('/updateTrainerProfile',[auth,isTrainer],checkTrainerAuthenticity,updateTrainerProfile);

module.exports=router;