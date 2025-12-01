import express from "express"
import {ENV} from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { auth } from "./middlewares/auth.js";
import {Server} from "socket.io";
import http from "http";


import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import {roomHandlers} from "./sockets/roomHandlers.js";
import {socketAuth} from "./middlewares/socketAuth.js";

// expresss app
const app=express();
const server=http.createServer(app);



// cors
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth",authRoutes);

app.get("/health",(req,res)=>{
    res.status(200).json({message:"This api is runnig"});
})


app.get("/api/dashboard",auth,(req,res)=>{
    res.status(200).json({msg:"Welcome user"})
})

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


// Use socket auth
io.use(socketAuth);

// Room events
io.on("connection", (socket) => roomHandlers(io, socket));



// start server
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