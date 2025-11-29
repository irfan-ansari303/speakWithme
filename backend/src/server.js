import express from "express"
import {ENV} from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { auth } from "./middlewares/auth.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);

app.get("/health",(req,res)=>{
    res.status(200).json({message:"This api is runnig"});
})


app.get("/api/dashboard",auth,(req,res)=>{
    res.status(200).json({msg:"Welcome user"})
})

const startServer=async ()=>{
    try{
        await connectDB();
        app.listen(ENV.PORT,()=>{
            console.log(`Server is runnnig  on port :${ENV.PORT}`);
        });
    }catch(error){
        console.error("Error Starting the Server",error);
    }
};
startServer();  