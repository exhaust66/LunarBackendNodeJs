const express=require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes=require('./routes/users/userRoutes');
const studentRoutes=require('./routes/users/studentRoutes');
const adminRoutes=require('./routes/users/adminRoutes');
const trainerRoutes=require('./routes/users/trainerRoutes');
const path = require('path');

const cors = require('cors');
//neccessary imports
require('dotenv').config();
require('./sync');

const app=express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));



//available routes
app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/trainer',trainerRoutes);

app.get("/hello",(req,res)=>{
    res.send("hello")
})
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{console.log(`Server is listening on PORT ${PORT}`)});