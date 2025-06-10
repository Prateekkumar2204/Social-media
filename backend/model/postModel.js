const mongoose=require("mongoose");
const User = require("./userSchema");

const postSchema=new mongoose.Schema({
    original:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    title:{
        type:String,
        required:true
    },
    originalName:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User' 
        }
    ],
    comments:[
        {
           user:{ 
            type:String,
           },
           content:{
            type:String,
            default:''
           }
        }
    ]
},
{
  timestamps: true, 
}
);

const Post=mongoose.model('Post',postSchema) 
module.exports = Post;