const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/users/admin');

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log('Request received - Username:', username, 'Password:', password);

  try {
    const admin = await Admin.findOne({ where: { name: username } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name,email:'admin@gmail.com',role:'Admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Admin Token:",token); //consoling the user token

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {loginAdmin};