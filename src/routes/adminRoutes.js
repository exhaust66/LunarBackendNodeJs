const express = require('express');
const app=express();
const upload = require('../configs/multer');
const {uploadSingleFile,uploadMultipleFile}=require('../controllers/productUpload');
const adminLogin = require('../controllers/adminLogin'); 
const router = express.Router();

router.post('/login', adminLogin.loginAdmin); 
router.post('/singleUpload',upload.single('file'),uploadSingleFile);
router.post('/multipleUpload',upload.array('files',5),uploadMultipleFile);

app.use((err, req, res, next) => {
    console.error(err); 
    res.status(400).json({ error: err.message });
  });

module.exports = router;