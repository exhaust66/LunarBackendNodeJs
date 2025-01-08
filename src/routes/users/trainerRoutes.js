const express = require('express');
const app=express();
const router = express.Router();
const { fetchEnrollmentsByProgramId,postAttendance,getAttendance}=require('../../controllers/attendanceController');

router.get('/fetchEnrollmentsByProgramID',fetchEnrollmentsByProgramId);
router.post('/postAttendance',postAttendance);
router.get('/getAttendance',getAttendance);

module.exports=router;