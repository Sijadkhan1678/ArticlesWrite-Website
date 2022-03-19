const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema= Schema({

     user : {
     
           type: Schema.Types.ObjectId,
           ref : 'user'
      
          } ,
          
    bio : {
     
           type : String,
           required: true
    
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
