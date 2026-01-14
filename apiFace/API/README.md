# 🎯 Face Recognition API - Guía Rápida

API completa de reconocimiento facial con CompreFace, soporte para HTTPS y reconocimiento en tiempo real con webcam.

## 🚀 Inicio Rápido

### 1. Ejecutar con HTTP (Recomendado para desarrollo y webcam)

```bash
python run_dev.py
```

**Características:**

- ✅ Puerto: 8001
- ✅ Recarga automática
- ✅ Ideal para desarrollo local
- ✅ Compatible con endpoints de webcam

**URLs:**

- API: http://localhost:8001
- Docs: http://localhost:8001/docs
- Demo Webcam: Abre `webcam_demo.html` en tu navegador

### 2. Ejecutar con HTTPS

```bash
# Generar certificados SSL (solo la primera vez)
python generate_cert.py

# Iniciar servidor HTTPS
python run_https.py
```

**Características:**

- ✅ Puerto: 8002
- ✅ SSL/TLS habilitado
- ✅ Certificados autofirmados para desarrollo

**URLs:**

- API: https://localhost:8002
- Docs: https://localhost:8002/docs

---

## 📚 Endpoints Disponibles

### 🔐 Generales

| Método | Endpoint  | Descripción               |
| ------ | --------- | ------------------------- |
| GET    | `/`       | Estado del API            |
| GET    | `/health` | Health check              |
| GET    | `/docs`   | Documentación interactiva |

### 👥 Gestión de Caras

| Método | Endpoint      | Descripción                               |
| ------ | ------------- | ----------------------------------------- |
| POST   | `/add_faces/` | Agregar múltiples imágenes de una persona |

### 📹 Webcam (Tiempo Real)

| Método | Endpoint              | Descripción                     |
| ------ | --------------------- | ------------------------------- |
| POST   | `/webcam/start`       | Iniciar captura de webcam       |
| POST   | `/webcam/stop`        | Detener captura de webcam       |
| GET    | `/webcam/status`      | Verificar estado de webcam      |
| GET    | `/webcam/stream`      | Stream de video MJPEG           |
| GET    | `/webcam/recognition` | Datos de reconocimiento en JSON |

---

## 🎥 Usar Webcam desde el Frontend

### Ejemplo JavaScript Básico

```javascript
const API_URL = "http://localhost:8001";

// 1. Iniciar webcam
await fetch(`${API_URL}/webcam/start`, { method: "POST" });

// 2. Mostrar video
document.getElementById("video").src = `${API_URL}/webcam/stream`;

// 3. Obtener datos de reconocimiento
setInterval(async () => {
  const res = await fetch(`${API_URL}/webcam/recognition`);
  const data = await res.json();

  if (data.faces_count > 0) {
    data.faces.forEach((face) => {
      if (face.recognized) {
        console.log(`Detectado: ${face.best_match.name}`);
        console.log(`Similitud: ${face.best_match.similarity}`);
      }
    });
  }
}, 500);

// 4. Detener webcam
await fetch(`${API_URL}/webcam/stop`, { method: "POST" });
```

### Ejemplo React

```jsx
function WebcamRecognition() {
  const [isActive, setIsActive] = useState(false);
  const [faces, setFaces] = useState([]);

  const startWebcam = async () => {
    await fetch("http://localhost:8001/webcam/start", { method: "POST" });
    setIsActive(true);

    // Polling de datos
    const interval = setInterval(async () => {
      const res = await fetch("http://localhost:8001/webcam/recognition");
      const data = await res.json();
      setFaces(data.faces);
    }, 500);

    return () => clearInterval(interval);
  };

  return (
    <div>
      <button onClick={startWebcam}>Iniciar Cámara</button>

      {isActive && (
        <img src="http://localhost:8001/webcam/stream" alt="Stream" />
      )}

      {faces.map((face, i) => (
        <div key={i}>
          {face.recognized
            ? `✅ ${face.best_match.name} (${(
                face.best_match.similarity * 100
              ).toFixed(1)}%)`
            : "❓ Desconocido"}
        </div>
      ))}
    </div>
  );
}
```

---

## 📦 Estructura de Respuesta - Reconocimiento

```json
{
  "status": "active",
  "timestamp": 1705234567.123,
  "faces_count": 1,
  "faces": [
    {
      "box": {
        "x_min": 100,
        "y_min": 50,
        "x_max": 300,
        "y_max": 250
      },
      "recognized": true,
      "best_match": {
        "name": "Juan Pérez",
        "similarity": 0.9875
      },
      "subjects": [
        {
          "name": "Juan Pérez",
          "similarity": 0.9875
        }
      ],
      "age": {
        "low": 25,
        "high": 32
      },
      "gender": {
        "value": "male",
        "probability": 0.99
      }
    }
  ]
}
```

---

## 🎨 Demo Visual

Incluimos un demo HTML completo. Para usarlo:

1. Inicia el servidor:

   ```bash
   python run_dev.py
   ```

2. Abre en tu navegador:

   ```bash
   # Windows
   start webcam_demo.html

   # macOS
   open webcam_demo.html

   # Linux
   xdg-open webcam_demo.html
   ```

O simplemente haz doble clic en `webcam_demo.html`.

**Características del Demo:**

- ✅ Interfaz visual moderna
- ✅ Stream de video en tiempo real
- ✅ Datos de reconocimiento actualizados
- ✅ Indicadores de similitud con colores
- ✅ Información de edad y género
- ✅ Botones para iniciar/detener cámara

---

## 📝 Agregar Personas a la Base de Datos

### Desde cURL

```bash
curl -X POST "http://localhost:8001/add_faces/" \
  -F "subject=Juan Perez" \
  -F "images=@foto1.jpg" \
  -F "images=@foto2.jpg" \
  -F "images=@foto3.jpg"
```

### Desde Python

```python
import requests

files = [
    ('images', open('foto1.jpg', 'rb')),
    ('images', open('foto2.jpg', 'rb')),
    ('images', open('foto3.jpg', 'rb'))
]

data = {'subject': 'Juan Perez'}

response = requests.post(
    'http://localhost:8001/add_faces/',
    files=files,
    data=data
)

print(response.json())
```

### Desde la Documentación Interactiva

1. Ve a http://localhost:8001/docs
2. Busca el endpoint `/add_faces/`
3. Click en "Try it out"
4. Completa los campos y sube las imágenes
5. Click en "Execute"

---

## 🔧 Configuración

### Cambiar Puerto

**HTTP:**
Edita `run_dev.py` línea:

```python
port=8001,  # Cambiar a tu puerto deseado
```

**HTTPS:**
Edita `run_https.py` línea:

```python
port=8002,  # Cambiar a tu puerto deseado
```

### Ajustar Frecuencia de Reconocimiento

En `main.py`, clase `WebcamManager`:

```python
self.recognition_interval = 0.5  # Segundos entre reconocimientos
```

### Ajustar Resolución de Webcam

En `main.py`, método `WebcamManager.start()`:

```python
self.capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)   # Ancho
self.capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)  # Alto
```

### Configurar CORS

En `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://localhost:5173",
        "http://tu-dominio.com",  # Agrega tus dominios aquí
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📚 Documentación Detallada

- **[README_HTTPS.md](README_HTTPS.md)** - Guía completa de HTTPS y certificados SSL
- **[README_WEBCAM.md](README_WEBCAM.md)** - Documentación detallada de endpoints de webcam
- **[FRONTEND_INSTRUCTIONS.md](FRONTEND_INSTRUCTIONS.md)** - Instrucciones para el frontend

---

## 🐛 Solución de Problemas

### La webcam no inicia

**Causas comunes:**

- Otra aplicación está usando la webcam (Zoom, Teams, etc.)
- La webcam no está conectada
- Permisos de cámara no otorgados (Windows)

**Solución:**

1. Cierra todas las aplicaciones que usen la cámara
2. Verifica que la cámara esté conectada
3. En Windows: Configuración → Privacidad → Cámara → Permitir acceso

### Error de CORS

**Síntoma:**

```
Access to fetch at 'http://localhost:8001/...' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

**Solución:**
Agrega tu dominio frontend a la lista de CORS en `main.py` (ver sección Configuración arriba).

### El stream se ve lento

**Soluciones:**

- Reduce la resolución de la webcam
- Aumenta el intervalo de reconocimiento
- Reduce la calidad JPEG del stream

### Error: ModuleNotFoundError

```bash
# Instala las dependencias faltantes
pip install opencv-python sse-starlette pyOpenSSL
```

---

## 📊 Interpretación de Similitud

| Rango       | Confianza | Uso Recomendado           |
| ----------- | --------- | ------------------------- |
| 0.95 - 1.0  | Muy alta  | Control de acceso crítico |
| 0.85 - 0.95 | Alta      | Registro de asistencia    |
| 0.70 - 0.85 | Media     | Sugerencias               |
| < 0.70      | Baja      | No confiable              |

---

## 🔒 Notas de Seguridad

⚠️ **Importante:**

- Los endpoints de webcam están diseñados para **uso local** únicamente
- No expongas estos endpoints directamente a internet sin autenticación
- Cumple con las leyes de privacidad y protección de datos
- En producción, usa HTTPS y autenticación adecuada

---

## 📞 Comandos Útiles

```bash
# Desarrollo HTTP (recomendado)
python run_dev.py

# Desarrollo HTTPS
python run_https.py

# Generar certificados SSL
python generate_cert.py

# Ejecutar con uvicorn directamente
uvicorn main:app --reload --port 8001

# Instalar dependencias
pip install opencv-python sse-starlette pyOpenSSL fastapi uvicorn python-multipart compreface-sdk
```

---

## 🎯 Casos de Uso

### 1. Control de Acceso

```javascript
const verificarAcceso = async () => {
  const res = await fetch("http://localhost:8001/webcam/recognition");
  const data = await res.json();

  if (
    data.faces_count === 1 &&
    data.faces[0].recognized &&
    data.faces[0].best_match.similarity >= 0.9
  ) {
    return { acceso: true, nombre: data.faces[0].best_match.name };
  }

  return { acceso: false };
};
```

### 2. Registro de Asistencia

```javascript
const registrarAsistencia = async () => {
  const res = await fetch("http://localhost:8001/webcam/recognition");
  const data = await res.json();

  const personas = data.faces
    .filter((f) => f.recognized && f.best_match.similarity >= 0.85)
    .map((f) => ({
      nombre: f.best_match.name,
      similitud: f.best_match.similarity,
      timestamp: new Date().toISOString(),
    }));

  // Guardar en tu base de datos
  await fetch("/api/asistencia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personas),
  });
};
```

### 3. Búsqueda de Persona Específica

```javascript
const buscarPersona = async (nombreBuscado) => {
  const res = await fetch("http://localhost:8001/webcam/recognition");
  const data = await res.json();

  const encontrada = data.faces.find(
    (face) =>
      face.recognized &&
      face.best_match.name === nombreBuscado &&
      face.best_match.similarity >= 0.85
  );

  return encontrada !== undefined;
};
```

---

## ✅ Checklist de Implementación

- [ ] Servidor CompreFace corriendo en http://localhost:8000
- [ ] Dependencias instaladas (`pip install opencv-python sse-starlette`)
- [ ] API iniciada (`python run_dev.py`)
- [ ] Al menos una persona agregada con `/add_faces/`
- [ ] Webcam conectada y funcionando
- [ ] Permisos de cámara otorgados
- [ ] CORS configurado para tu frontend
- [ ] Demo HTML abierto y funcionando

---

## 🎓 Recursos Adicionales

- **CompreFace Docs:** https://github.com/exadel-inc/CompreFace
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **OpenCV Docs:** https://docs.opencv.org/

---

## 📧 Soporte

Para reportar problemas o sugerir mejoras, revisa:

1. Esta documentación
2. Los archivos README específicos (HTTPS, WEBCAM)
3. La documentación interactiva en `/docs`

---

**¡Listo para usar! 🚀**

Inicia el servidor y abre el demo HTML para ver el reconocimiento facial en acción.
