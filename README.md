# 🏋️ Sistema de Gestión de Gimnasio - Vito's Gym Club

<div align="center">

![Estado](https://img.shields.io/badge/estado-activo-success.svg)
![Versión](https://img.shields.io/badge/versión-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![Docker](https://img.shields.io/badge/docker-required-2496ED.svg)

Sistema completo de gestión de usuarios con reconocimiento facial para gimnasios.

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Despliegue](#-instalación-y-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración de Red Local](#-configuración-de-red-local)
- [Uso del Sistema](#-uso-del-sistema)
- [Solución de Problemas](#-solución-de-problemas)

---

## 🎯 Descripción General

Sistema integral de gestión de gimnasio que combina un **frontend moderno en React** con dos APIs especializadas en Python:

1. **API CRUD**: Gestión completa de usuarios (crear, leer, actualizar, eliminar)
2. **API Face Recognition**: Reconocimiento facial en tiempo real usando CompreFace
3. **Frontend**: Interfaz de usuario intuitiva con Material-UI

### 🌟 Características Principales

- ✅ **CRUD Completo** de usuarios con SQLite
- ✅ **Reconocimiento Facial** en tiempo real con webcam
- ✅ **Certificados HTTPS** autofirmados para desarrollo
- ✅ **Acceso en Red Local** desde múltiples dispositivos
- ✅ **Interfaz Moderna** con React + TypeScript + Material-UI
- ✅ **API Documentada** con Swagger/FastAPI Docs
- ✅ **Streaming de Video** MJPEG desde webcam

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend React                       │
│                 (https://localhost:5173)                │
│              TypeScript + Material-UI + Vite            │
└──────────────┬─────────────────────┬────────────────────┘
               │                     │
               ▼                     ▼
   ┌────────────────────┐  ┌──────────────────────┐
   │    API CRUD        │  │   API Face Recognition│
   │ (Python 32-bits)   │  │   (Python 64-bits)    │
   │ https://localhost: │  │  https://localhost:   │
   │       8001         │  │        8002           │
   └──────┬─────────────┘  └──────┬───────────────┘
          │                       │
          ▼                       ▼
   ┌─────────────┐        ┌──────────────────┐
   │  SQLite DB  │        │  CompreFace API  │
   │ gimnasio.db │        │  Docker Container │
   └─────────────┘        │  Port 8000       │
                          └──────────────────┘
```

### Flujo de Trabajo

1. **Usuario accede al frontend** → React App (puerto 5173)
2. **Operaciones CRUD** → Frontend → API CRUD (puerto 8001) → SQLite
3. **Registro facial** → Frontend → API Face (puerto 8002) → CompreFace (puerto 8000)
4. **Reconocimiento en vivo** → Webcam → API Face → CompreFace → Frontend

---

## 💻 Tecnologías Utilizadas

### Frontend

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rápido
- **Material-UI (MUI)** - Componentes UI
- **Emotion** - CSS-in-JS

### Backend - API CRUD (Python 32 bits)

- **FastAPI** - Framework web moderno
- **Pydantic** - Validación de datos
- **SQLite** - Base de datos
- **Uvicorn** - Servidor ASGI
- **PyOpenSSL** - Certificados SSL

### Backend - API Face Recognition (Python 64 bits)

- **FastAPI** - Framework web
- **CompreFace Python SDK** - Reconocimiento facial
- **OpenCV** (cv2) - Captura de video
- **Uvicorn** - Servidor ASGI

### Infraestructura

- **Docker** - CompreFace container
- **CompreFace** - Motor de reconocimiento facial
- **HTTPS** - Certificados autofirmados

---

## 📦 Requisitos Previos

### Software Necesario

| Software                  | Versión Mínima | Propósito            |
| ------------------------- | -------------- | -------------------- |
| **Python 3.8+** (32-bits) | 3.8            | API CRUD             |
| **Python 3.8+** (64-bits) | 3.8            | API Face Recognition |
| **Node.js**               | 18.x           | Frontend             |
| **npm**                   | 9.x            | Gestor de paquetes   |
| **Docker Desktop**        | Latest         | CompreFace container |
| **Git**                   | Latest         | Control de versiones |

### Hardware Recomendado

- **RAM**: 8 GB mínimo (16 GB recomendado)
- **CPU**: 4 cores mínimo
- **Webcam**: Cualquier webcam USB o integrada
- **Disco**: 2 GB libres

---

## 🚀 Instalación y Despliegue

### 1️⃣ Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd gym
```

### 2️⃣ Instalar Docker Desktop y CompreFace

#### Requisitos Previos

1. **Instalar Docker Desktop**
   - Descarga desde: https://www.docker.com/products/docker-desktop/
   - Instala y asegúrate de que Docker esté corriendo

#### Opción A: Instalación con Docker Compose (Recomendado)

CompreFace es una solución de código abierto de reconocimiento facial desarrollada por Exadel.

**Pasos:**

1. **Descargar la última versión**

   - Visita: https://github.com/exadel-inc/CompreFace/releases
   - Descarga el archivo `.zip` de la última release

2. **Extraer el archivo**

   ```bash
   # Descomprime el archivo descargado en una carpeta
   # Ejemplo: C:\CompreFace
   ```

3. **Ejecutar Docker Desktop**

   - Asegúrate de que Docker Desktop esté corriendo

4. **Abrir Command Prompt (CMD)**

   - Windows: Busca "cmd" en el menú inicio
   - Presiona Enter

5. **Navegar a la carpeta**

   ```bash
   cd C:\ruta\donde\extrajiste\CompreFace
   # Ejemplo: cd C:\CompreFace
   ```

6. **Ejecutar docker-compose**

   ```bash
   docker-compose up -d
   ```

7. **Verificar instalación**
   - Abre tu navegador
   - Visita: http://localhost:8000/login

#### Opción B: Instalación Rápida con Docker Hub

```bash
# Descargar la imagen de CompreFace desde Docker Hub
docker pull exadel/compreface:latest

# Ejecutar el contenedor en el puerto 8000
docker run -d -p 8000:8000 --name compreface exadel/compreface:latest

# Verificar que está corriendo
docker ps
```

**Acceder a CompreFace:**

- Abre tu navegador y visita: http://localhost:8000

#### Configurar CompreFace

1. Crea una cuenta en la interfaz web de CompreFace (http://localhost:8000)
2. Crea una nueva **aplicación**
3. Dentro de la aplicación, crea un servicio de **"Recognition"**
4. Copia el **API Key** generado
5. Actualiza el archivo `apiFace/API/main.py`:

```python
# Línea 23 en apiFace/API/main.py
API_KEY = "TU_API_KEY_AQUÍ"  # Reemplazar con tu API Key
```

**Documentación oficial de CompreFace:**

- GitHub: https://github.com/exadel-inc/CompreFace
- Releases: https://github.com/exadel-inc/CompreFace/releases
- Getting Started: https://github.com/exadel-inc/CompreFace?tab=readme-ov-file#getting-started-with-compreface

**📘 Más información**: Para instrucciones detalladas y opciones avanzadas de instalación, consulta la [guía oficial de Getting Started](https://github.com/exadel-inc/CompreFace?tab=readme-ov-file#getting-started-with-compreface).

---

### 3️⃣ Configurar API CRUD (Python 32 bits)

#### Crear Entorno Virtual de 32 bits

**⚠️ Importante**: Este proyecto requiere Python de **32 bits** debido a dependencias específicas.

```bash
cd apiCRUD

# Windows - Instalar Python 32 bits desde python.org si no lo tienes
# Asegúrate de tener python 32 bits en tu PATH

# Crear entorno virtual con Python 32 bits
py -3-32 -m venv venv32

# Activar el entorno virtual
# Windows PowerShell:
.\venv32\Scripts\Activate.ps1

# Windows CMD:
.\venv32\Scripts\activate.bat

# Verificar que es Python 32 bits
python -c "import struct; print(struct.calcsize('P') * 8)"
# Debe mostrar: 32
```

#### Instalar Dependencias

```bash
cd API
pip install -r requirements.txt
```

Esto instalará:

- FastAPI
- Uvicorn
- Pydantic
- PyOpenSSL

#### Generar Certificados SSL

```bash
python generar_certificados.py
```

Esto creará la carpeta `certs/` con:

- `cert.pem` - Certificado SSL
- `key.pem` - Clave privada

#### Iniciar API CRUD

```bash
# Con HTTPS (producción/red local)
python run_https.py

# La API estará disponible en:
# - https://localhost:8001
# - https://192.168.x.x:8001 (tu IP local)
# - Documentación: https://localhost:8001/docs
```

---

### 4️⃣ Configurar API Face Recognition (Python 64 bits)

#### Crear Entorno Virtual de 64 bits

**ℹ️ Nota**: CompreFace SDK y OpenCV requieren Python de **64 bits**.

```bash
cd apiFace

# Crear entorno virtual con Python 64 bits
python -m venv venv_compreface

# Activar el entorno virtual
# Windows PowerShell:
.\venv_compreface\Scripts\Activate.ps1

# Windows CMD:
.\venv_compreface\Scripts\activate.bat

# Verificar que es Python 64 bits
python -c "import struct; print(struct.calcsize('P') * 8)"
# Debe mostrar: 64
```

#### Instalar CompreFace SDK

**Opción A: Desde PyPI (Recomendado)**

```bash
pip install compreface-sdk
```

**Opción B: Desde el código fuente local (si está incluido)**

```bash
cd compreface-python-sdk
pip install -e .
cd ..
```

**📘 Más información**: Para documentación completa del SDK, ejemplos y referencia de la API, visita el [repositorio oficial del CompreFace Python SDK](https://github.com/exadel-inc/compreface-python-sdk).

#### Instalar Dependencias

```bash
cd API
pip install -r requirements.txt
```

Esto instalará:

- FastAPI
- Uvicorn
- OpenCV (cv2)
- PyOpenSSL
- Otras dependencias necesarias

#### Generar Certificados SSL

```bash
python generate_cert.py
```

#### Iniciar API Face Recognition

```bash
# Con HTTPS (producción/red local)
python run_https.py

# La API estará disponible en:
# - https://localhost:8002
# - https://192.168.x.x:8002 (tu IP local)
# - Documentación: https://localhost:8002/docs
```

---

### 5️⃣ Configurar Frontend

#### Instalar Dependencias

```bash
cd frontend
npm install
```

Esto instalará:

- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- @mui/x-data-grid
- Emotion (CSS-in-JS)
- Plugin de SSL para Vite

#### Configurar URLs de las APIs

Edita el archivo `src/services/api.ts` para configurar las IPs de tu red local:

```typescript
// Línea 3-5
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:8001"
    : "https://TU_IP_LOCAL:8001"; // Ejemplo: 'https://192.168.0.7:8001'

// Línea 129-131
const FACE_RECOGNITION_API_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:8002"
    : "https://TU_IP_LOCAL:8002"; // Ejemplo: 'https://192.168.0.7:8002'
```

**💡 Cómo encontrar tu IP local:**

```bash
# Windows PowerShell
ipconfig
# Busca "Dirección IPv4" en tu adaptador de red activo

# Ejemplo de salida:
# Dirección IPv4. . . . . . . . . . . . . . : 192.168.0.7
```

#### Iniciar Frontend

```bash
npm run dev
```

El frontend estará disponible en:

- **Local**: https://localhost:5173
- **Red Local**: https://TU_IP_LOCAL:5173
- Ejemplo: https://192.168.0.7:5173

**Acceso desde otros dispositivos:**

- En tu smartphone/tablet, abre el navegador
- Visita: `https://TU_IP_LOCAL:5173`
- Acepta el certificado autofirmado

---

## 📁 Estructura del Proyecto

```
gym/
├── README.md                    # Este archivo
├── .gitignore                   # Ignorar archivos sensibles
│
├── frontend/                    # 🎨 Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── UserForm.tsx    # Formulario de usuario
│   │   │   ├── UserList.tsx    # Lista de usuarios
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.ts          # Cliente API (CRUD + Face)
│   │   ├── types/
│   │   │   └── User.ts         # Tipos TypeScript
│   │   ├── App.tsx             # Componente principal
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Archivos estáticos
│   ├── package.json
│   ├── vite.config.ts          # Configuración Vite + HTTPS
│   └── tsconfig.json
│
├── apiCRUD/                    # 🗄️ API de Gestión de Usuarios
│   ├── venv32/                 # Entorno virtual Python 32 bits
│   ├── gimnasio.db             # Base de datos SQLite
│   ├── gimnasio_db.usuarios.json  # Backup JSON
│   ├── crearBDD.py             # Script para crear BD
│   ├── migrar_a_sqlite.py      # Script de migración
│   └── API/
│       ├── main.py             # API FastAPI principal
│       ├── models.py           # Modelos Pydantic
│       ├── database.py         # Operaciones SQLite
│       ├── requirements.txt    # Dependencias Python
│       ├── run_https.py        # Ejecutar con HTTPS
│       ├── generar_certificados.py  # Generar certs SSL
│       ├── certs/              # Certificados SSL (generados)
│       └── README.md           # Documentación API CRUD
│
└── apiFace/                    # 📸 API de Reconocimiento Facial
    ├── venv_compreface/        # Entorno virtual Python 64 bits
    ├── test.py                 # Tests básicos
    ├── compreface-python-sdk/  # SDK de CompreFace
    │   ├── compreface/         # Paquete principal
    │   ├── examples/           # Ejemplos de uso
    │   ├── tests/              # Tests del SDK
    │   ├── webcam_demo/        # Demos de webcam
    │   ├── setup.py            # Instalación del SDK
    │   └── README.md
    └── API/
        ├── main.py             # API FastAPI principal
        ├── run_https.py        # Ejecutar con HTTPS
        ├── generate_cert.py    # Generar certs SSL
        ├── webcam_demo.html    # Demo standalone de webcam
        ├── certs/              # Certificados SSL (generados)
        ├── uploads/            # Imágenes subidas (temp)
        └── README.md           # Documentación API Face
```

---

## 🔧 Componentes del Sistema

### 1. Frontend (React + TypeScript)

**Ubicación**: `frontend/`

**Componentes principales:**

#### `App.tsx`

- Componente raíz de la aplicación
- Gestiona el estado global de usuarios
- Implementa tema dark con Material-UI
- Maneja navegación entre vistas

#### `UserList.tsx`

- Tabla interactiva de usuarios con DataGrid
- Filtros, búsqueda y ordenamiento
- Paginación configurable
- Acciones: Editar, Eliminar, Reconocimiento Facial

#### `UserForm.tsx`

- Formulario completo de registro/edición
- Validaciones en tiempo real
- Campos: Información personal, membresía, contacto
- Integración con webcam para registro facial

#### `api.ts`

- Cliente HTTP para comunicación con APIs
- Funciones CRUD: create, read, update, delete
- Funciones de reconocimiento facial
- Gestión de errores

**Características técnicas:**

- Certificados HTTPS autofirmados con `@vitejs/plugin-basic-ssl`
- Expo en red local con `host: '0.0.0.0'`
- Puerto fijo: 5173

---

### 2. API CRUD (Python 32 bits + FastAPI)

**Ubicación**: `apiCRUD/API/`

**Endpoints principales:**

| Método | Endpoint                   | Descripción               |
| ------ | -------------------------- | ------------------------- |
| GET    | `/`                        | Información de la API     |
| POST   | `/usuarios`                | Crear nuevo usuario       |
| GET    | `/usuarios`                | Listar todos los usuarios |
| GET    | `/usuarios/{id}`           | Obtener usuario por ID    |
| PUT    | `/usuarios/{id}`           | Actualizar usuario        |
| DELETE | `/usuarios/{id}`           | Eliminar usuario          |
| GET    | `/usuarios/{id}/membresia` | Estado de membresía       |

**Modelos de datos (Pydantic):**

```python
class UsuarioCreate:
    nombre: str
    apellido: str
    codigo: Optional[str]
    departamento: str
    fecha_nacimiento: Optional[str]
    fecha_inicio: str
    fecha_fin: str
    celular: Optional[str]
    email: Optional[str]
    direccion: Optional[str]
    tipo_documento: Optional[str]
    numero_documento: Optional[str]
```

**Base de datos SQLite:**

- Archivo: `gimnasio.db`
- Tabla: `usuarios`
- Timestamps automáticos: `created_at`, `updated_at`

**Configuración HTTPS:**

- Puerto: 8001
- Certificados: `certs/cert.pem` y `certs/key.pem`
- Host: `0.0.0.0` (accesible en red local)

---

### 3. API Face Recognition (Python 64 bits + FastAPI)

**Ubicación**: `apiFace/API/`

**Endpoints principales:**

| Método | Endpoint              | Descripción                  |
| ------ | --------------------- | ---------------------------- |
| GET    | `/`                   | Estado del servicio          |
| GET    | `/health`             | Health check                 |
| POST   | `/add_faces/`         | Agregar rostros de usuario   |
| POST   | `/webcam/start`       | Iniciar captura de webcam    |
| POST   | `/webcam/stop`        | Detener captura de webcam    |
| GET    | `/webcam/status`      | Estado de la webcam          |
| GET    | `/webcam/stream`      | Stream de video MJPEG        |
| GET    | `/webcam/recognition` | Datos de reconocimiento JSON |

**Integración con CompreFace:**

```python
from compreface import CompreFace
from compreface.service import RecognitionService

compre_face = CompreFace("http://localhost", "8000")
recognition = compre_face.init_face_recognition(API_KEY)
face_collection = recognition.get_face_collection()
```

**Funcionalidades:**

1. **Registro de rostros**: Sube múltiples imágenes de un usuario
2. **Reconocimiento en tiempo real**: Detecta y reconoce rostros desde webcam
3. **Streaming de video**: Envía frames al frontend en formato MJPEG
4. **Gestión de sujetos**: Agregar, actualizar, eliminar rostros en CompreFace

**Configuración HTTPS:**

- Puerto: 8002
- Certificados: `certs/cert.pem` y `certs/key.pem`
- Host: `0.0.0.0` (accesible en red local)

---

### 4. CompreFace (Docker)

**Imagen Docker**: `exadel/compreface:latest`

**Instalación:**

```bash
# Opción 1: Desde Docker Hub (recomendado)
docker pull exadel/compreface:latest
docker run -d -p 8000:8000 --name compreface exadel/compreface:latest

# Opción 2: Desde GitHub (desarrollo)
git clone https://github.com/exadel-inc/CompreFace.git
cd CompreFace
docker-compose up -d
```

**Acceso:**

- Web UI: http://localhost:8000
- API: http://localhost:8000/api/v1/recognition

**Configuración:**

1. Crear cuenta en la web UI
2. Crear una aplicación
3. Crear un servicio de "Recognition"
4. Copiar el API Key
5. Actualizar `apiFace/API/main.py` con el API Key

**Recursos:**

- GitHub: https://github.com/exadel-inc/CompreFace
- Documentación: https://github.com/exadel-inc/CompreFace/tree/master/docs
- API Reference: https://github.com/exadel-inc/CompreFace/blob/master/docs/Rest-API-description.md

---

## 🌐 Configuración de Red Local

### Configurar Acceso desde Múltiples Dispositivos

#### 1. Obtener tu IP Local

```powershell
# Windows PowerShell
ipconfig

# Busca tu IPv4 en el adaptador de red activo
# Ejemplo: 192.168.0.7
```

#### 2. Configurar Firewall

Permite el tráfico en los puertos: **5173**, **8001**, **8002**, **8000**

```powershell
# Windows PowerShell (ejecutar como Administrador)
New-NetFirewallRule -DisplayName "Gym App - Frontend" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Gym App - API CRUD" -Direction Inbound -LocalPort 8001 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Gym App - API Face" -Direction Inbound -LocalPort 8002 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Gym App - CompreFace" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

#### 3. Actualizar URLs en el Frontend

Edita `frontend/src/services/api.ts`:

```typescript
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:8001"
    : "https://192.168.0.7:8001"; // ⚠️ Reemplaza con tu IP

const FACE_RECOGNITION_API_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:8002"
    : "https://192.168.0.7:8002"; // ⚠️ Reemplaza con tu IP
```

#### 4. Acceder desde Otros Dispositivos

En tu smartphone, tablet u otra computadora en la misma red:

1. Abre el navegador
2. Visita: `https://TU_IP_LOCAL:5173`
   - Ejemplo: `https://192.168.0.7:5173`
3. Acepta el certificado autofirmado
   - Chrome: "Avanzado" → "Continuar a..."
   - Safari iOS: Puede requerir instalar el certificado

**URLs Disponibles:**

| Servicio   | URL Local              | URL Red                  |
| ---------- | ---------------------- | ------------------------ |
| Frontend   | https://localhost:5173 | https://192.168.0.7:5173 |
| API CRUD   | https://localhost:8001 | https://192.168.0.7:8001 |
| API Face   | https://localhost:8002 | https://192.168.0.7:8002 |
| CompreFace | http://localhost:8000  | http://192.168.0.7:8000  |

---

## 🎮 Uso del Sistema

### Flujo de Trabajo Completo

#### 1. Registrar un Nuevo Usuario

1. **Accede al frontend**: https://localhost:5173
2. Haz clic en el botón **"+ Nuevo Usuario"**
3. Completa el formulario:
   - **Información Personal**: Nombre, Apellido, Género, Fecha de Nacimiento
   - **Membresía**: Código (opcional), Departamento, Fechas de inicio/fin
   - **Contacto**: Celular, Email, Dirección
   - **Identificación**: Tipo y número de documento
4. Haz clic en **"Guardar Usuario"**

#### 2. Registrar Rostro del Usuario (Opcional)

1. En la lista de usuarios, localiza al usuario recién creado
2. Haz clic en el ícono de **"Face ID"** 📷
3. Se abrirá el diálogo de reconocimiento facial
4. Haz clic en **"Iniciar Cámara"**
5. Permite el acceso a la webcam
6. Posiciona tu rostro en el centro de la cámara
7. Haz clic en **"Capturar Foto"** varias veces (5-10 fotos)
   - **Tip**: Captura desde diferentes ángulos y expresiones
8. Haz clic en **"Enviar Fotos"**
9. Espera la confirmación de éxito

#### 3. Reconocer Usuario por Rostro

1. En el menú principal, haz clic en **"Reconocimiento Facial"**
2. Haz clic en **"Iniciar Reconocimiento"**
3. La cámara se activará automáticamente
4. Aparecerá un recuadro alrededor de rostros detectados
5. Si el rostro está registrado, verás:
   - Nombre del usuario
   - Porcentaje de similitud
   - Color verde (reconocido) o rojo (desconocido)

#### 4. Editar Usuario

1. En la lista de usuarios, haz clic en el ícono de **"Editar"** ✏️
2. Modifica los campos necesarios
3. Haz clic en **"Actualizar Usuario"**

#### 5. Eliminar Usuario

1. En la lista de usuarios, haz clic en el ícono de **"Eliminar"** 🗑️
2. Confirma la eliminación
3. El usuario será eliminado de la base de datos

#### 6. Filtrar y Buscar Usuarios

1. Usa el campo de búsqueda en la parte superior de la tabla
2. Filtra por:
   - Nombre
   - Apellido
   - Código
   - Departamento
   - Email
3. Ordena las columnas haciendo clic en los encabezados

---

### Documentación Interactiva de las APIs

#### API CRUD - Swagger UI

Visita: https://localhost:8001/docs

Aquí podrás:

- Ver todos los endpoints disponibles
- Probar peticiones directamente desde el navegador
- Ver esquemas de datos con ejemplos
- Descargar especificación OpenAPI

#### API Face Recognition - Swagger UI

Visita: https://localhost:8002/docs

Funcionalidades:

- Probar endpoints de reconocimiento facial
- Subir imágenes de prueba
- Ver respuestas en tiempo real
- Documentación de parámetros

---

## 🔍 Solución de Problemas

### ❌ Error: "No se puede conectar a la API"

**Problema**: El frontend no puede comunicarse con las APIs.

**Soluciones**:

1. **Verifica que las APIs están corriendo**:

   ```bash
   # En cada terminal, deberías ver:
   # API CRUD: INFO:     Uvicorn running on https://0.0.0.0:8001
   # API Face: INFO:     Uvicorn running on https://0.0.0.0:8002
   ```

2. **Verifica las URLs en `frontend/src/services/api.ts`**:

   - Asegúrate de usar `https://` (no `http://`)
   - Verifica que la IP sea correcta si accedes desde otro dispositivo

3. **Acepta los certificados HTTPS**:
   - Visita manualmente: https://localhost:8001/docs
   - Acepta el certificado autofirmado
   - Repite para: https://localhost:8002/docs

---

### ❌ Error: "Certificados SSL no encontrados"

**Problema**: Al ejecutar `run_https.py` aparece un error de certificados.

**Solución**:

```bash
# Para API CRUD
cd apiCRUD/API
python generar_certificados.py

# Para API Face
cd apiFace/API
python generate_cert.py
```

Verifica que se crearon los archivos:

- `certs/cert.pem`
- `certs/key.pem`

---

### ❌ Error: "CompreFace no responde"

**Problema**: La API Face no puede conectarse a CompreFace.

**Soluciones**:

1. **Verifica que el contenedor está corriendo**:

   ```bash
   docker ps
   # Debería mostrar: exadel/compreface
   ```

2. **Si no está corriendo, inícialo**:

   ```bash
   docker start compreface
   # O si no existe:
   docker run -d -p 8000:8000 --name compreface exadel/compreface:latest
   ```

3. **Verifica el acceso**:

   - Abre: http://localhost:8000
   - Deberías ver la interfaz web de CompreFace

4. **Verifica el API Key**:
   - Edita `apiFace/API/main.py`
   - Línea 23: `API_KEY = "TU_API_KEY"`

---

### ❌ Error: "Webcam no se inicia"

**Problema**: La webcam no se activa o aparece un error.

**Soluciones**:

1. **Verifica permisos**:

   - Windows: Settings → Privacy → Camera
   - Permite el acceso a la cámara para tu navegador

2. **Cierra otras aplicaciones que usen la cámara**:

   - Zoom, Teams, Skype, etc.

3. **Usa HTTP en lugar de HTTPS** (solo para desarrollo):

   ```bash
   cd apiFace/API
   uvicorn main:app --host 0.0.0.0 --port 8002 --reload
   ```

   - Luego actualiza el frontend para usar `http://localhost:8002`

4. **Verifica en los logs**:
   ```bash
   # En la terminal de API Face, busca:
   INFO:     Webcam iniciada correctamente
   ```

---

### ❌ Error: Python 32/64 bits incorrectos

**Problema**: Al instalar dependencias, aparece un error relacionado con la arquitectura.

**Solución**:

**Para API CRUD (32 bits)**:

```bash
# Verifica la versión de Python
python -c "import struct; print(struct.calcsize('P') * 8)"
# Debe mostrar: 32

# Si muestra 64, instala Python 32 bits desde:
# https://www.python.org/downloads/windows/
# Busca "Windows installer (32-bit)"

# Luego crea el venv con:
py -3-32 -m venv venv32
```

**Para API Face (64 bits)**:

```bash
# Verifica la versión de Python
python -c "import struct; print(struct.calcsize('P') * 8)"
# Debe mostrar: 64

# Si muestra 32, usa:
py -3 -m venv venv_compreface
```

---

### ❌ Error: "Cannot find module 'vite'"

**Problema**: Al ejecutar `npm run dev` aparece un error de módulo no encontrado.

**Solución**:

```bash
cd frontend
# Elimina node_modules y reinstala
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

---

### ❌ Error: CORS en el navegador

**Problema**: En la consola del navegador aparece un error de CORS.

**Solución**:

1. **Verifica que las APIs tienen CORS habilitado**:

   - En `apiCRUD/API/main.py` y `apiFace/API/main.py`
   - Debería haber:
     ```python
     app.add_middleware(
         CORSMiddleware,
         allow_origins=["*"],
         allow_credentials=True,
         allow_methods=["*"],
         allow_headers=["*"],
     )
     ```

2. **Para producción, especifica los orígenes**:
   ```python
   allow_origins=[
       "https://localhost:5173",
       "https://192.168.0.7:5173",  # Tu IP
   ],
   ```

---

### ❌ Error: "Port already in use"

**Problema**: Al iniciar un servicio, el puerto ya está en uso.

**Solución**:

```powershell
# Windows PowerShell
# Encuentra el proceso que usa el puerto (ejemplo: 8001)
netstat -ano | findstr :8001

# Nota el PID (última columna)
# Mata el proceso:
taskkill /PID <PID> /F

# Ejemplo:
# taskkill /PID 12345 /F
```

---

## 📝 Mantenimiento y Desarrollo

### Actualizar Dependencias

#### Frontend

```bash
cd frontend
npm update
npm audit fix
```

#### APIs Python

```bash
# Activar entorno virtual correspondiente
pip list --outdated
pip install --upgrade <paquete>
```

### Backup de la Base de Datos

```bash
cd apiCRUD
# Crear backup
cp gimnasio.db gimnasio_backup_$(date +%Y%m%d).db

# Exportar a JSON
python crearBDD.py
```

### Logs y Debugging

**Habilitar logs detallados**:

```python
# En main.py de cualquier API
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Ver logs de Docker (CompreFace)**:

```bash
docker logs compreface
docker logs -f compreface  # Follow mode
```

---

## 🔐 Seguridad

### ⚠️ Importante para Producción

Los certificados autofirmados son **solo para desarrollo**. Para producción:

1. **Obtén certificados válidos**:

   - Let's Encrypt (gratuito): https://letsencrypt.org/
   - Cloudflare SSL
   - Proveedor de hosting

2. **Configura variables de entorno**:

   ```python
   # No pongas API Keys en el código
   import os
   API_KEY = os.getenv("COMPREFACE_API_KEY")
   ```

3. **Restringe CORS**:

   ```python
   allow_origins=[
       "https://tudominio.com",
   ],
   ```

4. **Usa un proxy reverso**:
   - Nginx
   - Apache
   - Traefik

---

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -am 'Agrega nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request

---

## 📄 Licencia

Copyright © 2026 Vito's Gym Club. Todos los derechos reservados.

---

## 📞 Soporte

Si encuentras problemas o tienes preguntas:

1. Revisa la sección [Solución de Problemas](#-solución-de-problemas)
2. Consulta la documentación de las APIs:
   - API CRUD: https://localhost:8001/docs
   - API Face: https://localhost:8002/docs
3. Revisa los issues del proyecto en GitHub
4. Contacta al equipo de desarrollo

---

## 🙏 Agradecimientos

- **CompreFace** - Sistema de reconocimiento facial: https://github.com/exadel-inc/CompreFace
- **FastAPI** - Framework web moderno: https://fastapi.tiangolo.com/
- **React** - Librería UI: https://react.dev/
- **Material-UI** - Componentes UI: https://mui.com/

---

<div align="center">

**🏋️ Vito's Gym Club - Sistema de Gestión Integral**

Desarrollado con ❤️ para mejorar la experiencia de nuestros miembros

[⬆️ Volver arriba](#-sistema-de-gestión-de-gimnasio---vitos-gym-club)

</div>
