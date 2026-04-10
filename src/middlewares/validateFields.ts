import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  next();
};

export const loginValidate = [
  check("email", "El email es obligatorio").isEmail(),
  check("password", "La contraseña debe ser de al menos 6 caracteres").isLength(
    { min: 6 },
  ),
  validateFields,
];

export const registerValidate = [
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("email", "El email es obligatorio").isEmail(),
  check("password", "La contraseña debe ser de al menos 6 caracteres").isLength(
    { min: 6 },
  ),
  validateFields,
];

export const eventValidate = [
  check("title", "El título es obligatorio").not().isEmpty(), // El título no puede estar vacío
  check("start", "La fecha de inicio es obligatoria").isISO8601(), //
  check("end", "La fecha de finalización es obligatoria").isISO8601(),
  validateFields,
];
