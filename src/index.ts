// Archivo principal del servidor backend del calendario
// Configura Express, CORS, rutas y conexión a BD

import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth";
import eventsRoutes from "./routes/events";
import { connectDB } from "./config/database";

// Puerto del servidor, por defecto 4000
const { PORT = 4000 } = process.env;

// Función principal para iniciar el servidor
const startServer = async () => {
  const app = express();

  // Configuración de CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : ["http://localhost:3000"]; // Orígenes por defecto

  const corsOptions = {
    origin: allowedOrigins, // Orígenes permitidos
    credentials: true, // Permitir cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos HTTP
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
    optionsSuccessStatus: 200, // Status para preflight
  };

  app.use(cors(corsOptions));

  // Middlewares básicos
  app.use(express.json()); // Parsear JSON

  const publicPath = path.join(__dirname, "../public");

  app.use(express.static(publicPath));

  // console.log({ publicPath });

  app.use("/api/auth", authRoutes);
  app.use("/api/events", eventsRoutes);

  //todas las demás rutas, servir el index.html para que React maneje el enrutamiento del frontend
  app.use("/{*splat}", (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
  // Conectar a la base de datos
  await connectDB();

  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
};

// Ejecutar servidor con manejo de errores
startServer().catch((error) => {
  console.error("Error fatal al iniciar el servidor:", error);
  process.exit(1); // Salir con código de error
});
