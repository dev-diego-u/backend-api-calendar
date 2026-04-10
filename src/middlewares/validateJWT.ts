import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ========================
// 1. Interfaz personalizada (RECOMENDADO)
// ========================
// export interface AuthenticatedRequest extends Request {
//   uid: string; // o number si tu uid es numérico
//   name: string;
// }

export interface JwtPayload {
  uid: string;
  name: string;
  iat: number; // fecha de emisión
  exp: number; // fecha de expiración
}

// ========================
// 2. Middleware tipado
// ========================
const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Token no proporcionado",
    });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("JWT_SECRET no está definido en las variables de entorno");
      return res.status(500).json({
        ok: false,
        message: "Error en el servidor",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const payload = jwt.verify(token, secretKey) as JwtPayload;

    req.uid = payload.uid;
    req.name = payload.name;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Token inválido",
    });
  }
};

export { validateJWT };
