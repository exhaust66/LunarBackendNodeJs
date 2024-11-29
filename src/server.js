const express=require('express');
const userRoutes=require('./routes/userRoutes');
require('dotenv').config();
const sequelize=require('./configs/sequelize');
require('./sync');

const app=express();
app.use(express.json());

app.use('/api/users',userRoutes);

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{console.log(`Server is listening on PORT ${PORT}`)});