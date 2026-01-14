import sqlite3
import json
from datetime import datetime, timedelta

# Crear la base de datos SQLite
conexion = sqlite3.connect("gimnasio.db")
cursor = conexion.cursor()

# Crear tabla usuarios con los campos especificados
cursor.execute("""
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    codigo TEXT,
    departamento TEXT NOT NULL,
    fecha_nacimiento TEXT,
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT NOT NULL,
    celular TEXT,
    email TEXT,
    direccion TEXT,
    tipo_documento TEXT,
    numero_documento TEXT,
    created_at TEXT,
    updated_at TEXT
)
""")

print("Tabla 'usuarios' creada exitosamente.")

# Leer el archivo JSON
with open('gimnasio_db.usuarios.json', 'r', encoding='utf-8') as file:
    usuarios_data = json.load(file)

# Función para extraer fecha del formato MongoDB
def extraer_fecha(fecha_obj):
    if not fecha_obj:
        return None
    if isinstance(fecha_obj, dict):
        if '$date' in fecha_obj:
            fecha_str = fecha_obj['$date']
            if isinstance(fecha_str, str):
                # Formato ISO: "2025-11-25T00:00:00.000Z"
                try:
                    dt = datetime.fromisoformat(fecha_str.replace('Z', '+00:00'))
                    return dt.strftime('%Y-%m-%d %H:%M:%S')
                except:
                    return None
            elif isinstance(fecha_str, dict) and '$numberLong' in fecha_str:
                # Formato timestamp: {"$numberLong": "-239500800000"}
                try:
                    timestamp = int(fecha_str['$numberLong']) / 1000
                    dt = datetime.fromtimestamp(timestamp)
                    return dt.strftime('%Y-%m-%d %H:%M:%S')
                except:
                    return None
    return None

# Migrar los datos
contador_exitosos = 0
contador_fallidos = 0
contador_autocompletados = 0

# Fechas por defecto
fecha_hoy = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
fecha_manana = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')

for usuario in usuarios_data:
    try:
        # Extraer solo los campos requeridos y opcionales
        nombre = usuario.get('nombre', '').strip()
        apellido = usuario.get('apellido', '').strip()
        codigo = usuario.get('codigo')
        
        # Para departamento, usar departamento_nombre si existe, sino "Sin departamento"
        departamento = usuario.get('departamento_nombre') or usuario.get('departamento') or "Sin departamento"
        
        fecha_nacimiento = extraer_fecha(usuario.get('fecha_nacimiento'))
        fecha_inicio = extraer_fecha(usuario.get('fecha_inicio'))
        fecha_fin = extraer_fecha(usuario.get('fecha_fin'))
        
        # Autocompletar fechas si faltan
        if not fecha_inicio:
            fecha_inicio = fecha_hoy
            contador_autocompletados += 1
        if not fecha_fin:
            fecha_fin = fecha_manana
            contador_autocompletados += 1
        
        celular = usuario.get('celular')
        email = usuario.get('email')
        direccion = usuario.get('direccion')
        tipo_documento = usuario.get('tipo_documento')
        numero_documento = usuario.get('numero_documento')
        
        created_at = extraer_fecha(usuario.get('created_at'))
        updated_at = extraer_fecha(usuario.get('updated_at'))
        
        # Validar solo campos obligatorios críticos (nombre y apellido)
        if not nombre or not apellido:
            print(f"⚠️  Saltando usuario con _id {usuario.get('_id')}: falta nombre o apellido")
            contador_fallidos += 1
            continue
        
        # Insertar en la base de datos
        cursor.execute("""
            INSERT INTO usuarios (
                nombre, apellido, codigo, departamento, fecha_nacimiento,
                fecha_inicio, fecha_fin, celular, email, direccion,
                tipo_documento, numero_documento, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            nombre, apellido, codigo, departamento, fecha_nacimiento,
            fecha_inicio, fecha_fin, celular, email, direccion,
            tipo_documento, numero_documento, created_at, updated_at
        ))
        
        contador_exitosos += 1
        
    except Exception as e:
        print(f"❌ Error migrando usuario con _id {usuario.get('_id')}: {e}")
        contador_fallidos += 1

# Guardar cambios
conexion.commit()

# Mostrar resumen
print("\n" + "="*50)
print("RESUMEN DE MIGRACIÓN")
print("="*50)
print(f"✅ Usuarios migrados exitosamente: {contador_exitosos}")
print(f"❌ Usuarios fallidos: {contador_fallidos}")
print(f"� Campos autocompletados: {contador_autocompletados}")
print(f"�📊 Total de registros procesados: {len(usuarios_data)}")

# Verificar datos insertados
cursor.execute("SELECT COUNT(*) FROM usuarios")
total = cursor.fetchone()[0]
print(f"📁 Total de registros en la base de datos: {total}")

# Mostrar algunos ejemplos
cursor.execute("SELECT id, nombre, apellido, departamento, fecha_inicio, fecha_fin FROM usuarios LIMIT 5")
print("\n🔍 Primeros 5 registros insertados:")
for row in cursor.fetchall():
    print(f"   ID: {row[0]}, Nombre: {row[1]} {row[2]}, Dpto: {row[3]}, Inicio: {row[4]}, Fin: {row[5]}")

# Cerrar conexión
conexion.close()
print("\n✅ Migración completada. Base de datos guardada como 'gimnasio.db'")
