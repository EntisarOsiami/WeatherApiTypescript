
import mongoose from "mongoose";
import { config } from "dotenv";

config();
const uri = process.env.MONGODB_URI || "";


 export async function databaseConnection() {
  try {
    await mongoose.connect(uri);
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 });
    }
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    await mongoose.disconnect();
  }
}