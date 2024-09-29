import mongoose from "mongoose";
// const uri = `mongodb+srv://pratikmishra246810:${process.env.MONGODB_PASSWORD}@cluster0.wvp7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = process.env.MONGODB_URI;

export default async function connect() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, {});
      console.log("Connected to MongoDB");
    } else {
      console.log("Already connected to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return null;
  }
}
