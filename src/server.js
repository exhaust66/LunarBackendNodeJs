const express=require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes=require('./routes/users/userRoutes');
const studentRoutes=require('./routes/users/studentRoutes');
const adminRoutes=require('./routes/users/adminRoutes');

//neccessary imports
require('dotenv').config();
require('./sync');

const app=express();
app.use(express.json());

//available routes
app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin',adminRoutes)


// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{console.log(`Server is listening on PORT ${PORT}`)});