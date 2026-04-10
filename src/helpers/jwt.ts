import jwt, { type SignOptions } from "jsonwebtoken";

interface Payload {
  uid: string;
  name: string;
}

const generarJWT = (payload: Payload): Promise<string> => {
  const { JWT_SECRET } = process.env;
  const expiresIn = "1h"; // Valor por defecto de 1 hora
  return new Promise((resolve, reject) => {
    if (!JWT_SECRET) {
      console.error("JWT_SECRET no está definido en las variables de entorno");
      return reject("Clave secreta no configurada");
    }

    jwt.sign(payload, JWT_SECRET, { expiresIn }, (err, token) => {
      if (err || !token) {
        console.error("Error al generar JWT:", err);
        reject("No se pudo generar el token");
      } else {
        resolve(token); // sin cast, TS sabe que es string por el guard `!token`
      }
    });
  });
};

export { generarJWT };
