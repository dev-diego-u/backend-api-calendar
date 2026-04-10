# Backend - API Events

Este proyecto es un backend para manejar eventos a través de una API RESTful. Permite crear, leer, actualizar y eliminar eventos, así como gestionar la autenticación de usuarios.

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

# 1. Clona el repositorio

```bash
git clone https://github.com/usuario/tu-proyecto.git
cd tu-proyecto
```

# 2. Instala las dependencias

```bash
npm install
```

# 3. Configura las variables de entorno

```bash
cp .env.template .env
# Edita el archivo .env con tus configuraciones
```

# 4. Inicia el servidor

```bash
npm start
```

## Endpoints

- `POST /api/auth/register`: Registrar un nuevo usuario.
- `POST /api/auth/login`: Iniciar sesión y obtener un token JWT.
- `GET /api/events`: Obtener todos los eventos (requiere autenticación).
- `POST /api/events`: Crear un nuevo evento (requiere autenticación).
- `GET /api/events/:id`: Obtener un evento por ID (requiere autenticación).
- `PUT /api/events/:id`: Actualizar un evento por ID (requiere autenticación).
- `DELETE /api/events/:id`: Eliminar un evento por ID (requiere autenticación).
