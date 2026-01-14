# API CRUD de Usuarios - Gimnasio

API REST completa para gestionar usuarios del gimnasio con operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

## 📋 Requisitos Previos

- Python 3.8 o superior
- Base de datos SQLite (gimnasio.db)

## 🚀 Instalación

1. Navega a la carpeta API:

```bash
cd API
```

2. Instala las dependencias:

```bash
pip install -r requirements.txt
```

## ▶️ Ejecutar la API

Para iniciar el servidor de desarrollo:

```bash
uvicorn main:app --reload
```

La API estará disponible en: `http://localhost:8000`

La documentación interactiva estará en: `http://localhost:8000/docs`

`:

```python
import requests
import json

BASE_URL = "http://localhost:8000"

# CREATE - Crear usuario
nuevo_usuario = {
    "nombre": "Carlos",
    "apellido": "López",
    "codigo": "GYM002",
    "departamento": "Pesas",
    "fecha_inicio": "2025-01-15",
    "fecha_fin": "2025-12-31",
    "celular": "+57 301 234 5678",
    "email": "carlos.lopez@example.com"
}

response = requests.post(f"{BASE_URL}/usuarios", json=nuevo_usuario)
print(f"Usuario creado: {response.json()}")
usuario_id = response.json()["id"]

# READ - Obtener todos los usuarios
response = requests.get(f"{BASE_URL}/usuarios")
print(f"Todos los usuarios: {response.json()}")

# READ - Obtener un usuario específico
response = requests.get(f"{BASE_URL}/usuarios/{usuario_id}")
print(f"Usuario específico: {response.json()}")

# UPDATE - Actualizar usuario
actualizacion = {
    "celular": "+57 301 999 0000",
    "direccion": "Avenida Principal 100"
}
response = requests.put(f"{BASE_URL}/usuarios/{usuario_id}", json=actualizacion)
print(f"Usuario actualizado: {response.json()}")

# DELETE - Eliminar usuario
response = requests.delete(f"{BASE_URL}/usuarios/{usuario_id}")
print(f"Usuario eliminado. Status: {response.status_code}")
```

---

## 📖 Documentación Interactiva

FastAPI genera documentación interactiva automáticamente:

- **Swagger UI**: `http://localhost:8000/docs`

  - Interfaz visual para probar todos los endpoints
  - Muestra esquemas de datos y ejemplos
  - Permite ejecutar peticiones directamente desde el navegador

- **ReDoc**: `http://localhost:8000/redoc`
  - Documentación alternativa con mejor diseño para lectura

---

## 🗂️ Estructura del Proyecto

````
API/## 📚 Documentación de Endpoints

### 1. **Crear Usuario** (CREATE)

**Endpoint:** `POST /usuarios`

**Descripción:** Crea un nuevo usuario en la base de datos.

**Body (JSON):**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "codigo": "GYM001",
  "departamento": "Cardio",
  "fecha_nacimiento": "1990-05-15",
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-12-31",
  "celular": "+57 300 123 4567",
  "email": "juan.perez@example.com",
  "direccion": "Calle 123 #45-67",
  "tipo_documento": "DNI",
  "numero_documento": "12345678"
}
````

**Ejemplo con cURL:**

```bash
curl -X POST "http://localhost:8000/usuarios" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\": \"Juan\", \"apellido\": \"Pérez\", \"codigo\": \"GYM001\", \"departamento\": \"Cardio\", \"fecha_inicio\": \"2025-01-01\", \"fecha_fin\": \"2025-12-31\", \"email\": \"juan.perez@example.com\"}"
```

**Respuesta (201 Created):**

```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "codigo": "GYM001",
  "departamento": "Cardio",
  "fecha_nacimiento": "1990-05-15",
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-12-31",
  "celular": "+57 300 123 4567",
  "email": "juan.perez@example.com",
  "direccion": "Calle 123 #45-67",
  "tipo_documento": "DNI",
  "numero_documento": "12345678",
  "created_at": "2025-01-13 10:30:00",
  "updated_at": "2025-01-13 10:30:00"
}
```

---

### 2. **Obtener Todos los Usuarios** (READ)

**Endpoint:** `GET /usuarios`

**Descripción:** Obtiene la lista de todos los usuarios.

**Parámetros de Query (opcionales):**

- `skip`: Número de registros a omitir (paginación) - Default: 0
- `limit`: Número máximo de registros - Default: 100
- `departamento`: Filtrar por departamento específico

**Ejemplo con cURL:**

```bash
curl -X GET "http://localhost:8000/usuarios"
```

**Ejemplo con filtro:**

```bash
curl -X GET "http://localhost:8000/usuarios?departamento=Cardio&limit=10"
```

**Respuesta (200 OK):**

```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "codigo": "GYM001",
    "departamento": "Cardio",
    "fecha_inicio": "2025-01-01",
    "fecha_fin": "2025-12-31",
    "email": "juan.perez@example.com",
    ...
  },
  {
    "id": 2,
    "nombre": "María",
    "apellido": "García",
    ...
  }
]
```

---

### 3. **Obtener Usuario por ID** (READ)

**Endpoint:** `GET /usuarios/{usuario_id}`

**Descripción:** Obtiene un usuario específico por su ID.

**Ejemplo con cURL:**

```bash
curl -X GET "http://localhost:8000/usuarios/1"
```

**Respuesta (200 OK):**

```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "codigo": "GYM001",
  "departamento": "Cardio",
  ...
}
```

**Respuesta si no existe (404 Not Found):**

```json
{
  "detail": "Usuario con ID 999 no encontrado"
}
```

---

### 4. **Actualizar Usuario** (UPDATE)

**Endpoint:** `PUT /usuarios/{usuario_id}`

**Descripción:** Actualiza un usuario existente. Solo se actualizan los campos proporcionados.

**Body (JSON) - Todos los campos son opcionales:**

```json
{
  "celular": "+57 300 999 8888",
  "email": "juan.nuevo@example.com",
  "direccion": "Nueva Calle 456 #78-90"
}
```

**Ejemplo con cURL:**

```bash
curl -X PUT "http://localhost:8000/usuarios/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"celular\": \"+57 300 999 8888\", \"email\": \"juan.nuevo@example.com\"}"
```

**Respuesta (200 OK):**

```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "celular": "+57 300 999 8888",
  "email": "juan.nuevo@example.com",
  "updated_at": "2025-01-13 11:45:00",
  ...
}
```

---

### 5. **Eliminar Usuario** (DELETE)

**Endpoint:** `DELETE /usuarios/{usuario_id}`

**Descripción:** Elimina un usuario por su ID.

**Ejemplo con cURL:**

```bash
curl -X DELETE "http://localhost:8000/usuarios/1"
```

**Respuesta (204 No Content):** Sin contenido (exitoso)

**Respuesta si no existe (404 Not Found):**

```json
{
  "detail": "Usuario con ID 999 no encontrado"
}
```

---

### 6. **Buscar Usuarios** (BONUS)

**Endpoint:** `GET /usuarios/buscar/{termino}`

**Descripción:** Busca usuarios por nombre, apellido o código.

**Ejemplo con cURL:**

```bash
curl -X GET "http://localhost:8000/usuarios/buscar/Juan"
```

**Respuesta (200 OK):**

```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    ...
  }
]
```

---

## 🔧 Ejemplos Completos con Python

### Usando `requests

├── main.py # Archivo principal con los endpoints
├── models.py # Modelos Pydantic (esquemas de datos)
├── database.py # Funciones para interactuar con SQLite
├── requirements.txt # Dependencias del proyecto
└── README.md # Este archivo

```

---

## ⚙️ Campos de Usuario

### Campos Requeridos:
- `nombre`: Nombre del usuario
- `apellido`: Apellido del usuario
- `departamento`: Departamento del usuario
- `fecha_inicio`: Fecha de inicio de membresía (YYYY-MM-DD)
- `fecha_fin`: Fecha de fin de membresía (YYYY-MM-DD)

### Campos Opcionales:
- `codigo`: Código único del usuario
- `fecha_nacimiento`: Fecha de nacimiento (YYYY-MM-DD)
- `celular`: Número de celular
- `email`: Correo electrónico
- `direccion`: Dirección del usuario
- `tipo_documento`: Tipo de documento (DNI, Pasaporte, etc.)
- `numero_documento`: Número de documento

### Campos Automáticos:
- `id`: ID único (autoincremental)
- `created_at`: Fecha y hora de creación
- `updated_at`: Fecha y hora de última actualización

---

## 🐛 Manejo de Errores

La API devuelve los siguientes códigos de estado HTTP:

- **200 OK**: Petición exitosa
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Recurso eliminado exitosamente
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

---

## 🛑 Detener el Servidor

Para detener el servidor, presiona `Ctrl + C` en la terminal.

---

## 💡 Consejos

1. **Usa la documentación interactiva**: Abre `http://localhost:8000/docs` para probar la API fácilmente.

2. **Validación automática**: FastAPI valida automáticamente los datos de entrada según los modelos Pydantic.

3. **Paginación**: Usa los parámetros `skip` y `limit` para paginar grandes cantidades de datos.

4. **Filtros**: Filtra por departamento usando el parámetro `departamento`.

5. **Actualización parcial**: Con PUT puedes actualizar solo los campos que necesites, no todos.

---

## 📝 Notas

- La base de datos SQLite (`gimnasio.db`) debe estar en el directorio padre de la carpeta API.
- La API se inicializa automáticamente y crea la tabla si no existe.
- Todos los timestamps se manejan automáticamente.

---

## 🤝 Soporte

Para cualquier duda o problema, consulta la documentación de FastAPI: https://fastapi.tiangolo.com/

---

**¡Listo para usar! 🎉**
```
