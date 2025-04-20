import mongoose from "mongoose";

export const connectDB= async ()=>{
    await mongoose.connect('mongodb+srv://navneetkharb2025:NAV2025criggy@cluster0.zzy052j.mongodb.net/food_delivery-main').then(()=>console.log("DB Connected"))
}