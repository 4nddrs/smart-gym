# 📹 API de Reconocimiento Facial con Webcam

## Endpoints de Webcam

### 1. **POST** `/webcam/start`

Inicia la captura de la webcam para reconocimiento facial en tiempo real.

**Respuesta exitosa:**

```json
{
  "status": "success",
  "message": "Webcam iniciada"
}
```

**Errores posibles:**

- `already_running`: La webcam ya está en uso
- `error`: No se pudo abrir la webcam

---

### 2. **POST** `/webcam/stop`

Detiene la captura de la webcam y libera los recursos.

**Respuesta:**

```json
{
  "status": "success",
  "message": "Webcam detenida"
}
```

---

### 3. **GET** `/webcam/status`

Verifica si la webcam está activa.

**Respuesta:**

```json
{
  "is_running": true,
  "status": "active"
}
```

---

### 4. **GET** `/webcam/stream`

Stream de video en tiempo real con reconocimiento facial (formato MJPEG).

**Uso en HTML:**

```html
<img src="http://localhost:8001/webcam/stream" alt="Video stream" />
```

**Características:**

- Transmite video a ~30 FPS
- Muestra recuadros verdes alrededor de caras detectadas
- Muestra el nombre y similitud de personas reconocidas
- Marca como "Desconocido" si la persona no está en la base de datos

**Error:**

- `400`: Si la webcam no está activa (usa `/webcam/start` primero)

---

### 5. **GET** `/webcam/recognition`

Obtiene los datos de reconocimiento facial actuales en formato JSON.

**Respuesta cuando está activa:**

```json
{
  "status": "active",
  "timestamp": 1705234567.123,
  "faces_count": 2,
  "faces": [
    {
      "box": {
        "x_min": 100,
        "y_min": 50,
        "x_max": 300,
        "y_max": 250
      },
      "age": {
        "low": 25,
        "high": 32
      },
      "gender": {
        "value": "male",
        "probability": 0.99
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
      ]
    },
    {
      "box": {
        "x_min": 400,
        "y_min": 80,
        "x_max": 600,
        "y_max": 280
      },
      "recognized": false,
      "subjects": []
    }
  ]
}
```

**Respuesta cuando está inactiva:**

```json
{
  "status": "inactive",
  "message": "La webcam no está activa",
  "faces": []
}
```

---

## 🚀 Flujo de Uso

### Desde el Frontend (JavaScript/React/Vue/etc.)

```javascript
const API_URL = "http://localhost:8001";

// 1. Iniciar la webcam
async function iniciarCamara() {
  const response = await fetch(`${API_URL}/webcam/start`, {
    method: "POST",
  });
  const data = await response.json();
  console.log(data); // { status: "success", message: "Webcam iniciada" }
}

// 2. Mostrar el stream de video
function mostrarVideo() {
  const videoElement = document.getElementById("video");
  videoElement.src = `${API_URL}/webcam/stream`;
}

// 3. Obtener datos de reconocimiento cada 500ms
function iniciarRecognition() {
  setInterval(async () => {
    const response = await fetch(`${API_URL}/webcam/recognition`);
    const data = await response.json();

    if (data.status === "active" && data.faces_count > 0) {
      data.faces.forEach((face) => {
        if (face.recognized) {
          console.log(`Persona detectada: ${face.best_match.name}`);
          console.log(`Similitud: ${face.best_match.similarity * 100}%`);
        } else {
          console.log("Persona no reconocida");
        }
      });
    }
  }, 500);
}

// 4. Detener la webcam
async function detenerCamara() {
  const response = await fetch(`${API_URL}/webcam/stop`, {
    method: "POST",
  });
  const data = await response.json();
  console.log(data); // { status: "success", message: "Webcam detenida" }
}
```

---

## 📋 Ejemplo Completo - React

```jsx
import { useState, useEffect, useRef } from "react";

function WebcamRecognition() {
  const [isActive, setIsActive] = useState(false);
  const [recognitionData, setRecognitionData] = useState(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const API_URL = "http://localhost:8001";

  const startWebcam = async () => {
    try {
      const response = await fetch(`${API_URL}/webcam/start`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.status === "success" || data.status === "already_running") {
        setIsActive(true);

        // Iniciar polling de datos
        intervalRef.current = setInterval(async () => {
          const res = await fetch(`${API_URL}/webcam/recognition`);
          const recData = await res.json();
          setRecognitionData(recData);
        }, 500);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stopWebcam = async () => {
    try {
      await fetch(`${API_URL}/webcam/stop`, { method: "POST" });
      setIsActive(false);
      setRecognitionData(null);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h1>Reconocimiento Facial</h1>

      <div>
        <button onClick={startWebcam} disabled={isActive}>
          Iniciar Cámara
        </button>
        <button onClick={stopWebcam} disabled={!isActive}>
          Detener Cámara
        </button>
      </div>

      {isActive && (
        <img
          ref={videoRef}
          src={`${API_URL}/webcam/stream`}
          alt="Video stream"
          style={{ width: "100%", maxWidth: "640px" }}
        />
      )}

      {recognitionData && recognitionData.faces_count > 0 && (
        <div>
          <h2>Caras Detectadas: {recognitionData.faces_count}</h2>
          {recognitionData.faces.map((face, index) => (
            <div key={index}>
              {face.recognized ? (
                <p>
                  ✅ {face.best_match.name}({(
                    face.best_match.similarity * 100
                  ).toFixed(1)}%)
                </p>
              ) : (
                <p>❓ Persona no reconocida</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WebcamRecognition;
```

---

## 🎯 Casos de Uso

### 1. Control de Acceso

```javascript
// Verificar si la persona está autorizada
const verificarAcceso = async () => {
  const response = await fetch(`${API_URL}/webcam/recognition`);
  const data = await response.json();

  if (data.faces_count === 1) {
    const face = data.faces[0];

    if (face.recognized && face.best_match.similarity >= 0.85) {
      // Persona autorizada
      console.log(`Acceso concedido a: ${face.best_match.name}`);
      return true;
    }
  }

  console.log("Acceso denegado");
  return false;
};
```

### 2. Registro de Asistencia

```javascript
// Marcar asistencia automáticamente
const registrarAsistencia = async () => {
  const response = await fetch(`${API_URL}/webcam/recognition`);
  const data = await response.json();

  if (data.faces_count > 0) {
    data.faces.forEach((face) => {
      if (face.recognized) {
        // Registrar en tu base de datos
        fetch("/api/asistencia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: face.best_match.name,
            similitud: face.best_match.similarity,
            timestamp: new Date().toISOString(),
          }),
        });
      }
    });
  }
};
```

### 3. Detección en Tiempo Real

```javascript
// Alertar cuando se detecta una persona específica
const monitorearPersona = (nombreBuscado) => {
  setInterval(async () => {
    const response = await fetch(`${API_URL}/webcam/recognition`);
    const data = await response.json();

    const encontrada = data.faces.find(
      (face) => face.recognized && face.best_match.name === nombreBuscado
    );

    if (encontrada) {
      alert(`¡${nombreBuscado} detectado!`);
    }
  }, 1000);
};
```

---

## 🎨 Demo HTML

Abre el archivo `webcam_demo.html` en tu navegador para ver una demostración completa:

```bash
# Desde la carpeta API
start webcam_demo.html  # Windows
open webcam_demo.html   # macOS
xdg-open webcam_demo.html  # Linux
```

O simplemente haz doble clic en el archivo.

---

## ⚙️ Configuración

### Ajustar Intervalo de Reconocimiento

En `main.py`, puedes modificar la frecuencia de reconocimiento:

```python
class WebcamManager:
    def __init__(self):
        # ...
        self.recognition_interval = 0.5  # Cambiar a 1.0 para reconocer cada segundo
```

### Ajustar Calidad del Stream

```python
# En el endpoint /webcam/stream
_, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
# Cambiar 85 a un valor entre 1-100 (mayor = mejor calidad, más ancho de banda)
```

### Ajustar Resolución de la Webcam

```python
# En WebcamManager.start()
self.capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)  # Cambiar a 1280 para HD
self.capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480) # Cambiar a 720 para HD
```

---

## 🐛 Solución de Problemas

### Error: "No se pudo abrir la webcam"

**Causa:** La webcam está en uso por otra aplicación o no está conectada.

**Solución:**

1. Cierra otras aplicaciones que usen la webcam (Zoom, Teams, Skype, etc.)
2. Verifica que tu webcam esté conectada
3. En Windows, verifica los permisos de la cámara en Configuración

### El stream se ve lento

**Solución:**

- Reduce la resolución de la webcam
- Reduce la calidad JPEG del stream
- Aumenta el intervalo de reconocimiento

### Error: CORS

**Solución:**
Asegúrate de que tu dominio frontend esté en la lista de CORS en `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://tu-dominio.com"  # Agregar aquí
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Interpretación de Datos

### Similitud (Similarity)

- **0.95 - 1.0**: Coincidencia casi perfecta
- **0.85 - 0.95**: Muy probable que sea la persona
- **0.70 - 0.85**: Coincidencia razonable
- **< 0.70**: Baja confianza, podría no ser la persona

### Recomendaciones

- Para **control de acceso crítico**: usar threshold ≥ 0.90
- Para **registro de asistencia**: usar threshold ≥ 0.80
- Para **sugerencias**: usar threshold ≥ 0.70

---

## 🔒 Notas de Seguridad

1. **Solo Local**: Estos endpoints están diseñados para uso local. No expongas directamente a internet sin autenticación.

2. **HTTPS en Producción**: Aunque el stream es local, considera usar HTTPS si transmites a través de la red.

3. **Privacidad**: Asegúrate de cumplir con las leyes de privacidad y protección de datos al usar reconocimiento facial.

4. **Liberar Recursos**: Siempre llama a `/webcam/stop` cuando termines para liberar la cámara.

---

## 📝 Notas Adicionales

- El stream usa formato **MJPEG** (Motion JPEG), compatible con todos los navegadores modernos
- Los datos de reconocimiento se actualizan cada **500ms** por defecto
- La webcam se configura automáticamente para modo espejo (flip horizontal)
- Soporta detección múltiple de caras simultáneas
- Incluye información de edad y género (si CompreFace está configurado con esos plugins)
