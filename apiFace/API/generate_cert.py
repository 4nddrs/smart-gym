"""
Script para generar certificados SSL autofirmados para desarrollo local
"""
from OpenSSL import crypto
import os

def generate_self_signed_cert(cert_dir="certs"):
    """
    Genera un certificado SSL autofirmado
    
    Args:
        cert_dir: Directorio donde se guardarán los certificados
    """
    # Crear directorio de certificados si no existe
    os.makedirs(cert_dir, exist_ok=True)
    
    # Rutas de los archivos
    cert_file = os.path.join(cert_dir, "cert.pem")
    key_file = os.path.join(cert_dir, "key.pem")
    
    # Crear par de claves
    k = crypto.PKey()
    k.generate_key(crypto.TYPE_RSA, 2048)
    
    # Crear certificado
    cert = crypto.X509()
    cert.get_subject().C = "MX"  # País
    cert.get_subject().ST = "State"  # Estado
    cert.get_subject().L = "City"  # Ciudad
    cert.get_subject().O = "Gym Face API"  # Organización
    cert.get_subject().OU = "Development"  # Unidad organizativa
    cert.get_subject().CN = "localhost"  # Nombre común
    
    # Configurar certificado
    cert.set_serial_number(1000)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(365*24*60*60)  # Válido por 1 año
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(k)
    
    # Agregar extensiones para certificado autofirmado
    cert.add_extensions([
        crypto.X509Extension(b"basicConstraints", False, b"CA:FALSE"),
        crypto.X509Extension(b"keyUsage", False, b"nonRepudiation, digitalSignature, keyEncipherment"),
        crypto.X509Extension(b"subjectAltName", False, b"DNS:localhost, IP:127.0.0.1"),
    ])
    
    # Firmar el certificado
    cert.sign(k, 'sha256')
    
    # Guardar el certificado
    with open(cert_file, "wb") as f:
        f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))
    
    # Guardar la clave privada
    with open(key_file, "wb") as f:
        f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, k))
    
    print(f"✓ Certificados SSL generados exitosamente:")
    print(f"  - Certificado: {cert_file}")
    print(f"  - Clave privada: {key_file}")
    print(f"\n⚠ NOTA: Este es un certificado autofirmado para desarrollo.")
    print(f"  Los navegadores mostrarán una advertencia de seguridad.")
    print(f"  Para producción, usa certificados de una CA confiable (Let's Encrypt, etc.)")

if __name__ == "__main__":
    generate_self_signed_cert()
