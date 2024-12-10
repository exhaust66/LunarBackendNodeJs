const express = require('express');
const router = express.Router();
const {recordAttendance,getAttendanceByEnrollment}=require('../../controllers/attendanceController');
//middlewares
const auth = require('../../middleware/decryptToken');
const {isStudent} = require('../../middleware/checkRole');
router.post('attendance/postAttendance',recordAttendance);
router.get('attendance/getAttendanceById/:enrollmentId',getAttendanceByEnrollment);

module.exports = router;