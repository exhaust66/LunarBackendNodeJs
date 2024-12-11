const Program = require('../models/program'); // Adjust the path to match your project structure

// Controller to create a new program
const createProgram = async (req, res) => {
    try {
        const { title, description, type, startDate, endDate } = req.body;

        // Validation to ensure required fields are provided
        if (!title || !type || !startDate) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Title, Type, and Start Date are required!',
            });
        }

        // Validate type against ENUM values
        if (!["Training", "Internship"].includes(type)) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid type! Allowed values: "Training", "Internship".',
            });
        }

        // Create the program
        const program = await Program.create({
            title,
            description,
            type,
            startDate,
            endDate,
        });

        return res.status(201).json({
            status: 'Success',
            message: 'Program created successfully!',
            data: program,
        });
    } catch (err) {
        console.error('Error creating program:', err);
        return res.status(500).json({
            status: 'Failed',
            message: 'Internal Server Error!',
        });
    }
};

module.exports = { createProgram };
