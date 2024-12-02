const express=require('express');
const {createUser,getUsers}=require('../controllers/userController');
const {checkTrainerAuthenticity,updateTrainerProfile } = require('../controllers/trainerController');
const router=express.Router();

router.post('/createUser',createUser);
router.get('/getUsers',getUsers);

//trainer
router.post('/updateTrainerProfile',checkTrainerAuthenticity,updateTrainerProfile);

module.exports=router;