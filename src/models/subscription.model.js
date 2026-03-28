import mongoose, { Schema, SchemaType}from "mongoose";
const subscriptionSchema=new schema ({
subscriber:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
channel:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true 
},

},{timestamp:true})
export const Subscription=mongoose.model("Subscription",subscriptionSchema)