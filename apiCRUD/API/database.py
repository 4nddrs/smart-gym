import sqlite3
from typing import List, Optional
from datetime import datetime
from models import Usuario, UsuarioCreate, UsuarioUpdate
import os

# Ruta a la base de datos (en el directorio padre)
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "gimnasio.db")

def obtener_conexion():
    """Crear y devolver una conexión a la base de datos"""
    conexion = sqlite3.connect(DB_PATH)
    conexion.row_factory = sqlite3.Row  # Para poder acceder a las columnas por nombre
    return conexion

def inicializar_bd():
    """Crear la tabla usuarios si no existe"""
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
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
    
    conexion.commit()
    conexion.close()

def crear_usuario(usuario: UsuarioCreate) -> int:
    """Crear un nuevo usuario en la base de datos"""
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    cursor.execute("""
    INSERT INTO usuarios (
        nombre, apellido, codigo, departamento, fecha_nacimiento,
        fecha_inicio, fecha_fin, celular, email, direccion,
        tipo_documento, numero_documento, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        usuario.nombre,
        usuario.apellido,
        usuario.codigo,
        usuario.departamento,
        usuario.fecha_nacimiento,
        usuario.fecha_inicio,
        usuario.fecha_fin,
        usuario.celular,
        usuario.email,
        usuario.direccion,
        usuario.tipo_documento,
        usuario.numero_documento,
        fecha_actual,
        fecha_actual
    ))
    
    usuario_id = cursor.lastrowid
    conexion.commit()
    conexion.close()
    
    return usuario_id

def obtener_usuario(usuario_id: int) -> Optional[Usuario]:
    """Obtener un usuario por su ID"""
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    cursor.execute("SELECT * FROM usuarios WHERE id = ?", (usuario_id,))
    row = cursor.fetchone()
    conexion.close()
    
    if row:
        return Usuario(**dict(row))
    return None

def obtener_todos_usuarios(skip: int = 0, limit: int = 10000, departamento: Optional[str] = None) -> List[Usuario]:
    """Obtener todos los usuarios con paginación y filtrado opcional"""
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    if departamento:
        cursor.execute(
            "SELECT * FROM usuarios WHERE departamento = ? LIMIT ? OFFSET ?",
            (departamento, limit, skip)
        )
    else:
        cursor.execute("SELECT * FROM usuarios LIMIT ? OFFSET ?", (limit, skip))
    
    rows = cursor.fetchall()
    conexion.close()
    
    return [Usuario(**dict(row)) for row in rows]

def actualizar_usuario(usuario_id: int, usuario: UsuarioUpdate) -> bool:
    """Actualizar un usuario existente"""
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    # Construir la consulta dinámicamente solo con los campos proporcionados
    campos_actualizar = []
    valores = []
    
    if usuario.nombre is not None:
        campos_actualizar.append("nombre = ?")
        valores.append(usuario.nombre)
    
    if usuario.apellido is not None:
        campos_actualizar.append("apellido = ?")
        valores.append(usuario.apellido)
    
    if usuario.codigo is not None:
        campos_actualizar.append("codigo = ?")
        valores.append(usuario.codigo)
    
    if usuario.departamento is not None:
        campos_actualizar.append("departamento = ?")
        valores.append(usuario.departamento)
    
    if usuario.fecha_nacimiento is not None:
        campos_actualizar.append("fecha_nacimiento = ?")
        valores.append(usuario.fecha_nacimiento)
    
    if usuario.fecha_inicio is not None:
        campos_actualizar.append("fecha_inicio = ?")
        valores.append(usuario.fecha_inicio)
    
    if usuario.fecha_fin is not None:
        campos_actualizar.append("fecha_fin = ?")
        valores.append(usuario.fecha_fin)
    
    if usuario.celular is not None:
        campos_actualizar.append("celular = ?")
        valores.append(usuario.celular)
    
    if usuario.email is not None:
        campos_actualizar.append("email = ?")
        valores.append(usuario.email)
    
    if usuario.direccion is not None:
        campos_actualizar.append("direccion = ?")
        valores.append(usuario.direccion)
    
    if usuario.tipo_documento is not None:
        campos_actualizar.append("tipo_documento = ?")
        valores.append(usuario.tipo_documento)
    
    if usuario.numero_documento is not None:
        campos_actualizar.append("numero_documento = ?")
        valores.append(usuario.numero_documento)
    
    # Siempre actualizar updated_at
    campos_actualizar.append("updated_at = ?")
    valores.append(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    # Agregar el ID al final
    valores.append(usuario_id)
    
    if campos_actualizar:
        query = f"UPDATE usuarios SET {', '.join(campos_actualizar)} WHERE id = ?"
        cursor.execute(query, valores)
        conexion.commit()
    
    conexion.close()
    return True

def eliminar_usuario(usuario_id: int) -> bool:
    """Eliminar un usuario por su ID"""
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    cursor.execute("DELETE FROM usuarios WHERE id = ?", (usuario_id,))
    conexion.commit()
    conexion.close()
    
    return True
