# 🏋️ Gym Management System - Vito's Gym Club

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![Docker](https://img.shields.io/badge/docker-required-2496ED.svg)

Complete user management system with facial recognition for gyms.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Technologies Used](#-technologies-used)
- [Prerequisites](#-prerequisites)
- [Installation and Deployment](#-installation-and-deployment)
- [Project Structure](#-project-structure)
- [Local Network Configuration](#-local-network-configuration)
- [System Usage](#-system-usage)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

Comprehensive gym management system that combines a **modern React frontend** with two specialized Python APIs:

1. **CRUD API**: Complete user management (create, read, update, delete)
2. **Face Recognition API**: Real-time facial recognition using CompreFace
3. **Frontend**: Intuitive user interface with Material-UI

### 🌟 Key Features

- ✅ **Complete CRUD** of users with SQLite
- ✅ **Facial Recognition** in real-time with webcam
- ✅ **Self-signed HTTPS Certificates** for development
- ✅ **Local Network Access** from multiple devices
- ✅ **Modern Interface** with React + TypeScript + Material-UI
- ✅ **Documented API** with Swagger/FastAPI Docs
- ✅ **MJPEG Video Streaming** from webcam

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend React                       │
│                 (https://localhost:5173)                │
│              TypeScript + Material-UI + Vite            │
└──────────────┬─────────────────────┬────────────────────┘
               │                     │
               ▼                     ▼
   ┌────────────────────┐  ┌──────────────────────┐
   │    CRUD API        │  │   Face Recognition API│
   │ (Python 32-bit)    │  │   (Python 64-bit)     │
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

### Workflow

1. **User accesses frontend** → React App (port 5173)
2. **CRUD operations** → Frontend → CRUD API (port 8001) → SQLite
3. **Face registration** → Frontend → Face API (port 8002) → CompreFace (port 8000)
4. **Live recognition** → Webcam → Face API → CompreFace → Frontend

---

## 💻 Technologies Used

### Frontend

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Ultra-fast build tool
- **Material-UI (MUI)** - UI Components
- **Emotion** - CSS-in-JS

### Backend - CRUD API (Python 32-bit)

- **FastAPI** - Modern web framework
- **Pydantic** - Data validation
- **SQLite** - Database
- **Uvicorn** - ASGI server
- **PyOpenSSL** - SSL certificates

### Backend - Face Recognition API (Python 64-bit)

- **FastAPI** - Web framework
- **CompreFace Python SDK** - Facial recognition
- **OpenCV** (cv2) - Video capture
- **Uvicorn** - ASGI server

### Infrastructure

- **Docker** - CompreFace container
- **CompreFace** - Facial recognition engine
- **HTTPS** - Self-signed certificates

---

## 📦 Prerequisites

### Required Software

| Software                  | Minimum Version | Purpose              |
| ------------------------- | --------------- | -------------------- |
| **Python 3.8+** (32-bit)  | 3.8             | CRUD API             |
| **Python 3.8+** (64-bit)  | 3.8             | Face Recognition API |
| **Node.js**               | 18.x            | Frontend             |
| **npm**                   | 9.x             | Package manager      |
| **Docker Desktop**        | Latest          | CompreFace container |
| **Git**                   | Latest          | Version control      |

### Recommended Hardware

- **RAM**: 8 GB minimum (16 GB recommended)
- **CPU**: 4 cores minimum
- **Webcam**: Any USB or integrated webcam
- **Disk**: 2 GB free space

---

## 🚀 Installation and Deployment

### 1️⃣ Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd gym
```

### 2️⃣ Install Docker Desktop and CompreFace

#### Prerequisites

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and make sure Docker is running

#### Option A: Installation with Docker Compose (Recommended)

CompreFace is an open-source facial recognition solution developed by Exadel.

**Steps:**

1. **Download the latest version**

   - Visit: https://github.com/exadel-inc/CompreFace/releases
   - Download the `.zip` file from the latest release

2. **Extract the file**

   ```bash
   # Unzip the downloaded file into a folder
   # Example: C:\CompreFace
   ```

3. **Run Docker Desktop**

   - Make sure Docker Desktop is running

4. **Open Command Prompt (CMD)**

   - Windows: Search for "cmd" in the start menu
   - Press Enter

5. **Navigate to the folder**

   ```bash
   cd C:\path\where\you\extracted\CompreFace
   # Example: cd C:\CompreFace
   ```

6. **Run docker-compose**

   ```bash
   docker-compose up -d
   ```

7. **Verify installation**
   - Open your browser
   - Visit: http://localhost:8000/login

#### Option B: Quick Installation with Docker Hub

```bash
# Download the CompreFace image from Docker Hub
docker pull exadel/compreface:latest

# Run the container on port 8000
docker run -d -p 8000:8000 --name compreface exadel/compreface:latest

# Verify it's running
docker ps
```

**Access CompreFace:**

- Open your browser and visit: http://localhost:8000

#### Configure CompreFace

1. Create an account in the CompreFace web interface (http://localhost:8000)
2. Create a new **application**
3. Inside the application, create a **"Recognition"** service
4. Copy the generated **API Key**
5. Update the `apiFace/API/main.py` file:

```python
# Line 23 in apiFace/API/main.py
API_KEY = "YOUR_API_KEY_HERE"  # Replace with your API Key
```

**Official CompreFace documentation:**

- GitHub: https://github.com/exadel-inc/CompreFace
- Releases: https://github.com/exadel-inc/CompreFace/releases
- Getting Started: https://github.com/exadel-inc/CompreFace?tab=readme-ov-file#getting-started-with-compreface

**📘 More information**: For detailed instructions and advanced installation options, see the [official Getting Started guide](https://github.com/exadel-inc/CompreFace?tab=readme-ov-file#getting-started-with-compreface).

---

### 3️⃣ Configure CRUD API (Python 32-bit)

#### Create 32-bit Virtual Environment

**⚠️ Important**: This project requires **32-bit** Python due to specific dependencies.

```bash
cd apiCRUD

# Windows - Install Python 32-bit from python.org if you don't have it
# Make sure you have 32-bit python in your PATH

# Create virtual environment with Python 32-bit
py -3-32 -m venv venv32

# Activate the virtual environment
# Windows PowerShell:
.\venv32\Scripts\Activate.ps1

# Windows CMD:
.\venv32\Scripts\activate.bat

# Verify it's Python 32-bit
python -c "import struct; print(struct.calcsize('P') * 8)"
# Should display: 32
```

#### Install Dependencies

```bash
cd API
pip install -r requirements.txt
```

This will install:

- FastAPI
- Uvicorn
- Pydantic
- PyOpenSSL

#### Generate SSL Certificates

```bash
python generar_certificados.py
```

This will create the `certs/` folder with:

- `cert.pem` - SSL certificate
- `key.pem` - Private key

#### Start CRUD API

```bash
# With HTTPS (production/local network)
python run_https.py

# The API will be available at:
# - https://localhost:8001
# - https://192.168.x.x:8001 (your local IP)
# - Documentation: https://localhost:8001/docs
```

---

### 4️⃣ Configure Face Recognition API (Python 64-bit)

#### Create 64-bit Virtual Environment

**ℹ️ Note**: CompreFace SDK and OpenCV require **64-bit** Python.

```bash
cd apiFace

# Create virtual environment with Python 64-bit
python -m venv venv_compreface

# Activate the virtual environment
# Windows PowerShell:
.\venv_compreface\Scripts\Activate.ps1

# Windows CMD:
.\venv_compreface\Scripts\activate.bat

# Verify it's Python 64-bit
python -c "import struct; print(struct.calcsize('P') * 8)"
# Should display: 64
```

#### Install CompreFace SDK

**Option A: From PyPI (Recommended)**

```bash
pip install compreface-sdk
```

**Option B: From local source code (if included)**

```bash
cd compreface-python-sdk
pip install -e .
cd ..
```

**📘 More information**: For complete SDK documentation, examples, and API reference, visit the [official CompreFace Python SDK repository](https://github.com/exadel-inc/compreface-python-sdk).

#### Install Dependencies

```bash
cd API
pip install -r requirements.txt
```

This will install:

- FastAPI
- Uvicorn
- OpenCV (cv2)
- PyOpenSSL
- Other necessary dependencies

#### Generate SSL Certificates

```bash
python generate_cert.py
```

#### Start Face Recognition API

```bash
# With HTTPS (production/local network)
python run_https.py

# The API will be available at:
# - https://localhost:8002
# - https://192.168.x.x:8002 (your local IP)
# - Documentation: https://localhost:8002/docs
```

---

### 5️⃣ Configure Frontend

#### Install Dependencies

```bash
cd frontend
npm install
```

This will install:

- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- @mui/x-data-grid
- Emotion (CSS-in-JS)
- SSL plugin for Vite

#### Configure API URLs

Edit the `src/services/api.ts` file to configure your local network IPs:

```typescript
// Line 3-5
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:8001"
    : "https://YOUR_LOCAL_IP:8001"; // Example: 'https://192.168.0.7:8001'

// Line 129-131
const FACE_RECOGNITION_API_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:8002"
    : "https://YOUR_LOCAL_IP:8002"; // Example: 'https://192.168.0.7:8002'
```

**💡 How to find your local IP:**

```bash
# Windows PowerShell
ipconfig
# Look for "IPv4 Address" in your active network adapter

# Example output:
# IPv4 Address. . . . . . . . . . . . : 192.168.0.7
```

#### Start Frontend

```bash
npm run dev
```

The frontend will be available at:

- **Local**: https://localhost:5173
- **Local Network**: https://YOUR_LOCAL_IP:5173
- Example: https://192.168.0.7:5173

**Access from other devices:**

- On your smartphone/tablet, open the browser
- Visit: `https://YOUR_LOCAL_IP:5173`
- Accept the self-signed certificate

---

## 📁 Project Structure

```
gym/
├── README.md                    # This file
├── .gitignore                   # Ignore sensitive files
│
├── frontend/                    # 🎨 React Application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── UserForm.tsx    # User form
│   │   │   ├── UserList.tsx    # User list
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.ts          # API client (CRUD + Face)
│   │   ├── types/
│   │   │   └── User.ts         # TypeScript types
│   │   ├── App.tsx             # Main component
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static files
│   ├── package.json
│   ├── vite.config.ts          # Vite + HTTPS configuration
│   └── tsconfig.json
│
├── apiCRUD/                    # 🗄️ User Management API
│   ├── venv32/                 # Python 32-bit virtual environment
│   ├── gimnasio.db             # SQLite database
│   ├── gimnasio_db.usuarios.json  # JSON backup
│   ├── crearBDD.py             # Script to create DB
│   ├── migrar_a_sqlite.py      # Migration script
│   └── API/
│       ├── main.py             # Main FastAPI API
│       ├── models.py           # Pydantic models
│       ├── database.py         # SQLite operations
│       ├── requirements.txt    # Python dependencies
│       ├── run_https.py        # Run with HTTPS
│       ├── generar_certificados.py  # Generate SSL certs
│       ├── certs/              # SSL certificates (generated)
│       └── README.md           # CRUD API documentation
│
└── apiFace/                    # 📸 Facial Recognition API
    ├── venv_compreface/        # Python 64-bit virtual environment
    ├── test.py                 # Basic tests
    ├── compreface-python-sdk/  # CompreFace SDK
    │   ├── compreface/         # Main package
    │   ├── examples/           # Usage examples
    │   ├── tests/              # SDK tests
    │   ├── webcam_demo/        # Webcam demos
    │   ├── setup.py            # SDK installation
    │   └── README.md
    └── API/
        ├── main.py             # Main FastAPI API
        ├── run_https.py        # Run with HTTPS
        ├── generate_cert.py    # Generate SSL certs
        ├── webcam_demo.html    # Standalone webcam demo
        ├── certs/              # SSL certificates (generated)
        ├── uploads/            # Uploaded images (temp)
        └── README.md           # Face API documentation
```

---

## 🔧 System Components

### 1. Frontend (React + TypeScript)

**Location**: `frontend/`

**Main components:**

#### `App.tsx`

- Root component of the application
- Manages global user state
- Implements dark theme with Material-UI
- Handles navigation between views

#### `UserList.tsx`

- Interactive user table with DataGrid
- Filters, search, and sorting
- Configurable pagination
- Actions: Edit, Delete, Facial Recognition

#### `UserForm.tsx`

- Complete registration/editing form
- Real-time validations
- Fields: Personal information, membership, contact
- Webcam integration for facial registration

#### `api.ts`

- HTTP client for API communication
- CRUD functions: create, read, update, delete
- Facial recognition functions
- Error handling

**Technical features:**

- Self-signed HTTPS certificates with `@vitejs/plugin-basic-ssl`
- Local network exposure with `host: '0.0.0.0'`
- Fixed port: 5173

---

### 2. CRUD API (Python 32-bit + FastAPI)

**Location**: `apiCRUD/API/`

**Main endpoints:**

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| GET    | `/`                        | API information           |
| POST   | `/usuarios`                | Create new user           |
| GET    | `/usuarios`                | List all users            |
| GET    | `/usuarios/{id}`           | Get user by ID            |
| PUT    | `/usuarios/{id}`           | Update user               |
| DELETE | `/usuarios/{id}`           | Delete user               |
| GET    | `/usuarios/{id}/membresia` | Membership status         |

**Data models (Pydantic):**

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

**SQLite database:**

- File: `gimnasio.db`
- Table: `usuarios`
- Automatic timestamps: `created_at`, `updated_at`

**HTTPS configuration:**

- Port: 8001
- Certificates: `certs/cert.pem` and `certs/key.pem`
- Host: `0.0.0.0` (accessible on local network)

---

### 3. Face Recognition API (Python 64-bit + FastAPI)

**Location**: `apiFace/API/`

**Main endpoints:**

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| GET    | `/`                   | Service status               |
| GET    | `/health`             | Health check                 |
| POST   | `/add_faces/`         | Add user faces               |
| POST   | `/webcam/start`       | Start webcam capture         |
| POST   | `/webcam/stop`        | Stop webcam capture          |
| GET    | `/webcam/status`      | Webcam status                |
| GET    | `/webcam/stream`      | MJPEG video stream           |
| GET    | `/webcam/recognition` | JSON recognition data        |

**CompreFace integration:**

```python
from compreface import CompreFace
from compreface.service import RecognitionService

compre_face = CompreFace("http://localhost", "8000")
recognition = compre_face.init_face_recognition(API_KEY)
face_collection = recognition.get_face_collection()
```

**Features:**

1. **Face registration**: Upload multiple images of a user
2. **Real-time recognition**: Detect and recognize faces from webcam
3. **Video streaming**: Send frames to frontend in MJPEG format
4. **Subject management**: Add, update, delete faces in CompreFace

**HTTPS configuration:**

- Port: 8002
- Certificates: `certs/cert.pem` and `certs/key.pem`
- Host: `0.0.0.0` (accessible on local network)

---

### 4. CompreFace (Docker)

**Docker Image**: `exadel/compreface:latest`

**Installation:**

```bash
# Option 1: From Docker Hub (recommended)
docker pull exadel/compreface:latest
docker run -d -p 8000:8000 --name compreface exadel/compreface:latest

# Option 2: From GitHub (development)
git clone https://github.com/exadel-inc/CompreFace.git
cd CompreFace
docker-compose up -d
```

**Access:**

- Web UI: http://localhost:8000
- API: http://localhost:8000/api/v1/recognition

**Configuration:**

1. Create account in the web UI
2. Create an application
3. Create a "Recognition" service
4. Copy the API Key
5. Update `apiFace/API/main.py` with the API Key

**Resources:**

- GitHub: https://github.com/exadel-inc/CompreFace
- Documentation: https://github.com/exadel-inc/CompreFace/tree/master/docs
- API Reference: https://github.com/exadel-inc/CompreFace/blob/master/docs/Rest-API-description.md

---

## 🌐 Local Network Configuration

### Configure Access from Multiple Devices

#### 1. Get your Local IP

```powershell
# Windows PowerShell
ipconfig

# Look for your IPv4 in the active network adapter
# Example: 192.168.0.7
```

#### 2. Configure Firewall

Allow traffic on ports: **5173**, **8001**, **8002**, **8000**

```powershell
# Windows PowerShell (run as Administrator)
New-NetFirewallRule -DisplayName "Gym App - Frontend" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Gym App - API CRUD" -Direction Inbound -LocalPort 8001 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Gym App - API Face" -Direction Inbound -LocalPort 8002 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Gym App - CompreFace" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

#### 3. Update URLs in Frontend

Edit `frontend/src/services/api.ts`:

```typescript
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:8001"
    : "https://192.168.0.7:8001"; // ⚠️ Replace with your IP

const FACE_RECOGNITION_API_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:8002"
    : "https://192.168.0.7:8002"; // ⚠️ Replace with your IP
```

#### 4. Access from Other Devices

On your smartphone, tablet, or other computer on the same network:

1. Open the browser
2. Visit: `https://YOUR_LOCAL_IP:5173`
   - Example: `https://192.168.0.7:5173`
3. Accept the self-signed certificate
   - Chrome: "Advanced" → "Continue to..."
   - Safari iOS: May require installing the certificate

**Available URLs:**

| Service    | Local URL              | Network URL              |
| ---------- | ---------------------- | ------------------------ |
| Frontend   | https://localhost:5173 | https://192.168.0.7:5173 |
| CRUD API   | https://localhost:8001 | https://192.168.0.7:8001 |
| Face API   | https://localhost:8002 | https://192.168.0.7:8002 |
| CompreFace | http://localhost:8000  | http://192.168.0.7:8000  |

---

## 🎮 System Usage

### Complete Workflow

#### 1. Register a New User

1. **Access the frontend**: https://localhost:5173
2. Click the **"+ New User"** button
3. Complete the form:
   - **Personal Information**: Name, Last Name, Gender, Date of Birth
   - **Membership**: Code (optional), Department, Start/End Dates
   - **Contact**: Phone, Email, Address
   - **Identification**: Document Type and Number
4. Click **"Save User"**

#### 2. Register User's Face (Optional)

1. In the user list, locate the newly created user
2. Click the **"Face ID"** icon 📷
3. The facial recognition dialog will open
4. Click **"Start Camera"**
5. Allow webcam access
6. Position your face in the center of the camera
7. Click **"Capture Photo"** several times (5-10 photos)
   - **Tip**: Capture from different angles and expressions
8. Click **"Send Photos"**
9. Wait for success confirmation

#### 3. Recognize User by Face

1. In the main menu, click **"Facial Recognition"**
2. Click **"Start Recognition"**
3. The camera will activate automatically
4. A box will appear around detected faces
5. If the face is registered, you'll see:
   - User name
   - Similarity percentage
   - Green color (recognized) or red (unknown)

#### 4. Edit User

1. In the user list, click the **"Edit"** icon ✏️
2. Modify the necessary fields
3. Click **"Update User"**

#### 5. Delete User

1. In the user list, click the **"Delete"** icon 🗑️
2. Confirm deletion
3. The user will be deleted from the database

#### 6. Filter and Search Users

1. Use the search field at the top of the table
2. Filter by:
   - Name
   - Last Name
   - Code
   - Department
   - Email
3. Sort columns by clicking the headers

---

### Interactive API Documentation

#### CRUD API - Swagger UI

Visit: https://localhost:8001/docs

Here you can:

- View all available endpoints
- Test requests directly from the browser
- View data schemas with examples
- Download OpenAPI specification

#### Face Recognition API - Swagger UI

Visit: https://localhost:8002/docs

Features:

- Test facial recognition endpoints
- Upload test images
- View real-time responses
- Parameter documentation

---

## 🔍 Troubleshooting

### ❌ Error: "Cannot connect to the API"

**Problem**: The frontend cannot communicate with the APIs.

**Solutions**:

1. **Verify the APIs are running**:

   ```bash
   # In each terminal, you should see:
   # CRUD API: INFO:     Uvicorn running on https://0.0.0.0:8001
   # Face API: INFO:     Uvicorn running on https://0.0.0.0:8002
   ```

2. **Verify URLs in `frontend/src/services/api.ts`**:

   - Make sure to use `https://` (not `http://`)
   - Verify the IP is correct if accessing from another device

3. **Accept HTTPS certificates**:
   - Manually visit: https://localhost:8001/docs
   - Accept the self-signed certificate
   - Repeat for: https://localhost:8002/docs

---

### ❌ Error: "SSL certificates not found"

**Problem**: When running `run_https.py` a certificate error appears.

**Solution**:

```bash
# For CRUD API
cd apiCRUD/API
python generar_certificados.py

# For Face API
cd apiFace/API
python generate_cert.py
```

Verify the files were created:

- `certs/cert.pem`
- `certs/key.pem`

---

### ❌ Error: "CompreFace not responding"

**Problem**: The Face API cannot connect to CompreFace.

**Solutions**:

1. **Verify the container is running**:

   ```bash
   docker ps
   # Should show: exadel/compreface
   ```

2. **If not running, start it**:

   ```bash
   docker start compreface
   # Or if it doesn't exist:
   docker run -d -p 8000:8000 --name compreface exadel/compreface:latest
   ```

3. **Verify access**:

   - Open: http://localhost:8000
   - You should see the CompreFace web interface

4. **Verify API Key**:
   - Edit `apiFace/API/main.py`
   - Line 23: `API_KEY = "YOUR_API_KEY"`

---

### ❌ Error: "Webcam doesn't start"

**Problem**: The webcam doesn't activate or an error appears.

**Solutions**:

1. **Verify permissions**:

   - Windows: Settings → Privacy → Camera
   - Allow camera access for your browser

2. **Close other applications using the camera**:

   - Zoom, Teams, Skype, etc.

3. **Use HTTP instead of HTTPS** (development only):

   ```bash
   cd apiFace/API
   uvicorn main:app --host 0.0.0.0 --port 8002 --reload
   ```

   - Then update the frontend to use `http://localhost:8002`

4. **Check the logs**:
   ```bash
   # In the Face API terminal, look for:
   INFO:     Webcam started successfully
   ```

---

### ❌ Error: Incorrect Python 32/64-bit

**Problem**: When installing dependencies, an architecture-related error appears.

**Solution**:

**For CRUD API (32-bit)**:

```bash
# Verify Python version
python -c "import struct; print(struct.calcsize('P') * 8)"
# Should display: 32

# If it displays 64, install Python 32-bit from:
# https://www.python.org/downloads/windows/
# Look for "Windows installer (32-bit)"

# Then create venv with:
py -3-32 -m venv venv32
```

**For Face API (64-bit)**:

```bash
# Verify Python version
python -c "import struct; print(struct.calcsize('P') * 8)"
# Should display: 64

# If it displays 32, use:
py -3 -m venv venv_compreface
```

---

### ❌ Error: "Cannot find module 'vite'"

**Problem**: When running `npm run dev` a module not found error appears.

**Solution**:

```bash
cd frontend
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

---

### ❌ Error: CORS in browser

**Problem**: A CORS error appears in the browser console.

**Solution**:

1. **Verify the APIs have CORS enabled**:

   - In `apiCRUD/API/main.py` and `apiFace/API/main.py`
   - There should be:
     ```python
     app.add_middleware(
         CORSMiddleware,
         allow_origins=["*"],
         allow_credentials=True,
         allow_methods=["*"],
         allow_headers=["*"],
     )
     ```

2. **For production, specify origins**:
   ```python
   allow_origins=[
       "https://localhost:5173",
       "https://192.168.0.7:5173",  # Your IP
   ],
   ```

---

### ❌ Error: "Port already in use"

**Problem**: When starting a service, the port is already in use.

**Solution**:

```powershell
# Windows PowerShell
# Find the process using the port (example: 8001)
netstat -ano | findstr :8001

# Note the PID (last column)
# Kill the process:
taskkill /PID <PID> /F

# Example:
# taskkill /PID 12345 /F
```

---

## 📝 Maintenance and Development

### Update Dependencies

#### Frontend

```bash
cd frontend
npm update
npm audit fix
```

#### Python APIs

```bash
# Activate corresponding virtual environment
pip list --outdated
pip install --upgrade <package>
```

### Database Backup

```bash
cd apiCRUD
# Create backup
cp gimnasio.db gimnasio_backup_$(date +%Y%m%d).db

# Export to JSON
python crearBDD.py
```

### Logs and Debugging

**Enable detailed logs**:

```python
# In main.py of any API
import logging
logging.basicConfig(level=logging.DEBUG)
```

**View Docker logs (CompreFace)**:

```bash
docker logs compreface
docker logs -f compreface  # Follow mode
```

---

## 🔐 Security

### ⚠️ Important for Production

Self-signed certificates are **for development only**. For production:

1. **Get valid certificates**:

   - Let's Encrypt (free): https://letsencrypt.org/
   - Cloudflare SSL
   - Hosting provider

2. **Configure environment variables**:

   ```python
   # Don't put API Keys in code
   import os
   API_KEY = os.getenv("COMPREFACE_API_KEY")
   ```

3. **Restrict CORS**:

   ```python
   allow_origins=[
       "https://yourdomain.com",
   ],
   ```

4. **Use a reverse proxy**:
   - Nginx
   - Apache
   - Traefik

---

## 🤝 Contributing

To contribute to the project:

1. Fork the repository
2. Create a branch for your feature: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Create a Pull Request

---

## 📄 License

Copyright © 2026 Vito's Gym Club. All rights reserved.

---

## 📞 Support

If you encounter problems or have questions:

1. Review the [Troubleshooting](#-troubleshooting) section
2. Check the API documentation:
   - CRUD API: https://localhost:8001/docs
   - Face API: https://localhost:8002/docs
3. Review project issues on GitHub
4. Contact the development team

---

## 🙏 Acknowledgements

- **CompreFace** - Facial recognition system: https://github.com/exadel-inc/CompreFace
- **FastAPI** - Modern web framework: https://fastapi.tiangolo.com/
- **React** - UI library: https://react.dev/
- **Material-UI** - UI components: https://mui.com/

---

<div align="center">

**🏋️ Vito's Gym Club - Comprehensive Management System**

Developed with ❤️ to improve our members' experience

[⬆️ Back to top](#-gym-management-system---vitos-gym-club)

</div>
