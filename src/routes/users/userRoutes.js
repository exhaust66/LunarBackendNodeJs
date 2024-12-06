const express=require('express');
const router=express.Router();
//middlewares
const auth = require('../../middleware/decryptToken');
const {isTrainer} = require('../../middleware/checkRole');
const upload = require('../../configs/multer');

//required imports
const {checkTrainerAuthenticity,updateTrainerProfile } = require('../../controllers/users/trainerController');
const {updateUserProfile} = require('../../controllers/users/userController');


//update the contents from any users related to their profile
router.post('/updateUserProfile',[auth],upload.single('file'),updateUserProfile);

//trainer - to add experience and description
router.post('/updateTrainerProfile',[auth,isTrainer],checkTrainerAuthenticity,updateTrainerProfile);

module.exports=router;