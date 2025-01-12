const Employee = require('../../../models/users/employee');

const createEmployee = async (req, res) => {
    try {
      const { name, position, dateOfHire, salary, type, arrivalTime, departureTime } = req.body;
  
      if (!name || !dateOfHire || !type) {
        return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
      }
  
      // const isUser = await User.findByPk(userId);
  
      // if (!isUser) {
      //   return res.status(400).json({ success: false, message: 'User Not Found!' });
      // }
  
      const createdEmployee = await Employee.create({
        name,
        position,
        dateOfHire,
        salary,
        type,
        arrivalTime,
        departureTime,
      });
  
      if (!createdEmployee) {
        return res.status(400).json({ success: false, message: 'Failed To Create Employee!' });
      }
  
      return res.status(200).json({ success: true, message: 'Employee Created Successful!', data: createdEmployee });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error!' });
    }
  };
  //fetch All Employees
const fetchAllEmployees = async (req, res) => {
    try {
      const employees = await Employee.findAll(
      //   {
      //   include: [{
      //     model: User,
      //     as: 'user',
      //     attributes: ['name', 'email', 'address'],
      //   }]
      // }
    );
  
      if (!employees) {
        return res.status(400).json({ success: false, message: 'Failed To Fetch Employees!' });
      }
  
      res.status(200).json({ success: true, data: employees });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error!' });
    }
  };
  
  //edit employee details
const editEmployeeDetails = async (req, res) => {
    try {
      const {  position, dateOfHire, salary, type, arrivalTime, departureTime } = req.body;
      const {id} = req.params;
  
      if (!id || !position || !dateOfHire || !salary || !type || !arrivalTime || !departureTime) {
        return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
      }
  
      const [affectedRows] = await Employee.update({ position: position, dateOfHire: dateOfHire, salary: salary, type: type, arrivalTime: arrivalTime, departureTime: departureTime }, { where: { id } });
  
      if (affectedRows === 0) {
        return res.status(400).json({ success: false, message: 'Failed To Update!' });
      }
      const update = await Employee.findByPk(id);
  
      if (!update) {
        return res.status(400).json({ success: false, message: 'Failed To Find Employee!' });
      }
  
      res.status(200).json({ success: true, data: update, message: 'Updated Employee Details' });
  
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error!' });
    }
  };
  
  //delete a employee
const deleteEmployee = async (req, res)=>{
  
      try{
          
      const {id} = req.params;
  
      if(!id){
          return res.status(400).json({success:false,message:'Employee Id Required'});
      }
      const employee = await Employee.findByPk(id);
  
      if(!employee){
          return res.status(404).json({success:false,message:'Cannot Find Employee!'});
      }
  
      await employee.destroy();
  
      res.status(200).json({success:true,message:'Employee Deleted Successfully!'});
      }catch(err){
          res.status(500).json({success:false,message:'Internal Server Error!'});
      }
  };

  module.exports = {createEmployee, fetchAllEmployees, editEmployeeDetails, deleteEmployee};