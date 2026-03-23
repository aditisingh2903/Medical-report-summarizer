// This middleware will check if user is logged in 
// verify JWT Token
// Attach user info to request
// Allow/deny access to protected routes


import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config({path: './.env'});

export const verifyJWT = (req, res, next) => {
console.log("Verifying JWT...");

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decodedToken; // attach user info

    next();
  } catch (error) {
    next();
    
  }
};

