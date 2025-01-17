const express = require('express');
const upload = require('../../configs/multer');
// middlewares
const auth = require('../../middleware/decryptToken');
const {isAdmin} = require('../../middleware/checkRole');

const {loginAdmin,  } = require('../../controllers/users/adminDuties/adminController');
const {postJob,editJob,fetchJobApplications,handleJobApplications,fetchAllJobs,deleteJob} = require('../../controllers/users/adminDuties/jobControl');
const { acceptApplication,fetchApplications} = require('../../controllers/applicationController');
const {createEmployee,fetchAllEmployees,editEmployeeDetails,deleteEmployee}= require('../../controllers/users/adminDuties/employeeControl'); 
const {uploadSingleFile,uploadMultipleFile}=require('../../controllers/productUpload');
const { checkTrainerAuthenticity,createTrainer,assignProgram,fetchTrainerByName, fetchAllTrainers } = require('../../controllers/users/adminDuties/trainerController');
const { checkStudentAuthenticity, createStudent,fetchAllStudents ,fetchStudentByName } = require('../../controllers/users/adminDuties/studentController');
const {getUsers}=require('../../controllers/users/userController');
const { createProgram } = require('../../controllers/programController'); 
const {createClient,fetchAllClients,editClientDetails,updateRenewalStatus,deleteClient} = require('../../controllers/users/adminDuties/clientControl');


const app=express();
const router = express.Router();

router.post('/login', loginAdmin); 
router.get('/fetchApplications', [auth,isAdmin],fetchApplications); 
router.put('/handleApplicationStatus/:userId/:applicationId/:status',[auth,isAdmin], acceptApplication); 
router.post('/singleUpload',[auth,isAdmin],upload.single('file'),uploadSingleFile);
router.post('/multipleUpload',[auth,isAdmin],upload.array('files',5),uploadMultipleFile);

//HANDLING OTHER USERS ----------------------------------------------------------
//for Trainer
router.post('/createTrainer',[auth,isAdmin],checkTrainerAuthenticity,createTrainer)
router.post('/assignProgram',[auth,isAdmin],assignProgram);
//For Student
router.post('/createStudent',[auth,isAdmin],checkStudentAuthenticity,createStudent)

//for programs
//get all users details
router.get('/getUsers',[auth,isAdmin],getUsers);
router.post('/programs', [auth,isAdmin],createProgram);

//fetch students
router.get('/fetchAllStudents',[auth,isAdmin], fetchAllStudents); 
router.get('/fetchStudentByName',[auth,isAdmin], fetchStudentByName); 

//fetch trainer
router.get('/fetchAllTrainers',[auth,isAdmin],fetchAllTrainers);
router.get('/fetchTrainerByName',[auth,isAdmin],fetchTrainerByName);

//job
router.put('/updateJob/:id',[auth,isAdmin],editJob);
router.delete('/deleteJob/:id',[auth,isAdmin],deleteJob);
router.post('/postJob',[auth,isAdmin],postJob);
router.get('/fetchJobApplications',[auth,isAdmin],fetchJobApplications);
router.get('/fetchAllJobs',[auth,isAdmin],fetchAllJobs);
router.put('/handleJobApplication/:applicationId',[auth,isAdmin],handleJobApplications);

//  client
router.post('/createClient',[auth,isAdmin],createClient);
router.delete('/deleteClient/:id',[auth,isAdmin],deleteClient);
router.put('/updateRenewalStatus',[auth,isAdmin],updateRenewalStatus);
router.get('/fetchAllClients',[auth,isAdmin],fetchAllClients);
router.put('/editClientDetails/:id',[auth,isAdmin],editClientDetails);

//employees
router.post('/createEmployee',[auth,isAdmin],createEmployee);
router.get('/fetchAllEmployees',[auth,isAdmin],fetchAllEmployees);
router.delete('/deleteEmployee/:id',[auth,isAdmin],deleteEmployee);
router.put('/editEmployeeDetails/:id',[auth,isAdmin],editEmployeeDetails);

app.use((err, req, res, next) => {
    console.error(err); 
    res.status(400).json({ error: err.message });
  });

module.exports = router;