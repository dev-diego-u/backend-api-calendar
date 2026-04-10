# Códigos de Estado HTTP (Status Codes)

Guía de referencia de códigos HTTP y cuándo usarlos en el backend.

---

## 2xx - Respuestas Exitosas

### **200 OK**

- **Significado**: La solicitud fue exitosa
- **Cuándo usar**:
  - GET: Recursos obtenidos correctamente
  - PUT: Recurso actualizado exitosamente
  - Operaciones generales exitosas
- **Ejemplo**: Login exitoso, obtener lista de eventos

### **201 Created**

- **Significado**: El recurso fue creado exitosamente
- **Cuándo usar**:
  - POST: Cuando se crea un nuevo recurso
- **Ejemplo**: Registro de nuevo usuario, crear un evento
- **Buena práctica**: Incluir el recurso creado en la respuesta

### **204 No Content**

- **Significado**: Exitoso pero sin contenido para retornar
- **Cuándo usar**:
  - DELETE: Recurso eliminado correctamente
  - PUT/PATCH: Actualización exitosa sin retornar datos
- **Ejemplo**: Eliminar un evento, actualizar sin retornar el objeto

---

## 3xx - Redirecciones

### **301 Moved Permanently**

- **Significado**: El recurso se movió permanentemente a una nueva URL
- **Cuándo usar**: Cambios permanentes de endpoints

### **304 Not Modified**

- **Significado**: El recurso no ha cambiado desde la última petición
- **Cuándo usar**: Optimización de caché (raro en APIs REST modernas)

---

## 4xx - Errores del Cliente

### **400 Bad Request**

- **Significado**: La solicitud es inválida o malformada
- **Cuándo usar**:
  - Validación de datos falló
  - Formato de JSON inválido
  - Parámetros requeridos faltantes
- **Ejemplo**: Email sin formato válido, campos requeridos vacíos

### **401 Unauthorized**

- **Significado**: No autenticado (falta credenciales o token)
- **Cuándo usar**:
  - Usuario no ha iniciado sesión
  - Token JWT inválido o expirado
  - Credenciales incorrectas
- **Ejemplo**: Intentar acceder sin token, login con password incorrecto

### **403 Forbidden**

- **Significado**: Autenticado pero sin permisos (prohibido)
- **Cuándo usar**:
  - Usuario autenticado pero sin privilegios para la acción
  - Acceso denegado a recurso de otro usuario
- **Ejemplo**: Usuario normal intentando acceder a panel de admin

### **404 Not Found**

- **Significado**: El recurso no existe
- **Cuándo usar**:
  - ID de recurso no encontrado en la base de datos
  - Endpoint no existe
- **Ejemplo**: Buscar evento con ID inexistente

### **409 Conflict**

- **Significado**: Conflicto con el estado actual del recurso
- **Cuándo usar**:
  - Violación de restricción única (email duplicado)
  - Conflicto de versiones
  - Intentar crear algo que ya existe
- **Ejemplo**: Registrar email que ya existe

### **422 Unprocessable Entity**

- **Significado**: Sintaxis correcta pero validación semántica falló
- **Cuándo usar**:
  - Validaciones de negocio fallaron
  - Datos técnicamente válidos pero lógicamente incorrectos
- **Ejemplo**: Fecha de inicio posterior a fecha de fin

### **429 Too Many Requests**

- **Significado**: El cliente ha enviado demasiadas solicitudes
- **Cuándo usar**:
  - Rate limiting activado
  - Protección contra ataques
- **Ejemplo**: Más de 100 requests por minuto

---

## 5xx - Errores del Servidor

### **500 Internal Server Error**

- **Significado**: Error genérico del servidor
- **Cuándo usar**:
  - Errores no controlados (try-catch)
  - Fallas inesperadas del servidor
  - Error de base de datos
- **Ejemplo**: Conexión a DB fallida, error no manejado en catch

### **502 Bad Gateway**

- **Significado**: El servidor actuando como gateway recibió respuesta inválida
- **Cuándo usar**:
  - Proxy o gateway con problemas
  - Servicio externo no responde correctamente

### **503 Service Unavailable**

- **Significado**: El servidor no está disponible temporalmente
- **Cuándo usar**:
  - Mantenimiento programado
  - Servidor sobrecargado
- **Ejemplo**: Base de datos caída, servidor en mantenimiento

### **504 Gateway Timeout**

- **Significado**: El servidor gateway no recibió respuesta a tiempo
- **Cuándo usar**:
  - Timeout en servicios externos
  - Operación demoró demasiado

---

## Casos de Uso Comunes en el Proyecto

### Autenticación (Login)

```typescript
// ✅ Credenciales correctas
return res.status(200).json({ ok: true, token, user });

// ❌ Email o password incorrectos
return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

// ❌ Validación falló (email sin formato correcto)
return res.status(400).json({ ok: false, message: "Email inválido" });
```

### Registro de Usuario

```typescript
// ✅ Usuario creado
return res.status(201).json({ ok: true, user });

// ❌ Email ya registrado
return res
  .status(409)
  .json({ ok: false, message: "El email ya está registrado" });

// ❌ Campos faltantes
return res
  .status(400)
  .json({ ok: false, message: "Nombre, email y password son requeridos" });

// ❌ Error del servidor
return res.status(500).json({ ok: false, message: "Error en el servidor" });
```

### Obtener Recursos (GET)

```typescript
// ✅ Recursos encontrados
return res.status(200).json({ ok: true, events });

// ❌ Recurso no encontrado
return res.status(404).json({ ok: false, message: "Evento no encontrado" });

// ❌ Sin autenticación
return res.status(401).json({ ok: false, message: "Token no válido" });
```

### Actualizar Recurso (PUT/PATCH)

```typescript
// ✅ Actualizado correctamente
return res.status(200).json({ ok: true, event });

// ❌ No encontrado
return res.status(404).json({ ok: false, message: "Evento no encontrado" });

// ❌ No es el dueño del recurso
return res
  .status(403)
  .json({ ok: false, message: "No tienes permiso para editar este evento" });
```

### Eliminar Recurso (DELETE)

```typescript
// ✅ Eliminado correctamente
return res.status(200).json({ ok: true, message: "Evento eliminado" });
// o
return res.status(204).send();

// ❌ No encontrado
return res.status(404).json({ ok: false, message: "Evento no encontrado" });

// ❌ No autorizado
return res
  .status(403)
  .json({ ok: false, message: "No puedes eliminar este evento" });
```

---

## Reglas Generales

1. **2xx = Éxito**: Usa 200 para la mayoría, 201 para creación, 204 si no retornas datos
2. **4xx = Error del cliente**: El cliente hizo algo mal (datos incorrectos, no autorizado, etc.)
3. **5xx = Error del servidor**: Nuestro servidor tiene un problema

## Diferencias Clave

- **400 vs 422**: 400 es formato inválido, 422 es validación de negocio
- **401 vs 403**: 401 es "no sé quién eres", 403 es "sé quién eres pero no puedes hacer esto"
- **404 vs 400**: 404 es recurso no existe, 400 es datos de solicitud inválidos
- **409 vs 400**: 409 es conflicto con estado existente (ej: email duplicado)

---

## Referencias

- [Lista completa de códigos HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Status)
- [RFC 7231 - HTTP Status Codes](https://tools.ietf.org/html/rfc7231#section-6)
