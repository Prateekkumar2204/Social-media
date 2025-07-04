const mongoose=require('mongoose')
const jwt= require("jsonwebtoken")
const bcrypt=require('bcryptjs')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User' 
        }
    ],
    pendingRequest: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User' 
        }
    ],
    pendingRequestSent: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User' 
        }
    ],
    highScore:{
        type:Number,
        default:0
    }
},{
    timestamps: true
});

userSchema.pre('save',async function(next){
    console.log("hi guys from inside")
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12)
        this.cpassword=await bcrypt.hash(this.cpassword,12)
    }
    next()
})

userSchema.methods.generateAuthToken=async function(){
    try{
       let token=jwt.sign({_id:this._id},"IAMAWEBDEVELOPERANDIAMCOOLYOUKNOWSUBSCRIBEHELLOWORLDIAMHERE32CAHARACTERS")
       console.log(token);
       this.tokens=this.tokens.concat({token:token})
       await this.save()
       return token
    }catch(err){
      console.log(`${err}`)
    }
}
const User=mongoose.model('User',userSchema)
module.exports=User