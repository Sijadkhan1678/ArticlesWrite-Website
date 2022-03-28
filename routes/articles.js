
   const express = require('express');
   const router = express.Router();
   const multer = require('multer');
   const  auth   = require('../middleware/auth')
   const {check,validationResult}= require('express-validator');

   const User = require('../models/User');
   const Article= require('../models/Article');


const multerStorage= multer.diskStorage({

          distination: function (req,file,callback){
          callback(null,'imgUpload/article')
          },
          
          filename: function(req,file,callback){
          const ext = file.mimetype.split('/')[1];
          
            callback(null,`article-${file.fieldname}-${Date.now()}${file.originalname.trim()}.${ext}`);
          
          }
          
})

const filterImg= (req,file,callback)=>{
       const ext = file.mimetype.split('/')[1];
       if(ext=== 'jpeg' || ext === 'png' || ext==='jpg'){
       
       callback(null,true)
       
       }else{
       callback(new error(`${ext} file not allowed`),false)
       }


   }
 
  const upload = multer({storage: multerStorage,
  
                       fileFilter: filterImg
  })

   


// ***********  method : GET
//  *********** Routes : api/articles
// ************ Desc :   GET all Articles
// ************ Access : Public


router.get('/', async (req,res)=>{

   try{
         const articles= await Article.find().populate('author','name photo')
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

router.get('/article/:id', async (req,res)=>{
  
  try{

          const article= await Article.find(req.params._id).populate('author','name photo');
          
          res.json(article)
  }
  catch(err){

    console.error(err.message)
    res.status(500).send('server error')
  }


})

// *********** method : POST 
//  *********** Routes : api/artiles
// ************ Desc :   Add Article
// ************ Access : Private


router.post('/',auth,[upload.single('avatar'),
 [ check('title', 'Enter title should be 12  charactors').notEmpty().isLength({min: 12}),
 check('description', 'description should be 30 charactors').isLength({min: 30})
]], async (req,res)=> {
      
   const errors=  validationResult(req);
   
    if (!errors.isEmpty())  {
       return res.status(400).json({errors: errors.array()})
     } 
   const {title,description,catagory} = req.body;
  
   
   try {
     const newArticle = new Article({
               author: req.user.id ,
               article_avatar,
               title,
               description,
               catagory,
               avatar: req.file.filename
                
             
             })
     
    const article=  await newArticle.save()

   console.log('successfully created')
   res.json(article)
   
   }
     catch(err){
     
      console.error(err.message)
     res.status(500).send('server error')
   }
   
} );

// *********** method  : PUT 
//  *********** Routes : api/artiles/article/:id
// ************ Desc   : update Article
// ************ Access : Private

   router.put('/artcle/:id',auth,upload.single('avatar'), async (req,res)=>{
   
    const {title,description,catagory}= req.body
    const articleId= req.params.id
    try{
    
      const article= await Article.findOne(articleId);
      if(!article){
      
      return res.status(404).json({msg: 'Article not found'});
      
      }
   
    if( !article.user.toString() === req.user.id){
    
     return res.status().json({msg: 'You are not autherized to update this article'});
     }
      const articleField= {};
      
      if (title)                articleField.title = title;
      if (description)          articleField.description= description;
      if (catagory)             articleField.catagory = catagory;
      if (req.file.filename)    articleField.avatar = req.file.filename;
      
      article = await Article.findByIdAndUpdate(articleId, {$set : articleField},{new:true});

      res.json(article)
    }
    catch(err){
    
    console.error(err.message);
    res.status(500).send('server error')
    }
       
   
   });
   
   
   // ***********  method  : DELETE 
   //  **********  Routes : api/artiles/article/:id
  // ************  Desc   : Remove Article
  // ************  Access : Private

   router.delete('/article/:id',auth, async (req,res)=>{
    
    const articleId= req.params.id
    
    try{
    
      const article= await Article.findOne(articleId);
      if(!article){
      
      return res.status(404).json({msg: 'Article not found'});
      
      }
   
    if( !article.user.toString() === req.user.id){
    
     return res.status().json({msg: 'You are not autherized to delete this article'});
     }
      
      article = await Article.findByIdAndRemove(articleId);

      res.json({msg: 'Article successfully deleted'})
    }
    catch(err){
    
    console.error(err.message);
    res.status(500).send('server error')
    }
       
   
   })


router.post('/comment/:id',[auth,[
check('text','please enter text atleast 2 charactors').isLength({min:3})

]], async (req,res)=>{

const errors = validationResult(req);

  const {text}= req.body

if(!errors.isEmpty()){
    res.status(400).json({errors: errors.array() })
}


 try{
 
     let user = await User.findById(req.user.id);
     if(!user){
       return res.status(404).json({ msg: 'User not autherized'})
     }
     
     let article= await Article.find({_id:req.params.id})
      if(!article){
      
      res.status(404).json({ msg: 'Article not Found'});
      
      } 
      const newComment= {

         text, 
          commentby: req.user.id 
      
      }
      
      comments = await  Article.findByIdAndUpdate(req.params.id,{
     
             $push: { comments:newComment} },{new: true
     
     }).populate('comments.commentby','photo name');
      
      res.json(comments)
      
 }
 catch(err){
 
    console.error(err.message)
    res.status(500).send('server error')
 }
      

})

  router.delete('/uncomment/:id',auth,async (req,res)=>{
       
    const articleId= req.body._id
      try{
      
       let article= await findOne(articleId);
       if(!article){
       
       res.status(404).json({msg: 'Article not found'})
       }  
     if (article.comments.user.commentby.toString()  !== req.user.id){
        
        res.status(401).json({msg: 'You are not autherized'})
     
     }
     
     await Article.findByIdAndUpdate(postId,{
     
      $pull: { comments :req.params.id}
      
           },   
      {new: true});
           
           
     res.json('comment successfully deleted')
     
              
      }
      catch(err){
     console.error(err.message)
     res.status(500).send('server error')
      }


  })
  
   // *********** method : POST
  //  *********** Routes : api/artiles/like/:id
 // ************  Desc :   like Article
 // ************  Access : private


  router.post('/like/:id', auth, async (req,res)=>{
    
    
    const articleId = req.params.id;
    
    
     try {
       let user= await User.find(req.user.id)
       
       let article =  await  Article.find(articleId);
       
       if(!user){
       
       res.status(401).json({msg: 'User not autherized'})
     
            }
            
       if(!article){
       
       res.status(404).json({msg: 'Article not found'})
      
       }
       
       article = await Article.findByIdAndUpdate(articleId,{
       $push: { likes: req.user.id }
       
       });
       
       res.json(article);
        
      }
      
     catch(err){
      console.error(err.message)
      res.status(500).send('server error')
    }

  })
     
       //  ***********  method : Delete
      //   ***********  Routes : api/artiles/unlike/:di
     //    ***********  Desc :   Unlike Article
    //    ************  Access :  private  


   router.delete('/unlike/:id',auth, async (req,res)=>{
    
     let articleId= req.params.id;
     
   try{
   
      let user = await User.find(req.user.id);
      
      let article= await Article.find(articleId);

      if(!user){

      res.status(404).json({msg: 'User not found'})

          }

      if(!article){
      
         res.status(404).json({msg: 'Article not found'})
      }
      
      article = await Article.findByIdAndUpdate(articleId,{

      $pull: {likes: req.user.id}  })

      res.json('post unlike')

      }

      catch(err){
      console.error(err.message);
      res.status(500).send('server error')
      }
   
   })



module.exports= router;
