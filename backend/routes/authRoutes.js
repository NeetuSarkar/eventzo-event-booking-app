import express from "express";
import { register, loginUser } from "../controllers/authController.js";
import {
  loginValidation,
  registerValidation,
  validate,
} from "../middleware/authValidator.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, loginUser);

export default router;
