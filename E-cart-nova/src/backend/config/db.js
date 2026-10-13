import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/e_cart_nova");

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
  }
};

export default connectDB;