const Trainer =require('../../models/users/trainer');
const User = require('../../models/users/user');

//middleware for ADMIN to create Trainer id
const checkTrainerAuthenticity = async(req,res,next) =>{
    try {
        const {userId} = req.body;

        if(!userId){
            return res.status(400).json({message:'All fields are required!'});
        }

        const isUser = await User.findOne({where:{id:userId}});
        //if the ID not a userid and role not trainer - "?" checks role only if isUser not undefined
        if(!(isUser?.role === 'Trainer')){
            console.log("Not a trainer id");//for debugging
            return res.status(500).json({success:false, message: `Internal Error`}); // Handle errors
        }
        
        
        req.userId = isUser.id;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error); // Pass errors to error handling middleware
    }
}
//ADMIN accepts the trainer request by verifying and creating new trainer
const createTrainer = async (req,res)=>{
    try {
        const userId = req.userId; // userId comes from middleware  --checkTrainerAuthenticity--

        //check if trainer already exists
        const trainer = await Trainer.findOne({where:{userId}});
        if (trainer){
            return res.status(200).json({success:false,message:'User is already a Trainer'});
        }

        //creating new trainer
        const newTrainer = await Trainer.create({userId});

        if(!newTrainer){
            return res.status(400).json({success:false, message: 'New Trainer creation failed!'})
        }

        //changing the status of user at users table to verified
        const user = await User.findOne({where:{id:userId}});
        user.verification = 'Verified';
        user.save();

        return res.status(201).json({
            success:true,
            message:'New Trainer created successfully!'
        });

    } catch (error) {
        return res.status(500).json({ message: `Error: ${error}`}); // Handle errors
    }
}

//ADMIN assigns the training to the trainer
const assignProgram = async (req,res)=>{
    const {programId,trainerId } = req.body;
    // const trainerId = req.trainerId; // trainerId comes from middleware  --checkTrainerAuthenticity--

    console.log("Trainer Id:",trainerId);
    console.log("Program Id:",programId);
    if(!programId || !trainerId ){
        return res.status(400).json({success:false,message:'Missing required Fields !'});
    }

    try {
        //check if trainer exists
        const trainer = await Trainer.findOne({where:{id:trainerId}});

        if(!trainer){
            return res.status(400).json({success:false,message:'User is not a trainer'});
        }

        //parsing the avaliable assignedTraining JSON
        let availableTrainingIds = JSON.parse(trainer.assignedTraining || []); 

        if(availableTrainingIds.includes(trainingId)){ 
            return res.status(400).json({success:false,message:'This training is already assigned'});
        }

        availableTrainingIds.push(trainingId);
        trainer.assignedTraining = availableTrainingIds;
        await trainer.save(); //save the changes to the database

        return res.status(200).json({
            success:true,
            message: 'Training assigned successfully.',
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:`Some problem: ${error}`
        });
    }
}

//UPDATE profile by the TRAINER ITSELF
const updateTrainerProfile = async (req,res)=>{
    const{description,experience}=req.body;
    const userId = req.userId; // userId comes from middleware  --checkTrainerAuthenticity--

    if(!userId || !description || !experience){
        return res.status(400).json({ success:false,message:'All fields are required'});
    }
    try {
        const trainer = await Trainer.findOne({where:{userId}});
        if(!trainer){
            console.log('no trainer available of this id');//for logging
            return res.status(400).json({success:false,message:'Internal Error'})
        }

        trainer.description = description;
        trainer.experience = experience;
        trainer.save();

        return res.status(200).json({success:true,message:'Data updated Successfully'});
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:`Some problem: ${error.message}`
        });
    }
}

module.exports = {
    checkTrainerAuthenticity,
    createTrainer,
    assignProgram,
    updateTrainerProfile
}