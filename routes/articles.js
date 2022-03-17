
const express = require('express');
const router = express.Router();
const {check,validationResult}= require('express-validator')

//const User = require('../models/User');
const Article= require('../models/Article');

// *********** method : POST 
//  *********** Routes : api/artiles
// ************ Desc :   Add Article
// ************ Access : Private


router.post('/',[
  check('title', 'Enter title atleast 12  charactors').notEmpty().isLength({min: 12}),
  check('text', 'Enter  description 30 charactors').isLength({min: 30})
], async (req,res)=> {
      
   const errors=  validationResult(req);
   
   if (!errors.notEmpty)  {
       return res.status(400).json({errors: errors.array()})
     } 
   const {title,description} = req.body;
   
   
   try {
     const article = new Article({
                
               title: title,
                description: text
                
     
             })
     
     await article.save()

   
   
   }
     catch(err){
     
     if (err) console.error(err.message)
     res.status(500).send('server error')
   }
   
} )

module.exports= router
