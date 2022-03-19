const mongoose = require('mongoose');

const articleSchema= mongoose.Schema({
   auther: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'user'
   },
   
   avatar: {
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
   catagory: [String],

   likes : [
            { 
             likeby:  {
                   type: mongoose.Schema.Types.ObjectId,
                   
   
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
