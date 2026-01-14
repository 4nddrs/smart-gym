"""
Script para generar certificados SSL autofirmados para desarrollo local.
Estos certificados NO deben usarse en producción.
"""
from OpenSSL import crypto
import os

def generar_certificado_ssl():
    """
    Genera un certificado SSL autofirmado para desarrollo.
    """
    # Crear un par de llaves
    k = crypto.PKey()
    k.generate_key(crypto.TYPE_RSA, 2048)

    # Crear un certificado autofirmado
    cert = crypto.X509()
    cert.get_subject().C = "ES"  # País
    cert.get_subject().ST = "Estado"  # Estado
    cert.get_subject().L = "Ciudad"  # Ciudad
    cert.get_subject().O = "Gimnasio API"  # Organización
    cert.get_subject().OU = "Desarrollo"  # Unidad organizacional
    cert.get_subject().CN = "localhost"  # Nombre común

    # Configurar el certificado
    cert.set_serial_number(1000)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(365*24*60*60)  # Válido por 1 año
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(k)
    cert.sign(k, 'sha256')

    # Crear directorio certs si no existe
    if not os.path.exists("certs"):
        os.makedirs("certs")

    # Guardar el certificado y la llave privada
    with open("certs/cert.pem", "wb") as f:
        f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))
    
    with open("certs/key.pem", "wb") as f:
        f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, k))

    print("✅ Certificados SSL generados exitosamente en el directorio 'certs/'")
    print("   - Certificado: certs/cert.pem")
    print("   - Llave privada: certs/key.pem")
    print("\n⚠️  ADVERTENCIA: Estos son certificados autofirmados para desarrollo.")
    print("   Los navegadores mostrarán una advertencia de seguridad.")
    print("   Para producción, usa certificados de una autoridad certificadora válida.")

if __name__ == "__main__":
    generar_certificado_ssl()
