# Instrucciones de uso del API - Frontend

## Endpoint: `/add_faces/`

### Descripción

Este endpoint permite agregar múltiples imágenes faciales de una persona a la base de datos de reconocimiento facial. Las imágenes se asocian a un sujeto específico identificado por su nombre.

### Detalles del Endpoint

- **URL**: `http://localhost:8002/add_faces/`
- **Método**: `POST`
- **Content-Type**: `multipart/form-data`

### Parámetros

| Parámetro | Tipo   | Requerido | Descripción                                     |
| --------- | ------ | --------- | ----------------------------------------------- |
| `subject` | string | Sí        | Nombre o identificador único del sujeto/persona |
| `images`  | File[] | Sí        | Array de archivos de imagen (JPEG, PNG)         |

### Respuesta Exitosa

**Status Code**: `200 OK`

```json
{
  "message": "Se procesaron 3 de 3 imágenes para 'Juan Pérez'",
  "subject": "Juan Pérez",
  "successful": 3,
  "failed": 0,
  "details": [
    {
      "file": "foto1.jpg",
      "size": 245678,
      "status": "success"
    },
    {
      "file": "foto2.jpg",
      "size": 198432,
      "status": "success"
    },
    {
      "file": "foto3.jpg",
      "size": 312456,
      "status": "success"
    }
  ]
}
```

### Respuesta con Errores Parciales

**Status Code**: `200 OK` (algunas imágenes se procesaron correctamente)

```json
{
  "message": "Se procesaron 2 de 3 imágenes para 'Juan Pérez'",
  "subject": "Juan Pérez",
  "successful": 2,
  "failed": 1,
  "details": [
    {
      "file": "foto1.jpg",
      "size": 245678,
      "status": "success"
    },
    {
      "file": "foto2.jpg",
      "size": 198432,
      "status": "success"
    }
  ],
  "errors": [
    {
      "file": "foto3.jpg",
      "error": "Archivo muy grande (12000000 bytes). Máximo: 10485760 bytes"
    }
  ]
}
```

### Códigos de Error Posibles

- `400 Bad Request`: Validación fallida (formato, tamaño, parámetros inválidos)
- `422 Unprocessable Entity`: Parámetros faltantes o estructura inválida
- `503 Service Unavailable`: CompreFace no disponible
- `500 Internal Server Error`: Error interno del servidor

### Límites y Validaciones

- **Tamaño máximo por imagen**: 10 MB
- **Máximo de imágenes por solicitud**: 10
- **Formatos permitidos**: JPG, JPEG, PNG
- **Longitud del nombre del sujeto**: 1-100 caracteres
- Los archivos vacíos serán rechazados
- Los nombres de archivo deben ser válidos

---

## Ejemplo de Implementación Frontend

### JavaScript Vanilla / Fetch API

```javascript
async function addFaces(subjectName, imageFiles) {
  const formData = new FormData();

  // Agregar el nombre del sujeto
  formData.append("subject", subjectName);

  // Agregar todas las imágenes
  imageFiles.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const response = await fetch("http://localhost:8002/add_faces/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail?.message ||
          errorData.detail ||
          "Error al subir imágenes"
      );
    }

    const data = await response.json();
    console.log("Éxito:", data.message);

    // Verificar si hay errores parciales
    if (data.errors && data.errors.length > 0) {
      console.warn("Algunas imágenes tuvieron errores:", data.errors);
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Uso ejemplo con input file
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const subject = document.getElementById("subjectInput").value.trim();
  const files = document.getElementById("imageInput").files;

  if (!subject) {
    alert("Por favor ingresa el nombre del sujeto");
    return;
  }

  if (files.length === 0) {
    alert("Por favor selecciona al menos una imagen");
    return;
  }

  if (files.length > 10) {
    alert("Máximo 10 imágenes por vez");
    return;
  }

  try {
    const result = await addFaces(subject, Array.from(files));

    // Mostrar resultado
    let message = result.message;
    if (result.errors && result.errors.length > 0) {
      message +=
        "\n\nErrores:\n" +
        result.errors.map((e) => `- ${e.file}: ${e.error}`).join("\n");
    }
    alert(message);

    // Limpiar formulario si todo fue exitoso
    if (result.failed === 0) {
      document.getElementById("uploadForm").reset();
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
});
```

### HTML correspondiente

```html
<form id="uploadForm">
  <div>
    <label for="subjectInput">Nombre del sujeto:</label>
    <input type="text" id="subjectInput" required placeholder="Juan Pérez" />
  </div>

  <div>
    <label for="imageInput">Imágenes (múltiples):</label>
    <input type="file" id="imageInput" multiple accept="image/*" required />
  </div>

  <button type="submit">Subir Imágenes</button>
</form>
```

---

### React / Next.js

```jsx
import { useState } from "react";

function FaceUploadForm() {
  const [subject, setSubject] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedSubject = subject.trim();

    if (!trimmedSubject) {
      alert("Por favor ingresa el nombre del sujeto");
      return;
    }

    if (files.length === 0) {
      alert("Por favor selecciona al menos una imagen");
      return;
    }

    if (files.length > 10) {
      alert("Máximo 10 imágenes por vez");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("subject", subject);

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://localhost:8002/add_faces/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail?.message ||
            errorData.detail ||
            "Error al subir imágenes"
        );
      }

      const data = await response.json();

      // Construir mensaje con detalles
      let displayMessage = data.message;
      if (data.errors && data.errors.length > 0) {
        displayMessage +=
          "\n\nAlgunas imágenes tuvieron errores:\n" +
          data.errors.map((e) => `• ${e.file}: ${e.error}`).join("\n");
      }

      setMessage(displayMessage);

      // Limpiar formulario solo si todas fueron exitosas
      if (data.failed === 0) {
        setSubject("");
        setFiles([]);
        e.target.reset();
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Nombre del sujeto:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Juan Pérez"
          />
        </label>
      </div>

      <div>
        <label>
          Imágenes (máximo 10):
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => setFiles(Array.from(e.target.files))}
            required
          />
        </label>
        {files.length > 0 && (
          <p style={{ fontSize: "0.9em", color: "#666" }}>
            {files.length} archivo(s) seleccionado(s)
          </p>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Subiendo..." : "Subir Imágenes"}
      </button>

      {message && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            padding: "10px",
            backgroundColor: message.includes("Error") ? "#fee" : "#efe",
            borderRadius: "4px",
          }}
        >
          {message}
        </pre>
      )}
    </form>
  );
}

export default FaceUploadForm;
```

---

### Axios (JavaScript/TypeScript)

```javascript
import axios from "axios";

async function addFaces(subjectName, imageFiles) {
  const formData = new FormData();
  formData.append("subject", subjectName);

  imageFiles.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const response = await axios.post(
      "http://localhost:8002/add_faces/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Éxito:", response.data.message);

    // Verificar errores parciales
    if (response.data.errors && response.data.errors.length > 0) {
      console.warn("Algunas imágenes tuvieron errores:", response.data.errors);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de error
      const errorMsg =
        error.response.data?.detail?.message ||
        error.response.data?.detail ||
        "Error al procesar las imágenes";
      console.error("Error:", errorMsg);
      throw new Error(errorMsg);
    } else {
      console.error("Error:", error.message);
      throw error;
    }
  }
}
```

---

## Consideraciones Importantes

### 1. CORS

Si tu frontend está en un dominio diferente, necesitarás configurar CORS en el backend:

```python
# Agregar en main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Tamaño de Archivos

Verifica los límites de tamaño de archivo tanto en el frontend como en el backend.

### 3. Formatos de Imagen Soportados

- JPEG (.jpg, .jpeg)
- PNG (.png)

### 4. Buenas Prácticas

- Valida las imágenes en el frontend antes de enviarlas (tamaño, formato)
- Verifica que el usuario ingrese un nombre de sujeto válido
- Muestra una vista previa de las imágenes antes de subirlas
- Implementa un indicador de progreso para mejorar la UX
- Maneja los errores de forma apropiada mostrando mensajes claros
- Limita el número de imágenes por solicitud (máximo 10)
- Comprime imágenes muy grandes antes de subirlas
- Verifica `response.ok` antes de procesar la respuesta

### 5. Ejemplo de Validación en Frontend

```javascript
function validateImages(files) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
  const errors = [];

  if (files.length > 10) {
    errors.push("Máximo 10 imágenes permitidas");
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: Formato no permitido. Use JPG o PNG`);
    }
    if (file.size > MAX_SIZE) {
      errors.push(`${file.name}: Archivo muy grande (máx 10MB)`);
    }
    if (file.size === 0) {
      errors.push(`${file.name}: Archivo vacío`);
    }
  }

  return errors;
}

// Uso en el formulario
const files = Array.from(fileInput.files);
const validationErrors = validateImages(files);

if (validationErrors.length > 0) {
  alert("Errores de validación:\n" + validationErrors.join("\n"));
  return;
}
```

### 6. Nuevos Endpoints Disponibles

**Health Check**: `GET http://localhost:8002/health`

```json
{
  "status": "healthy",
  "compreface": "connected",
  "upload_dir": true
}
```

**Root**: `GET http://localhost:8002/`

```json
{
  "status": "online",
  "message": "Face Recognition API is running",
  "version": "1.0.0"
}
```

### 7. Testing

Puedes probar el endpoint usando cURL:

```bash
curl -X POST "http://localhost:8002/add_faces/" \
  -F "subject=Juan Perez" \
  -F "images=@/ruta/a/imagen1.jpg" \
  -F "images=@/ruta/a/imagen2.jpg"
```

O usando Postman:

1. Selecciona método POST
2. URL: `http://localhost:8002/add_faces/`
3. En Body, selecciona `form-data`
4. Agrega key `subject` (tipo Text) con el nombre
5. Agrega key `images` (tipo File) y selecciona múltiples archivos

---

## Documentación API Interactiva

FastAPI genera documentación automática. Accede a:

- **Swagger UI**: http://localhost:8002/docs
- **ReDoc**: http://localhost:8002/redoc
