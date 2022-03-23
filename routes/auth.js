const express = require('express');
const router = express.Router();
const config = require('config')
const bcrypt = require('bcryptjs');
const jwt =    require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User')
const {check,validationResult} = require('express-validator');



// ##########   method :   GET
// ##########   Routes   /api/auth
// ##########   desc     get logged in user
// ##########   access   private

  router.get('/',auth, async (req,res)=>{
  
       try{
       
       const user = await findById(req.user.id).select('-password')
       
       res.json(user)
       
       }
       catch(err){
       console.error(err.message)
       res.status(500).send('server error')
       } 
  
  
  })


// ##########   method :  POST
// ##########   Routes :  /api/auth
// ##########   desc   :  autherize user and get the token
// ##########   access :  public


router.post('/',[
check('email','please enter valid email',).isEmail(),
check('password','please enter password').isEmpty()


],(req,res)=>{

     let errors = validationResult(req);
     
     if (!errors.isEmpty()){
     
    return res.status(404).json({errors: errors.array()});
    
     }

   const {email,password} = req.body;
   
   try {
   const user = await User.findOne({email});
   if (!user){
    return res.status(400).json({msg: 'A user with email does not exist'})
   }
   
   const isMatch= bcrypt.compare(password,user.password);
    // if ismatch variable return true then skip if block statement 
   if (!isMatch){
   
   res.status(400).json({msg: 'Incorrect password'});
   
   }
   
   // if we find user in the database then we use it and find its id and Store it in the payload variable
   
   const payload = {
   user:  {
     id : user.id
   }
   
   }
   // here we use payload to generate token for that user and in the response gives token.
   
   
   jwt.sign(payload,config.get('jwtSecret'),{
   
   // after 6 days token will be expired
   expiresIn: '6 days'
   
   },
   (token,err) =>{
   if (err) throw err;
   // with this token gives right to access his/her data in the database 
   res.json(token)
   })
   
   }
   catch(err){
  console.error(err.message);
  res.status(500).sent('server error')
   
   }
    

})

module.exports= router;
