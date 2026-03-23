import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String, //  profile image
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {   //bcrypt se password hash krte h 
    if (this.isModified("password"))   //agar modify hua h tabhi
      {
      this.password = await bcrypt.hash(this.password, 10)
      //next()
      }
    
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id: this._id, 
            name: this.name,
            email: this.email,
            password: this.password
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            id: this._id  // bar bar refresh hota isliye sirf id hi bhejte h taki security badh jaye aur agar kisi ke pass refresh token chala jata h to wo uska access token generate ni kr payega kyunki usme id hi ni hogi
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userSchema);