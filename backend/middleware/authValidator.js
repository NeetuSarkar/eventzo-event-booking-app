import { check, validationResult } from "express-validator";

export const registerValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("phone", "Phone is required").not().isEmpty(),
  check(
    "password",
    "Password must be at least 6 characters long and include at least one letter, one number, and one special character"
  ).matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array().map((err) => err.msg) });
  }
  next();
};

export const loginValidation = [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password is required").not().isEmpty(),
];
