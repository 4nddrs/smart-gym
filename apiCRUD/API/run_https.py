"""
Script para ejecutar la API con HTTPS usando los certificados SSL.
"""
import uvicorn
import os

def main():
    # Verificar que existen los certificados
    cert_path = "certs/cert.pem"
    key_path = "certs/key.pem"
    
    if not os.path.exists(cert_path) or not os.path.exists(key_path):
        print("❌ Error: No se encontraron los certificados SSL.")
        print("   Ejecuta primero: python generar_certificados.py")
        return

    print("🚀 Iniciando API del Gimnasio con HTTPS...")
    print("📄 Documentación disponible en: https://localhost:8002/docs")
    print("📊 ReDoc disponible en: https://localhost:8002/redoc")
    print("\n⚠️  NOTA: Tu navegador mostrará una advertencia de seguridad.")
    print("   Esto es normal con certificados autofirmados.")
    print("   Acepta el riesgo para continuar.\n")

    # Ejecutar el servidor con SSL
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        ssl_keyfile=key_path,
        ssl_certfile=cert_path,
        reload=True  # Auto-recarga en desarrollo
    )

if __name__ == "__main__":
    main()
