import {ENV} from "../lib/env.js";
import jwt from "jsonwebtoken";

export const auth=(req,res,next)=>{
    const header=req.headers.authorization;
    if(!header) return res.status(401).json({msg:"No token provided"});

    const token=header.split(" ")[1];
    try{
        const user=jwt.verify(token,ENV.JWT_SECRET);
        req.user=user;
        next();
    }catch(error){
        res.status(401).json({msg:"Invalid token or expired token"})
    }   
};