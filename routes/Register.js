
const express= require('express');
const router = express.Router();
const {check,validationResult}= require('express-validator');
const config = require('config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ***********   Method  POST           ****************
// ***********   Route  api/register    **************
// ***********   Desc  Register a user  **************
// ***********   Access Public          ***************

 router.post('/',[
 
    check('name','Please Enter your Name').not().isEmpty().isLength({min:3}),
    check('email','Enter your email').isEmail(),
    check('password','Enter password with 6 charactor').isLength({min: 6})
 
 ], async (req,res)=>{
    const errors= validationResult(req);
    if (!errors.isEmpty()){
      res.status(400).json({msg: errors.array()})
    
    }
    
    const {name,email,password}= req.body
    
  try{  
  
     let user= await User.findOne({email})
  
    if(user)  {
    return  res.status(400).json({msg: 'User with this email already exist'});
    
    }
      user = new User({
        name,
        email,
        password
  
     
     })
     
    
       
       
    const salt = await bcrypt.genSalt(10);
     user.password= await bcrypt.hash(password,salt);
     
     await user.save();
    
    const payload= {
    user :   {
    
             id: user.id
         
          }
    
    }
    
    jwt.sign(payload,config.get('jwtSecret'),{
    expiresIn: 3600000
    },(err,token)=>{
        if(err) throw err
       res.json({token})
    
    })
    }
    catch(err){
      console.error(err.message)
    res.status(500).send('server error')
    
    }
     })




  

module.exports= router;
