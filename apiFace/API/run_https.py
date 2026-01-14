"""
Script para ejecutar la aplicación FastAPI con HTTPS
"""
import uvicorn
import os
import sys

def main():
    # Verificar si existen los certificados
    cert_file = "certs/cert.pem"
    key_file = "certs/key.pem"
    
    if not os.path.exists(cert_file) or not os.path.exists(key_file):
        print("❌ ERROR: Los certificados SSL no se encontraron.")
        print(f"   Buscando: {cert_file} y {key_file}")
        print("\n💡 Genera los certificados ejecutando:")
        print("   python generate_cert.py")
        sys.exit(1)
    
    print("🔐 Iniciando servidor con HTTPS...")
    print(f"   Certificado: {cert_file}")
    print(f"   Clave privada: {key_file}")
    print("\n🌐 Servidor disponible en:")
    print("   - https://localhost:8002")
    print("   - https://127.0.0.1:8002")
    print("\n📹 Endpoints de Webcam:")
    print("   - POST https://localhost:8002/webcam/start")
    print("   - POST https://localhost:8002/webcam/stop")
    print("   - GET  https://localhost:8002/webcam/stream")
    print("   - GET  https://localhost:8002/webcam/recognition")
    print("\n📄 Documentación: https://localhost:8002/docs")
    print("🎯 Demo HTML: Abre webcam_demo.html en tu navegador")
    print("\n⚠  NOTA: Los navegadores mostrarán una advertencia de seguridad")
    print("   porque el certificado es autofirmado. Es seguro continuar en desarrollo.")
    print("\n📝 Presiona Ctrl+C para detener el servidor\n")
    
    # Configuración de Uvicorn con SSL
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        ssl_keyfile=key_file,
        ssl_certfile=cert_file,
        reload=True,  # Recarga automática en desarrollo
        log_level="info"
    )

if __name__ == "__main__":
    main()
