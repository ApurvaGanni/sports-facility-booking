import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sports_facility";

mongoose
  .connect(MONGO_URI, {
    autoIndex: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });

export default mongoose;
