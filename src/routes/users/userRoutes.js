const express=require('express');
const router=express.Router();
//middlewares
const auth = require('../../middleware/decryptToken');
const {isTrainer} = require('../../middleware/checkRole');
const upload = require('../../configs/multer');

//required imports
const {createApplications}=require('../../controllers/users/userController');
const {checkTrainerAuthenticity,updateTrainerProfile } = require('../../controllers/users/adminDuties/trainerController');
const {updateUserProfile,sendJobApplication} = require('../../controllers/users/userController');


//update the contents from any users related to their profile
router.post('/updateUserProfile',[auth],upload.single('file'),updateUserProfile);

//trainer - to add experience and description
router.post('/updateTrainerProfile',[auth,isTrainer],checkTrainerAuthenticity,updateTrainerProfile);

//sending application
//routes for applications
router.post('/postApplication/:userId/:programId',createApplications);

//router for job application
router.post('/sendJobApplication/:userId/:jobId',upload.single('file'),sendJobApplication);

module.exports=router;