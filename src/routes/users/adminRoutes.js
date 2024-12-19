const express = require('express');
const upload = require('../../configs/multer');
// middlewares
const auth = require('../../middleware/decryptToken');
const {isAdmin} = require('../../middleware/checkRole');

const {loginAdmin,fetchApplications,fetchAllStudents ,fetchStudentByName, fetchTrainerByName, fetchAllTrainers, acceptApplication,postJob,fetchJobApplications} = require('../../controllers/users/adminController');
const {createClient,fetchAllClients,handleJobApplications,editClientDetails,updateRenewalStatus}= require('../../controllers/users/adminController'); 
const {uploadSingleFile,uploadMultipleFile}=require('../../controllers/productUpload');
const { checkTrainerAuthenticity,createTrainer,assignProgram } = require('../../controllers/users/trainerController');
const { checkStudentAuthenticity, createStudent } = require('../../controllers/users/studentController');
const {getUsers}=require('../../controllers/users/userController');
const { createProgram } = require('../../controllers/programController'); 


const app=express();
const router = express.Router();

router.post('/login', loginAdmin); 
router.post('/fetchApplications', fetchApplications); 
router.post('/handleApplicationStatus', acceptApplication); 
router.post('/singleUpload',upload.single('file'),uploadSingleFile);
router.post('/multipleUpload',upload.array('files',5),uploadMultipleFile);

//HANDLING OTHER USERS ----------------------------------------------------------
//for Trainer
router.post('/createTrainer',[auth,isAdmin],checkTrainerAuthenticity,createTrainer)
router.post('/assignProgram',[auth,isAdmin],assignProgram);
//For Student
router.post('/createStudent',[auth,isAdmin],checkStudentAuthenticity,createStudent)

//for programs
//get all users details
router.get('/getUsers',[auth,isAdmin],getUsers);
router.post('/programs', createProgram);

//fetch students
router.get('/fetchAllStudents', fetchAllStudents); 
router.get('/fetchStudentByName', fetchStudentByName); 

//fetch trainer
router.get('/fetchAllTrainers',fetchAllTrainers);
router.get('/fetchTrainerByName',fetchTrainerByName);

//job
router.post('/postJob',postJob);
router.get('/fetchJobApplications',fetchJobApplications);
router.post('/handleJobApplication',handleJobApplications);

//  client
router.post('/createClient',createClient);
router.post('/updateRenewalStatus',updateRenewalStatus);
router.get('/fetchAllClients',fetchAllClients);
router.post('/editClientDetails',editClientDetails);

app.use((err, req, res, next) => {
    console.error(err); 
    res.status(400).json({ error: err.message });
  });

module.exports = router;