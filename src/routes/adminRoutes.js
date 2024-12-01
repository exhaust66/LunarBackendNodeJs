const express = require('express');
const upload = require('../configs/multer');

const {loginAdmin} = require('../controllers/adminController'); 
const {uploadSingleFile,uploadMultipleFile}=require('../controllers/productUpload');
const { checkTrainerAuthenticity,createTrainer,assignTraining } = require('../controllers/trainerController');

const app=express();
const router = express.Router();

router.post('/login', loginAdmin); 
router.post('/singleUpload',upload.single('file'),uploadSingleFile);
router.post('/multipleUpload',upload.array('files',5),uploadMultipleFile);

//handling other users
router.post('/createTrainer',checkTrainerAuthenticity,createTrainer)
router.post('/assignTraining',checkTrainerAuthenticity,assignTraining);

app.use((err, req, res, next) => {
    console.error(err); 
    res.status(400).json({ error: err.message });
  });

module.exports = router;