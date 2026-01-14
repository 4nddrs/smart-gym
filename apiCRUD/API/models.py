from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Modelo base con campos comunes
class UsuarioBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100, description="Nombre del usuario")
    apellido: str = Field(..., min_length=1, max_length=100, description="Apellido del usuario")
    codigo: Optional[str] = Field(None, max_length=50, description="Código único del usuario")
    departamento: str = Field(..., min_length=1, max_length=100, description="Departamento del usuario")
    fecha_nacimiento: Optional[str] = Field(None, description="Fecha de nacimiento (YYYY-MM-DD)")
    fecha_inicio: str = Field(..., description="Fecha de inicio de membresía (YYYY-MM-DD)")
    fecha_fin: str = Field(..., description="Fecha de fin de membresía (YYYY-MM-DD)")
    celular: Optional[str] = Field(None, max_length=20, description="Número de celular")
    email: Optional[str] = Field(None, max_length=100, description="Correo electrónico")
    direccion: Optional[str] = Field(None, max_length=200, description="Dirección del usuario")
    tipo_documento: Optional[str] = Field(None, max_length=50, description="Tipo de documento (DNI, Pasaporte, etc.)")
    numero_documento: Optional[str] = Field(None, max_length=50, description="Número de documento")

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Juan",
                "apellido": "Pérez",
                "codigo": "GYM001",
                "departamento": "Cardio",
                "fecha_nacimiento": "1990-05-15",
                "fecha_inicio": "2025-01-01",
                "fecha_fin": "2025-12-31",
                "celular": "+57 300 123 4567",
                "email": "juan.perez@example.com",
                "direccion": "Calle 123 #45-67",
                "tipo_documento": "DNI",
                "numero_documento": "12345678"
            }
        }

# Modelo para crear un nuevo usuario (sin ID, sin timestamps)
class UsuarioCreate(UsuarioBase):
    pass

# Modelo para actualizar un usuario (todos los campos opcionales)
class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    apellido: Optional[str] = Field(None, min_length=1, max_length=100)
    codigo: Optional[str] = Field(None, max_length=50)
    departamento: Optional[str] = Field(None, min_length=1, max_length=100)
    fecha_nacimiento: Optional[str] = None
    fecha_inicio: Optional[str] = None
    fecha_fin: Optional[str] = None
    celular: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    direccion: Optional[str] = Field(None, max_length=200)
    tipo_documento: Optional[str] = Field(None, max_length=50)
    numero_documento: Optional[str] = Field(None, max_length=50)

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Juan",
                "apellido": "Pérez",
                "celular": "+57 300 999 8888",
                "email": "juan.nuevo@example.com"
            }
        }

# Modelo completo con ID y timestamps (para respuestas)
class Usuario(UsuarioBase):
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "nombre": "Juan",
                "apellido": "Pérez",
                "codigo": "GYM001",
                "departamento": "Cardio",
                "fecha_nacimiento": "1990-05-15",
                "fecha_inicio": "2025-01-01",
                "fecha_fin": "2025-12-31",
                "celular": "+57 300 123 4567",
                "email": "juan.perez@example.com",
                "direccion": "Calle 123 #45-67",
                "tipo_documento": "DNI",
                "numero_documento": "12345678",
                "created_at": "2025-01-13 10:30:00",
                "updated_at": "2025-01-13 10:30:00"
            }
        }

# Modelo para el estado de membresía
class EstadoMembresia(BaseModel):
    nombre: str = Field(..., description="Nombre del usuario")
    apellido: str = Field(..., description="Apellido del usuario")
    fecha_inicio: str = Field(..., description="Fecha de inicio de membresía")
    fecha_fin: str = Field(..., description="Fecha de fin de membresía")
    estado: str = Field(..., description="Estado de la membresía (VALIDO o VENCIDO)")

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Juan",
                "apellido": "Pérez",
                "fecha_inicio": "2025-01-01",
                "fecha_fin": "2025-12-31",
                "estado": "VALIDO"
            }
        }
