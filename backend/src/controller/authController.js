import User from "../Model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup=async(req,res)=>{
 try{
    const {name, email,password}=req.body;

    const exists=await User.findOne({email});
    if(exists) return res.status(400).json({msg:"User already exists"});

    const hashed=await bcrypt.hash(password,10);

    await User.create({name,email, password:hashed});
    res.json({msg:"Signup successfull"});
 }catch(err){
    console.log(err);
    res.status(500).json({msg:"Sever error"});
 }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const exists = await User.findOne({ email });
    if (!exists) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check password
    const match = await bcrypt.compare(password, exists.password);
    if (!match) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // Create token
    const token = jwt.sign(
      { id: exists._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      msg: "Login successful",
      token,
      user: {
        id: exists._id,
        name: exists.name,
        email: exists.email,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
