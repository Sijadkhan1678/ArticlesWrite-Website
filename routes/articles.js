
   const express = require('express');
   const router = express.Router();
   const multer = require('multer');
   const {check,validationResult}= require('express-validator');

   const User = require('../models/User');
   const Article= require('../models/Article');


const multerStorage= multer.diskStorage({

          distination: function (req,file,callback){
          callback(null,'imgUpload/article')
          },
          
          filename: function(req,file,callback){
          const ext = file.memitype.split('/')[1];
          
            callback(null,`article_picture${file.Date.now()}${file.originalname}.${ext}`);
          
          }
          
})

const filterImg= (req,file,callback)=>{
       const ext = file.memitype.split('/')[1];
       if(ext=== 'jpeg' || ext === 'png'){
       
       callback(null,true)
       
       }else{
       callback(new error(`${ext} file not allowed`),false)
       }


   }
 
  const upload = multer({storage: multerStorage,
  
                       fileFilter: filterImg
  })

   


// ***********  method : GET
//  *********** Routes : api/artiles
// ************ Desc :   GET all Articles
// ************ Access : Public


router.get('/', async (req,res)=>{
   try{
         const articles= await Article.find().populate('auther','name photo')
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

          const article= await Article.find(req.params._id).populate('author','name avatar');
          
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


router.post('/',[upload.single('avatar'),
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
               auther: req.user.id ,
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

   router.put('/artcle/:id',upload.single('avatar'), async (req,res)=>{
   
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
      
      if (title)       articleField.title= title;
      if (description) article.Field= description;
      if (catagory)    articleFiled = catagory;
      if (req.file.filename)     articleField.avatar = req.file.filename;
      
      article = await Article.findByIdAndUpdate(articleId, {$set : articleField});

      res.json(article)
    }
    catch(err){
    
    console.error(err.message);
    res.status(500).send('server error')
    }
       
   
   });
   
   
   // *********** method  : DELETE 
//  *********** Routes : api/artiles/article/:id
// ************ Desc   : Remove Article
// ************ Access : Private

   router.delete('/artcle/:id', async (req,res)=>{
   
    
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


router.post('/comment/:id',[
check('text','please enter text atleast 2 charactors').isLength({min:3})

], async (req,res)=>{

const errors = validationResult(req);

if(!errors.isEmpty()){
    res.status(400).json({errors: errors.array() })
}
const {text,_id}= req.body
console.log(text,id)

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
      commentby: id
    //  commentby: req.user.id
      
      }
      
      comments =  Article.findByIdAndUpdate(req.params.id,{
     
             $push: { comments:newComment} },{new: true
     
     }).populate('comments.commentby','avatar name');
      
      res.json(comments)
      
 }
 catch(err){
 
    console.error(err.message)
    res.status(500).send('server error')
 }
      

})

  router.delete('/uncomment/:id',async (req,res)=>{
       
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
     
      $pull: { comments :req.params._id}
      
           },   {new: true});
           
           
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


  router.post('/like/:id', async (req,res)=>{
    
    
    const articleId = req.params._id;
    
    
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


   router.delete('/unlike/:id', async (req,res)=>{
    
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
