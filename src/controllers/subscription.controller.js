import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { Subscription } from "../models/subscription.model";
import { apierror } from "../utils/apiError";
import { request } from "express";
import { get } from "mongoose";
// import { Apiresponse } from "../utils/apiResponse";

const subscribe=asyncHandler(async(req,res)=>{
   const subscriber=await User.findByUserId(req._id)
   if(!subscriber){
    apierror("user not logged in",404)
   }
   const id=req.body._id
   if(!id){
    new apierror("channel not found",404)
   }
   const channel=await User.findByUserId(id)
   const subscription=await Subscription.findOne({subscriber:subscriber._id,channel:channel._id})
   if(subscription){
      apierror("already subscribed",400)
   }
   const newSubscription=await Subscription.create({subscriber:subscriber._id,channel:channel._id})
   return res.status(200).json(new Apiresponse("subscribed successfully",200) )
   })
const unsubscribe=asyncHandler(async(req,res)=>{
    const subscriber=await User.findByUserId(req._id)
      if(!subscriber){
         apierror("user not logged in",404)
      }
   const id=req.body._id
   if(!id){
    new apierror("channel not found",404)  
   }        
    const channel=await User.findByUserId(id)
    const subscription=await Subscription.findOne({subscriber:subscriber._id,channel:channel._id})
      if(!subscription){
         apierror("not subscribed",400)
      }
      await subscription.deleteOne()
      return res.status(200).json(new Apiresponse("unsubscribed successfully",200) )
   
   })
const isSubscribed=asyncHandler(async(req,res)=>{
      const subscriber=await User.findByUserId(req._id)
      if(!subscriber){
         apierror("user not logged in",404)
      }
      const channelId=req.params.channelId
      const channel=await User.findByUserId(channelId)
      if(!channel){
         apierror("channel not found",404)
      }
      const subscription=await Subscription.findOne({subscriber:subscriber._id,channel:channel._id})
      if(!subscription){
         return res.status(200).json(new Apiresponse("not subscribed",400))
      }
      return res.status(200).json(new Apiresponse("subscribed",200))

   })

export {subscribe,unsubscribe,isSubscribed}

