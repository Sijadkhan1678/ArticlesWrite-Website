
const express= require('express');
const router = express.Router();
const {check,validationResult}= require('express-validator');
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
      res.status(400).json({msg: error.array()})
    
    }
    
    const {email,password}= req.body
    
  try{  
  
     let user= await USer.findOne({email})
  
    if(user)  {
    return  res.json(400).json({msg: 'User with email already exist'});
    
    }
      user = new User({
     name,
     password,
     email
     
     })
     
    await user.save();
       
       
    const salt = await bcrypt.genSalt(10);
     user.password= await bcrypt.hash(password,salt);
    
    const payload= {
    user :   {
    
             id: user.id
         
          }
    
    }
    
    jwt.sign(payload,config.get('jwtSecret'),{
    expiresIn: '13 h'
    },(token,err)=>{
        if(err) throw err
       res.json({token})
    
    })
    }
    catch(err){
    if(err)  console.error(err.message)
    res.status(500).send('server error')
    
    }
     })




  

module.exports= router;
