const express=require('express');
const {createUser,getUsers}=require('../controllers/userController');
const router=express.Router();

router.post('/createUser',createUser);
router.get('/getUsers',getUsers);

module.exports=router;