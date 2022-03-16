const mongoose = require('mongoose');

const articleSchema= mongoose.Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'users'
   },
   
   article_avatar: {
     path: [Buffer],
     required: true
   },
   
    title: {
       type: String,
       required: true
    
    },
   description : {
       type: String,
       required: true
   
   },
   likes : [
             {
              user : {
                   type: mongoose.Schema.Types.ObjectId,
                   ref: 'users'
   
               },
           like: {
             type: Boolean,
             default : false
             
           }
         }
           ],
           
   comments: [
   {
        
      user: {
        
           type: mongoose.Schema.Types.ObjectId,
           ref: 'users'
        },
        
        text:{
        
          type: String,
          required: true
        
           }  ,
        
        commentAt: {
            type: Date,
            default: Date.now()
        }   
   
          }
             ],
   
   createdAt: {
              type: Date,
              default: Date.now()
   }
    


})

module.exports= mongoose.model('articles',articleSchema)
