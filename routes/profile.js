const express = require('express');
const router  = express.Router();
const Profile = require('../models/Profile');
const Article = require('../models/Article');
const auth    = require('../middleware/auth')


  // *********** Method : GET
  // *********** Route :  api/profile
  // *********** Disc  :  get user profile
  // *********** access : public


router.get('/',async (req,res)=>{

      const userId= req.params.id
      try {
      const profile= await Profile.find({user: userId}).populate('user','photo name');
      
      const articles = await Article.find({author: userId}).populate('author','photo name');
      
      res.json(profile,articles);
      
      
      }
      catch(err){
      
      console.error(err.message);
      res.status(500).send('server error');
      
      }

})

  // ***********  Method :  GET
  // ***********  Route :   api/profile/myprofile
  // ***********  Disc  :   logged in user access personal profile
  // ***********  access :  private


    router.get('/myprofile',auth, async (req,res)=>{
    
    const userId= req.user.id
    
          try{
          
            const profile= await Profile({user:userId}).populate('user','photo name');
            const articles= await Article.find({auther: userId}).populate('author').populate('author','photo name');
            
            res.json({profile,articles});
        
          }
          catch(err){
          
          console.error(err.messge)
          
          res.status(500).send('server error')
          }
    
    
    })



