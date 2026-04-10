import { Request, Response } from "express";
import { User } from "../models/User";
import { generarJWT } from "../helpers/jwt";

// Login de usuario con email y password
export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ ok: false, message: "Credenciales inválidas" });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ ok: false, message: "Credenciales inválidas" });
    }

    // Aquí iría la generación del token JWT
    const token = await generarJWT({
      uid: user._id.toString(),
      name: user.name,
    });
    res.status(200).json({ ok: true, message: "Login exitoso", token });
  } catch (error) {
    console.error("Error en loginController:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Registro de nuevo usuario
export const registerController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Validar que el email no exista ya en la base de datos
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ ok: false, message: "El email ya está registrado" });
    }

    // Crear nuevo usuario en la base de datos
    const newUser = new User({ name, email, password });

    await newUser.save();

    const token = await generarJWT({
      uid: newUser._id.toString(),
      name: newUser.name,
    });

    res.status(201).json({
      ok: true,
      message: "Usuario registrado exitosamente",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error("Error en registerController:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Renovación del token JWT
export const renewTokenController = async (req: Request, res: Response) => {
  const { uid, name } = req;

  if (!uid || !name) {
    return res
      .status(400)
      .json({ ok: false, message: "Datos de usuario faltantes" });
  }

  const token = await generarJWT({ uid, name });

  res.json({ ok: true, message: "Token renovado", uid, name, token });
};
