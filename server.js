const express = require('express');
const app = express();
const connectDB= require('./config/db')




connectDB();
// init Middlewar

app.use(express.json({extended: false}))
app.use('/api/register',require('./routes/Register'));
app.use('/api/articles',require('./routes/articles'));




//app.use('/api/auth',auth);
PORT = 4000 || env.production
   
app.listen(PORT,()=> console.log(`server runining ${PORT}`) )
