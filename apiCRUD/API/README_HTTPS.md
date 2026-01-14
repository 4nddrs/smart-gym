# Configuración HTTPS para API del Gimnasio

## 📋 Archivos agregados

- **generar_certificados.py**: Script para generar certificados SSL autofirmados
- **run_https.py**: Script para ejecutar la API con HTTPS
- **certs/**: Directorio con los certificados SSL (cert.pem y key.pem)

## 🚀 Cómo usar

### 1. Los certificados ya están generados

Los certificados SSL autofirmados ya han sido generados en el directorio `certs/`.

Si necesitas regenerarlos en el futuro:

```bash
python generar_certificados.py
```

### 2. Ejecutar la API con HTTPS

```bash
python run_https.py
```

### 3. Acceder a la API

- **API Base**: https://localhost:8000
- **Documentación Swagger**: https://localhost:8000/docs
- **ReDoc**: https://localhost:8000/redoc

## ⚠️ Advertencia de seguridad del navegador

Al usar certificados autofirmados, tu navegador mostrará una advertencia como:

- "Tu conexión no es privada"
- "Certificado no válido"
- "NET::ERR_CERT_AUTHORITY_INVALID"

**Esto es normal y esperado en desarrollo local.**

### Cómo proceder en cada navegador:

#### Chrome/Edge

1. Haz clic en "Avanzado" o "Advanced"
2. Haz clic en "Ir a localhost (no seguro)" o "Proceed to localhost (unsafe)"

#### Firefox

1. Haz clic en "Avanzado" o "Advanced"
2. Haz clic en "Aceptar el riesgo y continuar" o "Accept the Risk and Continue"

## 🔄 Ejecutar sin HTTPS (modo tradicional)

Si prefieres ejecutar sin HTTPS:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Acceso: http://localhost:8000

## 🔐 Para Producción

**IMPORTANTE**: Los certificados autofirmados son SOLO para desarrollo local.

Para producción, debes usar certificados de una autoridad certificadora (CA) válida:

### Opciones recomendadas:

1. **Let's Encrypt** (Gratis)

   - Usa Certbot para obtener certificados gratuitos
   - Renueva automáticamente cada 90 días
   - https://letsencrypt.org/

2. **Cloudflare** (Gratis)

   - Proporciona SSL/TLS automático
   - Protección DDoS incluida
   - https://www.cloudflare.com/

3. **Certificados comerciales**
   - DigiCert, GlobalSign, Sectigo, etc.

### Configurar certificados de producción:

Modifica `run_https.py` para usar tus certificados reales:

```python
uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=443,  # Puerto estándar HTTPS
    ssl_keyfile="/ruta/a/tu/private-key.pem",
    ssl_certfile="/ruta/a/tu/certificate.pem",
    ssl_ca_certs="/ruta/a/tu/ca-bundle.pem"  # Opcional
)
```

## 📦 Dependencias necesarias

Agregadas a `requirements.txt`:

```
pyopenssl==24.0.0
```

Instalar con:

```bash
pip install -r requirements.txt
```

## 🛡️ Seguridad adicional

Para mejorar la seguridad en producción:

1. **Actualiza CORS** en [main.py](main.py):

```python
allow_origins=["https://tudominio.com"]  # Especifica dominios permitidos
```

2. **Usa variables de entorno** para configuración sensible
3. **Implementa autenticación** (JWT, OAuth2, etc.)
4. **Usa un proxy reverso** (Nginx, Apache) delante de Uvicorn
5. **Habilita HTTP/2** para mejor rendimiento
6. **Configura rate limiting** para prevenir abuso

## 📝 Notas

- Los certificados autofirmados son válidos por 1 año
- El servidor se ejecuta en el puerto 8000 por defecto
- El modo reload está activado para desarrollo (auto-recarga al cambiar código)
- Para desactivar reload en producción, cambia `reload=True` a `reload=False`
