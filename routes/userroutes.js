import express from "express";

import {
  registerUser,
  loginUser,
  adminLogin,
} from "../controller/usercontroller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);

export default router;