const Applications = require('../models/applications');
const Student = require('../models/users/student');


const createApplications = async (req, res) => {
    try {
        const { userId, programId, type } = req.body;

        if (!userId || !programId || !type) {
            res.status(400).json({ Success: false, message: 'All Fields are required!' });
        }
        const applications = await Applications.create({userId,type,programId});
        console.log("I am here")
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