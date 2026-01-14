# Configuración HTTPS para Face Recognition API

## 📋 Requisitos

Asegúrate de tener instalado el paquete `pyOpenSSL`:

```bash
pip install pyOpenSSL
```

## 🔐 Generar Certificados SSL

### Paso 1: Generar certificados autofirmados

Ejecuta el script de generación de certificados:

```bash
python generate_cert.py
```

Este script creará:

- `certs/cert.pem` - Certificado SSL
- `certs/key.pem` - Clave privada

Los certificados son válidos por 1 año y están configurados para `localhost`.

## 🚀 Ejecutar la Aplicación

### Opción 1: Con HTTPS (Recomendado para desarrollo)

```bash
python run_https.py
```

La aplicación estará disponible en:

- `https://localhost:8001`
- `https://127.0.0.1:8001`

### Opción 2: Con HTTP (desarrollo simple)

```bash
uvicorn main:app --reload --port 8001
```

La aplicación estará disponible en:

- `http://localhost:8001`

## ⚠️ Advertencias del Navegador

Al usar certificados autofirmados, los navegadores mostrarán una advertencia de seguridad. Esto es **normal** y **seguro** en desarrollo local.

### Cómo proceder en cada navegador:

**Chrome/Edge:**

1. Click en "Avanzado"
2. Click en "Continuar a localhost (no seguro)"

**Firefox:**

1. Click en "Avanzado"
2. Click en "Aceptar el riesgo y continuar"

**Safari:**

1. Click en "Mostrar detalles"
2. Click en "visitar este sitio web"

## 🔧 Actualizar CORS para HTTPS

Si tu frontend está en HTTPS, actualiza las URLs de CORS en `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://localhost:5173",  # Vite con HTTPS
        "https://localhost:3000",  # React con HTTPS
        "http://localhost:5173",   # Mantener HTTP si es necesario
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🌐 Para Producción

**IMPORTANTE:** Los certificados autofirmados son **solo para desarrollo**. Para producción:

### Opción 1: Let's Encrypt (Gratuito)

```bash
# Instalar Certbot
pip install certbot

# Generar certificado
certbot certonly --standalone -d tudominio.com
```

### Opción 2: Usar un Reverse Proxy

- **Nginx** o **Apache** con certificados SSL
- **Cloudflare** para SSL automático
- **AWS/Azure** Load Balancer con certificados

### Opción 3: Servicios Gestionados

- Deploy en servicios como:
  - **Heroku** (SSL automático)
  - **AWS Elastic Beanstalk** (con Certificate Manager)
  - **Google Cloud Run** (HTTPS automático)
  - **Azure App Service** (SSL incluido)

## 📝 Estructura de Archivos

```
API/
├── main.py                  # Aplicación principal
├── generate_cert.py        # Script para generar certificados
├── run_https.py            # Script para ejecutar con HTTPS
├── README_HTTPS.md         # Esta documentación
├── certs/                  # Directorio de certificados (generado)
│   ├── cert.pem           # Certificado SSL
│   └── key.pem            # Clave privada
└── uploads/               # Directorio de imágenes temporales
```

## 🔒 Seguridad

- **No subas** los archivos `cert.pem` y `key.pem` a Git
- Los certificados autofirmados son seguros para desarrollo local
- En producción, siempre usa certificados de una CA confiable
- Considera agregar `certs/` a tu `.gitignore`

## 🐛 Solución de Problemas

### Error: "Los certificados SSL no se encontraron"

```bash
# Genera los certificados primero
python generate_cert.py
```

### Error: "ModuleNotFoundError: No module named 'OpenSSL'"

```bash
# Instala la dependencia
pip install pyOpenSSL
```

### Error: "Address already in use"

```bash
# Cambia el puerto en run_https.py
# Línea: port=8001  ->  port=8002
```

### El navegador sigue mostrando "No seguro"

Es normal con certificados autofirmados. Para confiar en el certificado:

**Windows:**

1. Abre el certificado en `certs/cert.pem`
2. "Instalar certificado" → "Equipo local"
3. Colócalo en "Entidades de certificación raíz de confianza"

**macOS:**

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certs/cert.pem
```

**Linux:**

```bash
sudo cp certs/cert.pem /usr/local/share/ca-certificates/localhost.crt
sudo update-ca-certificates
```

## 📚 Recursos Adicionales

- [FastAPI - HTTPS](https://fastapi.tiangolo.com/deployment/https/)
- [Uvicorn - SSL](https://www.uvicorn.org/#running-with-https)
- [Let's Encrypt](https://letsencrypt.org/)
