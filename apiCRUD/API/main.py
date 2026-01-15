from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
from models import Usuario, UsuarioCreate, UsuarioUpdate, EstadoMembresia
from database import (
    crear_usuario,
    obtener_usuario,
    obtener_todos_usuarios,
    actualizar_usuario,
    eliminar_usuario,
    inicializar_bd
)

# Inicializar la aplicación FastAPI
app = FastAPI(
    title="API CRUD Gimnasio",
    description="API REST para gestionar usuarios del gimnasio",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes. Para producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

# Inicializar la base de datos al iniciar la aplicación
@app.on_event("startup")
async def startup_event():
    inicializar_bd()

@app.get("/", tags=["Root"])
async def read_root():
    return {
        "mensaje": "Bienvenido a la API del Gimnasio",
        "documentacion": "/docs",
        "version": "1.0.0"
    }

# CREATE - Crear un nuevo usuario
@app.post("/usuarios", response_model=Usuario, status_code=status.HTTP_201_CREATED, tags=["Usuarios"])
async def crear_nuevo_usuario(usuario: UsuarioCreate):
    """
    Crear un nuevo usuario con toda la información:
    - **nombre**: Nombre del usuario (requerido)
    - **apellido**: Apellido del usuario (requerido)
    - **codigo**: Código único del usuario (opcional)
    - **departamento**: Departamento del usuario (requerido)
    - **fecha_nacimiento**: Fecha de nacimiento en formato YYYY-MM-DD (opcional)
    - **fecha_inicio**: Fecha de inicio de membresía (requerido)
    - **fecha_fin**: Fecha de fin de membresía (requerido)
    - **celular**: Número de celular (opcional)
    - **email**: Correo electrónico (opcional)
    - **direccion**: Dirección del usuario (opcional)
    - **tipo_documento**: Tipo de documento (opcional)
    - **numero_documento**: Número de documento (opcional)
    """
    try:
        usuario_id = crear_usuario(usuario)
        usuario_creado = obtener_usuario(usuario_id)
        if not usuario_creado:
            raise HTTPException(status_code=500, detail="Error al crear el usuario")
        return usuario_creado
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# READ - Obtener todos los usuarios
@app.get("/usuarios", response_model=List[Usuario], tags=["Usuarios"])
async def listar_usuarios(
    skip: int = 0,
    limit: int = 10000,
    departamento: Optional[str] = None
):
    """
    Obtener lista de todos los usuarios.
    - **skip**: Número de registros a omitir (para paginación)
    - **limit**: Número máximo de registros a devolver
    - **departamento**: Filtrar por departamento (opcional)
    """
    try:
        usuarios = obtener_todos_usuarios(skip, limit, departamento)
        return usuarios
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# READ - Obtener un usuario específico por ID
@app.get("/usuarios/{usuario_id}", response_model=Usuario, tags=["Usuarios"])
async def obtener_usuario_por_id(usuario_id: int):
    """
    Obtener un usuario específico por su ID.
    """
    usuario = obtener_usuario(usuario_id)
    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {usuario_id} no encontrado"
        )
    return usuario

# UPDATE - Actualizar un usuario existente
@app.put("/usuarios/{usuario_id}", response_model=Usuario, tags=["Usuarios"])
async def actualizar_usuario_por_id(usuario_id: int, usuario: UsuarioUpdate):
    """
    Actualizar un usuario existente. Solo se actualizan los campos proporcionados.
    """
    # Verificar que el usuario existe
    usuario_existente = obtener_usuario(usuario_id)
    if usuario_existente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {usuario_id} no encontrado"
        )
    
    try:
        actualizar_usuario(usuario_id, usuario)
        usuario_actualizado = obtener_usuario(usuario_id)
        return usuario_actualizado
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE - Eliminar un usuario
@app.delete("/usuarios/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Usuarios"])
async def eliminar_usuario_por_id(usuario_id: int):
    """
    Eliminar un usuario por su ID.
    """
    # Verificar que el usuario existe
    usuario_existente = obtener_usuario(usuario_id)
    if usuario_existente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {usuario_id} no encontrado"
        )
    
    try:
        eliminar_usuario(usuario_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint adicional para búsqueda
@app.get("/usuarios/buscar/{termino}", response_model=List[Usuario], tags=["Usuarios"])
async def buscar_usuarios(termino: str):
    """
    Buscar usuarios por nombre, apellido o código.
    """
    try:
        usuarios = obtener_todos_usuarios()
        resultados = [
            u for u in usuarios
            if termino.lower() in u.nombre.lower() or
               termino.lower() in u.apellido.lower() or
               (u.codigo and termino.lower() in u.codigo.lower())
        ]
        return resultados
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para verificar estado de membresía
@app.get("/membresia/estado/{usuario_id}", response_model=EstadoMembresia, tags=["Membresía"])
async def verificar_estado_membresia(usuario_id: int):
    """
    Verificar el estado de membresía de un usuario por su ID.
    
    - **usuario_id**: ID del usuario
    
    Devuelve la fecha de inicio, fecha de fin y el estado de la membresía:
    - **VALIDO**: La membresía está activa (fecha actual <= fecha fin)
    - **VENCIDO**: La membresía ha expirado (fecha actual > fecha fin)
    """
    try:
        # Buscar el usuario por ID
        usuario_encontrado = obtener_usuario(usuario_id)
        
        if not usuario_encontrado:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con ID {usuario_id} no encontrado"
            )
        
        # Obtener la fecha actual
        fecha_actual = datetime.now().date()
        
        # Convertir fecha_fin a objeto date para comparar
        try:
            fecha_fin = datetime.strptime(usuario_encontrado.fecha_fin, '%Y-%m-%d').date()
        except ValueError:
            raise HTTPException(
                status_code=500,
                detail="Formato de fecha inválido en la base de datos"
            )
        
        # Determinar el estado de la membresía
        # La membresía es válida si la fecha actual es MENOR que la fecha de fin
        # (la fecha de fin es el primer día NO válido)
        estado = "VALIDO" if fecha_actual < fecha_fin else "VENCIDO"
        
        return EstadoMembresia(
            nombre=usuario_encontrado.nombre,
            apellido=usuario_encontrado.apellido,
            fecha_inicio=usuario_encontrado.fecha_inicio,
            fecha_fin=usuario_encontrado.fecha_fin,
            estado=estado
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
