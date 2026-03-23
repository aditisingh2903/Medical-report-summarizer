import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 3. Generate token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const registerUser = async (req, res) => {
 
  try {
     
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    console.log("Registering user...");
    const user = await User.create({
      name,
      email,
      password
    });
    console.log(User);
    // 🔥 Generate token here
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};