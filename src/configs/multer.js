const multer=require('multer');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./productUploads');
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9);
        cb(null,uniqueSuffix+'-'+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(!file.mimetype.startsWith('image') && !file.mimetype.startsWith('video')){
        cb(new Error('Invalid File Format! Only Images and Videos allowed'));
    }else{
        cb(null,true);
    }
};
const upload=multer({
    storage:storage,
    limits:{fileSize:50*1024*1024},
    fileFilter:fileFilter
});

module.exports=upload;