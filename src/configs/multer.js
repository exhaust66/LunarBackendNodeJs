const multer=require('multer');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        let folder='src/uploads/productUploads';

        if(req.body.category){
            folder=`./src/uploads/${req.body.category}`;
        }
        // Create folder if it doesn't exist
        require('fs').mkdirSync(folder, { recursive: true });

        cb(null, folder);
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9);
        cb(null,uniqueSuffix+'-'+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(!file.mimetype.startsWith('image')
         && !file.mimetype.startsWith('video')
         && !file.mimetype.startsWith('application/pdf')){
        cb(new Error('Invalid File Format! Only Images, Videos and Pdf allowed'));
    }else{
        cb(null,true);
    }
};
const upload=multer({
    storage:storage,
    limits:{fileSize:50*1024*1024},//50 mb
    fileFilter:fileFilter
});

module.exports=upload;