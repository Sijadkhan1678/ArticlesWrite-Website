

const jwt = require('jsonwebtoken');
const config = require('config');

  module.exports = function (req,re,next){

         const token = req.header('x-auth-token');
         
         if(!token){
         
         res.status(401).json({msg: 'Autherization denied,token missing'})
        
         }
         
         try {
            
         const decoded = jwt.verify(token, config.get('jwtSecret'));
         
         req.user= decoded.user;
         
         next();
         
         }
         
         catch(err){
         
         res.status(401).json({msg: 'Invalid token'})   
            
             }
        

  }
