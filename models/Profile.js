const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema= Schema({

     user : {
     
           type: Schema.Types.ObjectId,
           ref : 'user'
      
          } ,
          
    avatar:  {
       
      type: String,
       
   
         },
    bio : {
    type : String
    
    
    } ,
    
   social  : {
        facebook : {
           type: String
        },
        
        github: {
           type: String
        },
        
        linkdin: {
          type: String
        },
        
        twitter:{
        type: String
        
        }
   
          },
   Skills: [String]



})


module.exports= mongoose.model('Profile',ProfileSchema)
