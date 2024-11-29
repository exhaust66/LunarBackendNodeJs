const express=require('express');
const userRoutes=require('./routes/userRoutes');
const studentRoutes=require('./routes/studentRoutes');
const adminRoutes=require('./routes/adminRoutes');
const sequelize=require('./configs/sequelize');

const app=express();
require('dotenv').config();

require('./sync');

app.use(express.json());

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