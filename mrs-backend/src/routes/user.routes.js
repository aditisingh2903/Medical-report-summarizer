import express from 'express';
import { loginUser } from "../controllers/user.controller.js";
import { registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile",verifyJWT, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user,
  });
});

export default router;