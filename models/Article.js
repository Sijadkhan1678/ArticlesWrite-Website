const mongoose = require('mongoose');

const articleSchema= mongoose.Schema({
   writtenby: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Profile'
   },
   
   article_avatar: {
     type: String
     
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
                   
   
               },
           like: {
             type: Boolean,
             default : false
             
           }
         }
           ],
           
   comments: [
   {
        
      commentby: {
        
           type: mongoose.Schema.Types.ObjectId,
           ref: 'user'
        },
        
        text:{
        
          type: String,
          required: true
        
           }  ,
        
        commentAt: {
            type: Date,
            default: Date.now
        }   
   
          }
             ],
   
   createdAt: {
              type: Date,
              default: Date.now
   }
    


})

module.exports= mongoose.model('articles',articleSchema)
