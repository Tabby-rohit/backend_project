import {asyncHandler} from "../utils/asyncHandler.js";
import { apierror } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
export const verifyJWT=asyncHandler(async(req,res,next)=>{
try {
    const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
    // console.log("   token from auth middleware",token)
     
    if(!token){
        throw new apierror("Unauthorized",401);
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user=await User.findById(decodedToken._id).select("-password -refreshToken")
    // console.log(user)
    if(!user){
        throw new apierror("Unauthorized",401);
    }
    req.user=user;
    next();
} catch (error) {
    throw new apierror(error?.message||"Unauthorized",401);
}
})

