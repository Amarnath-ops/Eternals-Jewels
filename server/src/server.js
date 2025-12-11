import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"

dotenv.config()
const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

const startServer = async ()=>{
  try{
    await connectDB(MONGO_URI)  

    app.listen(PORT,()=>{
      console.log(`Server runnning at http://localhost:${PORT}/api/v1`);
    })
  }
  catch(error){
    console.error("Failed to start server:", error.message);
  }
}

startServer()