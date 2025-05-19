import { body } from "express-validator";

export const updateUserValidatior = [
  body("username")
    .notEmpty()
    .withMessage("Kullanıcı adı boş olamaz")
    .isLength({ min: 3 })
    .withMessage("Kullanıcı adı en az 3 karakter olmalıdır"),
  body("email")
    .notEmpty()
    .withMessage("Email boş olamaz")
    .isEmail()
    .withMessage("Geçersiz email formatı"),
  body("password")
    .notEmpty()
    .withMessage("Şifre boş olamaz")
    .isLength({ min: 6 })
    .withMessage("Şifre en az 6 karakter olmalıdır"),
  body("role")
    .notEmpty()
    .withMessage("Rol boş olamaz")
    .isIn(["admin", "user"])
    .withMessage("Geçersiz rol"),
];
