import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      await mongoose.connect(`${process.env.MONGODB_PROD}`);
      console.log("Connected to DB in production");
    } else if (process.env.NODE_ENV === "test") {
      await mongoose.connect(`${process.env.MONGODB_TEST_URI}`);
      console.log("Connected to DB in test mode");
    } else {
      await mongoose.connect(`${process.env.MONGODB_DEV}`);
      console.log("Connected to DB in development");
    }
  } catch (error) {
    throw new Error("Could not connect to db", error);
  }
};

export default connectDB;
