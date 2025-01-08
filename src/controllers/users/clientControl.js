//new  methods for clients here...
//client methods from adminController will be transferred here...

const Client = require('../../models/users/client');
const { Op } = require('sequelize');
const cron = require('node-cron');
//create client  after package purchase
const createClient = async (req, res) => {
    try {
      const { name, product, startDate, endDate, contactNo, package, renewalStatus, details } = req.body;
  
      if (!name || !product || !startDate || !endDate || !contactNo || !package || !renewalStatus || !details) {
        return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
      }
      const client = await Client.create({
        name,
        product,
        startDate,
        endDate,
        contactNo,
        package,
        renewalStatus,
        details
      });
  
      if (!client) {
        return res.status(400).json({ success: false, message: 'Failed to Create Client!' });
      }
  
      res.status(201).json({ success: true, data: client, message: 'Client Created Successfully!' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: 'Internal Server Error!' });
    }
  };
  
  //fetch All Clients
const fetchAllClients = async (req, res) => {
    try {
      const clients = await Client.findAll();
  
      if (!clients) {
        return res.status(400).json({ success: false, message: 'Failed to Fetch Clients!' });
      }
  
      res.status(200).json({ success: true, data: clients, message: 'Clients Fetched Successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error!' });
    }
  };
  //update renewal status
const updateRenewalStatus = async (req, res) => {
    try {console.log('Checking for expired subscriptions at', new Date());

      // Fetch clients whose subscription has expired (endDate is less than the current date)
      const expiredClients = await Client.findAll({
        where: {
          endDate: { [Op.lt]: new Date() }, // endDate is less than the current date
          renewalStatus: { [Op.ne]: 'expired' }, // renewalStatus is not already 'expired'
        },
      });
  
      // If expired clients are found, update their renewal status to 'expired'
      if (expiredClients.length > 0) {
        const clientIds = expiredClients.map(client => client.id);
  
        await Client.update(
          { renewalStatus: 'expired' },
          { where: { id: clientIds } }
        );
  
        console.log(`Updated ${expiredClients.length} expired subscriptions.`);
      } else {
        console.log('No expired subscriptions found.');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error!' });
    }
  };

  cron.schedule('0 * * * *', updateRenewalStatus);
  
const editClientDetails = async (req, res) => {
    try {
      const { name, product, contactNo, startDate, package, endDate, details } = req.body;
      const {id} = req.params;
  
      if ( !id) {
        return res.status(400).json({ success: false, message: 'Missing Client Id!' });
      }
  
      if (!name || !product || !contactNo || !startDate || !package || !endDate || !details) {
        return res.status(400).json({ success: false, message: 'Missing Required Fields!' });
      }
  
      const [affectedRows] = await Client.update({name:name, contactNo: contactNo, startDate: startDate, package: package, endDate: endDate, details: details }, { where: { id } });
  
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Client Not Found or Update Failed!' });
      }
  
      const update = await Client.findByPk(id);
  
      res.status(200).json({ success: true, data: update,message:'Client Updated Successfully!' });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error!' });
    }
  };

const deleteClient = async (req,res)=>{
    try{
        
    const {id} = req.params;

    if(!id){
        return res.status(400).json({success:false,message:'Client Id Required'});
    }
    const client = await Client.findByPk(id);

    if(!client){
        return res.status(404).json({success:false,message:'Cannot Find Client!'});
    }

    await client.destroy();

    res.status(200).json({success:true,message:'Client Deleted Successfully!'});
    }catch(err){
        res.status(500).json({success:false,message:'Internal Server Error!'});
    }
}

module.exports = {deleteClient,createClient,fetchAllClients,updateRenewalStatus,editClientDetails};