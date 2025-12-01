import jwt from "jsonwebtoken";

export  const socketAuth=(socket,next)=>{
    const token=socket.handshake.auth?.token;

    if(!token) return next(new Error("No Token provided"))

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        socket.userId=decoded.id;
    }catch(error){
        next(new Error("Invalid token"));
    }
};