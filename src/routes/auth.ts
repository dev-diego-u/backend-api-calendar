//*raiz de ruta /api/auth

import { Router } from "express";
import {
  registerController,
  loginController,
  renewTokenController,
} from "../controllers/authController";
import { loginValidate, registerValidate } from "../middlewares/validateFields";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

router.post("/new", [...registerValidate], registerController);

router.post("/", [...loginValidate], loginController);

router.get("/renew", validateJWT, renewTokenController);

export default router;
