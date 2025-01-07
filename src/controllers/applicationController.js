const Applications = require('../models/applications');
const Student = require('../models/users/student');


const createApplications = async (req, res) => {
    try {
        const { userId, programId } = req.params;
        const type = 'Trainings';
        if (!userId || !programId) {
            return res.status(400).json({ Success: false, message: 'Missing UserId or ProgramId!' });
        }
        const applications = await Applications.create({userId,type,programId});
    
        res.status(200).json({
            success: true,
            message: 'Application Submitted Successfully!',
            data: applications
        });
    } catch (err) {
        console.error(err);
    }
}




module.exports={createApplications};