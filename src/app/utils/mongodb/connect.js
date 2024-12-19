import mongoose from "mongoose";
const uri = process.env.MONGODB_URI;

export default async function connect() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, {});
      // console.log("Connected to MongoDB");
      return true;
    } else {
      // console.log("Already connected to MongoDB");
      return true;
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return false;
  }
}
