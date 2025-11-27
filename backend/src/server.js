import express from "express"
import {ENV} from "./lib/env.js";
import { connectDB } from "./lib/db.js";
const app=express();


// CORS

app.use(
    cors({
        
    })
)
// middle ware

app.get("/health",(req,res)=>{
    res.status(200).json({message:"This api is runnig"});
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