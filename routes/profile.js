const express = require('express');
const router  = express.Router();
const Profile = require('../models/Profile');
const Article = require('../models/Article');


// *********** Method :   GET
// *********** Route : /api/profile
// *********** Disc  :  get user profile
// *********** access : public


router.get('/',async (req,res)=>{

      const userId= req.params.id
      try {
      const profile= await Profile.find({user: userId}).populate('user','photo name');
      const articles = await Article.find({user: userId}).populate('auther','photo name');
      
      res.json(profile,articles);
      
      
      }
      catch(err){
      
      console.error(err.message);
      res.status(500).send('server error');
      
      }

})

