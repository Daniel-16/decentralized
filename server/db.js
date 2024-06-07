import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      await mongoose.connect("prod db not ready yet");
      console.log("Prod db not ready yet");
    } else {
      await mongoose.connect(`${process.env.MONGODB_DEV}`);
      console.log("Connected to DB in development");
    }
  } catch (error) {
    throw new Error("Could not connect to db", error);
  }
};

export default connectDB;
