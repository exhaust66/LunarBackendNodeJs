const Applications = require('../models/applications');
const User = require('../models/users/user');
const Program = require('../models/program');


//handling get request for applications
const fetchApplications = async (req, res) => {
  try {
    const applications = await Applications.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Program,
          as: 'program',
          attributes: ['title'],
        },
      ],
      attributes: { exclude: ['userId', 'programId'] },  // Exclude userId and programId from the Application model
    });
    if (!applications) {
      res.status(400).json({ success: false, message: 'No Applications Found!' });
    }
    res.status(200).json({ success: true, data: applications });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'Failed', message: 'Internal Server Error', });
  }
};





module.exports = { fetchApplications};