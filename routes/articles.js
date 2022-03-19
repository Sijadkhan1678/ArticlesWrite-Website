
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {check,validationResult}= require('express-validator')

const multerStorage= multer.diskStorage({

          distination: function (req,file,callback){
          callback(null,'imgUpload/article')
          },
          
          filename: function(req,file,callback){
          
          
          
          }
          

})
 
  const upload = multer({storage: multerStorage})

     const User = require('../models/User');
     const Article= require('../models/Article');



// ***********  method : GET
//  *********** Routes : api/artiles
// ************ Desc :   GET all Articles
// ************ Access : Public


router.get('/', async (req,res)=>{
   try{
         const articles= await Article.find()
         //.populate('user','name photo')
         console.log(articles)
         res.json(articles)
         
       }
       
       catch(err){
           console.error(err.message)
           res.status(500).send('server errror')
       }

       })
       
       
 // *********** method : GET
//  *********** Routes : api/artiles
// ************ Desc :   GET spicific Article
// ************ Access : Public

router.get('/:id', async (req,res)=>{

          const article= await articles.find(req.params.id).populate('comments').populate('user').select(photos,name);

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
   const {title,description,catagory} = req.body;
  
   
   try {
     const article = new Article({
               auther: req.user.id ,
               article_avatar,
               title,
               description,
               catagory,
               
                
             
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

router.post('/comment:id',[
check('text','please enter text atleast 2 charactors').isLength({min:3})

], async (req,res)=>{

const errors = validationResult(req);

if(!errors.isEmpty()){
    res.status(400).json({errors: errors.array() })
}
const {text}= req.body

 try{
 
     let user= await User.findOne(req.user.id);
     
     let article= await Article.find(req.params._id)
      if(!user){
      
      res.status(401).json({msg: 'You don`t have correct autherization to add comment this post'});
      
      } 
      if(!article){
      
      res.status(404).json({ msg: 'Article not Found'});
      
      } 
      const newComment= {
      text,
      commentby: req.user.id
      
      }
      
      article =  Article.findByIdAndUpdate(req.params.id,{
     
             $push: { comments:newComment }
     
     })
      
      
      
      
      res.json(article)
      
 }
 catch(err){
 
    console.error(err.message)
    res.status(500).send('server error')
 }
      

})

  router.delete('/uncomment:id',async (req,res)=>{
       
    const postId= req.body._id
      try{
      
       let article= await findOne(postId);
       if(!article){
       
       res.status(404).json({msg: 'Article not found'})
       }  
     if (article.comments.user.commentby.toString()  !== req.user.id){
        
        res.status(401).json({msg: 'You are not autherized'})
     
     }
     
     await Article.findByIdAndUpdate(postId,{
     
      $pull: { comments :req.params._id}
      
           },   {new: true});
           
           
     res.json('comment successfully deleted')
     
              
      }
      catch(err){
     console.error(err.message)
     res.status(500).send('server error')
      }


  })





module.exports= router;
