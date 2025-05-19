import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Geçersiz veri gönderildi",
      errors: errors.array(),
    });
  }
  next();
};
