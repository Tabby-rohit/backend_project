import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { use } from "react";

const userSchema = new Schema({
    username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true,
},
email:{
    type:String,
    required:true,
    unique:true,
    },
    fullname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
        avtar:{
            type:String,
            required:true
        },//url of the image(cloudinary)
        coverImage:{
            type:String,
        },
        watchhistory:[{
            type:Schema.Types.ObjectId,
            ref:"Video"
        }],
        refreshToken:{
            type:String,
        }
},{timestamps:true});

  userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();//checkes whthere password is changed or not
    this.password = await bcrypt.hash(this.password,10);//encrypt the password 
    next();
  });

  //checking password
  userSchema.methods.isPasswordValid = async function(password){
    return await bcrypt.compare(password,this.password);
  }
    //generating access token
    userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User',userSchema);
export default User;
