// import mongoose from "mongoose";
// import { DB_NAME } from "./constant.js";
import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";    
dotenv.config({
    path:".env"
});
connectDB()
.then(()=>{
  app.on("error",(err)=>{
      console.error("Server error:", err);
  });
  app.listen(process.env.PORT || 3000, ()=>{
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
  }); 
})
.catch((err)=>{
    console.error("Failed to connect to the database:", err);
    process.exit(1);
})






















/*
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();
*/