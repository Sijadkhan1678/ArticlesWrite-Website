
const express = require('express');
const router = express.Router();
const {check,validationResult}= require('express-validator')

//const User = require('../models/User');
const Article= require('../models/Article');

// *********** method : GET
//  *********** Routes : api/artiles
// ************ Desc :   GET all Articles
// ************ Access : Public


router.get('/', async (req,res)=>{

         const articles= await Article.find()
         //.populate({
         //path: 'profile',
         //populate: {
           //path: 'user'
           
       //  }
         
         
        // })
         res.json(articles)
       

       })
// *********** method : POST 
//  *********** Routes : api/artiles
// ************ Desc :   Add Article
// ************ Access : Private


router.post('/',[
  check('title', 'Enter title should be 12  charactors').notEmpty().isLength({min: 12}),
 check('description', 'description should be 30 charactors').isLength({min: 30})
], async (req,res)=> {
      
   const errors=  validationResult(req);
   
    if (!errors.isEmpty())  {
       return res.status(400).json({errors: errors.array()})
     } 
   const {title,description} = req.body;
  
   
   try {
     const article = new Article({
                
               title: title,
                description: description
                
     
             })
     
     await article.save()

   console.log('successfully created')
   res.json(article)
   
   }
     catch(err){
     
      console.error(err.message)
     res.status(500).send('server error')
   }
   
} );



module.exports= router;
