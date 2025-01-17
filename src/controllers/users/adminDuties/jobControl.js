const JobApplication = require('../../../models/jobApplication');
const User = require('../../../models/users/user');
const Job = require('../../../models/job');
const schedule = require('node-schedule');

//handling posting a job
const postJob = async (req, res) => {
  try {
    const { title, description, salary, location, jobType, applicationDeadline } = req.body;

    if (!title || !description || !salary || !jobType || !applicationDeadline) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }

    const postedJob = await Job.create({
      title,
      description,
      salary,
      jobType,
      applicationDeadline,
      location,
    });

    if (!postedJob) {
      return res.status(400).json({ success: false, message: 'Failed to post job!' });
    }

    res.status(200).json({ success: true, data: postedJob, message: 'Job posted successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};

//edit job
const editJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, salary, location, jobType, applicationDeadline } = req.body;
    console.log(id);
    if (!id || !description || !salary || !location || !jobType || !applicationDeadline) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Couldn't Find Job!" });
    }

    const [affectedRows] = await Job.update({ title: title, description: description, salary: salary, location: location, jobType: jobType, applicationDeadline: applicationDeadline }, { where: { id } });

    if (affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Update Failed!' });
    }

    const update = await Job.findByPk(id);

    if (!update) {
      return res.status(400).json({ success: false, message: 'Failed To Find Employee!' });
    }

    res.status(200).json({ success: true, data: update, message: 'Job Updated Successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};
//fetch ALl jobs
const fetchAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();

    if (!jobs) {
      return res.status(404).json({ success: false, message: 'No Jobs Found!' });
    }

    res.status(200).json({ success: true, message: 'Jobs Fetched Successfully!', data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing JobId' });
    }

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Couldn't Find Job!" });
    }
    await job.destroy();

    res.status(200).json({ success: true, message: 'Job Deleted Successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
}
//get req to fetch all job applications
const fetchJobApplications = async (req, res) => {
  try {
    const jobApplications = await JobApplication.findAll({
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['name', 'email'], // Include only the username and email fields
        },
      ],
    });

    // Check if jobApplications is an empty array
    if (jobApplications.length === 0) {
      console.log("Empty Job Applications");
      return res.status(404).json({ success: false, message: 'No applications found!' });
    }

    return res.status(200).json({ success: true, data: jobApplications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};


//handling job applications
const handleJobApplications = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;

    if (!applicationId || !status) {
      return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
    }

    // Validate status
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value!' });
    }

    const application = await JobApplication.findByPk(applicationId);
    if (!application) {
      return res.status(400).json({ success: false, message: 'Job Application Not Found!' });
    }

    // Update application status
    await JobApplication.update({ status }, { where: { id: applicationId } });
    const updatedApplication = await JobApplication.findByPk(applicationId);

    // Schedule deletion after 24 hours
    const deletionTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Prevent duplicate jobs (optional: store and manage jobs in a global variable or DB)
    schedule.scheduleJob(deletionTime, async () => {
      try {
        await updatedApplication.destroy();
        console.log(`Application with id ${applicationId} deleted after 24 hours!`);
      } catch (err) {
        console.error('Error destroying application!', err);
      }
    });

    // Return response
    if (status === 'Accepted') {
      return res.status(200).json({ success: true, data: updatedApplication, message: 'Application Accepted!' });
    }
    return res.status(200).json({ success: true, data: updatedApplication, message: 'Application Rejected!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};

module.exports = {
  postJob, fetchJobApplications,
  handleJobApplications, fetchAllJobs, editJob, deleteJob
};