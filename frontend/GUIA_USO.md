# Guía de Uso - Vito's Gym Sistema de Control

## Inicio Rápido

### 1. Iniciar la Aplicación

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Navegación Principal

### Vista de Lista

La vista principal muestra una tabla con todos los usuarios registrados.

**Funcionalidades:**

- **Búsqueda**: Usa el buscador integrado en la tabla
- **Filtrado**: Click en los headers para ordenar por columna
- **Paginación**: Cambia entre páginas en la parte inferior
- **Selección Múltiple**: Checkbox para seleccionar varios usuarios

**Botones de Acción por Usuario:**

- 🔒 **FaceID**: Registrar o verificar identidad facial
- ✏️ **Editar**: Modificar información del usuario
- 🗑️ **Eliminar**: Eliminar usuario (con confirmación)

**Indicadores Visuales:**

- **Código**: Badge rojo con el código del usuario
- **Departamento**: Badge azul con el área de entrenamiento
- **Fecha de Fin**:
  - 🟢 Verde: Membresía activa
  - 🔴 Rojo: Membresía vencida

### Crear Nuevo Usuario

**Opción 1**: Click en el botón "Nuevo Usuario" en la barra superior
**Opción 2**: Click en el botón flotante ➕ (esquina inferior derecha)

**Campos Obligatorios:**
Todos los campos son requeridos para el registro.

**Validaciones:**

- Email: Debe tener formato válido
- Celular: Sólo números
- Fechas: Formato correcto de fecha

### Editar Usuario

1. En la lista, click en el icono de **Editar** (lápiz)
2. Se abrirá el formulario con los datos actuales
3. Modifica los campos necesarios
4. Click en "Actualizar Usuario"
5. Si deseas cancelar, click en "Cancelar"

### Eliminar Usuario

1. Click en el icono de **Eliminar** (papelera)
2. Aparecerá un diálogo de confirmación
3. Confirma la eliminación o cancela

**⚠️ Importante**: La eliminación es permanente y no se puede deshacer.

### FaceID

El botón de FaceID está preparado para:

- Registrar la identidad facial al crear un usuario
- Verificar identidad en futuros check-ins

**Estado Actual**: Muestra un mensaje de "Funcionalidad en desarrollo"

## Departamentos

Los usuarios pueden ser asignados a los siguientes departamentos:

- **Fuerza**: Entrenamiento con pesas y resistencia
- **Cardio**: Ejercicios cardiovasculares
- **Funcional**: Entrenamiento funcional y cross-training
- **CrossFit**: Entrenamientos de alta intensidad
- **Natación**: Actividades acuáticas

## Tipos de Documento

Soporta los siguientes documentos de identidad:

- **DNI**: Documento Nacional de Identidad
- **CI**: Cédula de Identidad
- **Pasaporte**: Pasaporte internacional
- **RUT**: Rol Único Tributario

## Datos de Ejemplo

La aplicación viene con 2 usuarios de ejemplo para pruebas:

1. **Juan Pérez** (A01) - Departamento de Fuerza
2. **María González** (A02) - Departamento de Cardio

Puedes eliminarlos o editarlos según necesites.

## Atajos de Teclado

- **Enter**: Enviar formulario
- **Esc**: Cerrar diálogos

## Notificaciones

El sistema muestra notificaciones en la esquina inferior derecha para:

- ✅ Usuario registrado exitosamente
- ✅ Usuario actualizado exitosamente
- ✅ Usuario eliminado exitosamente

Las notificaciones se ocultan automáticamente después de 4 segundos.

## Responsive Design

La aplicación se adapta a diferentes tamaños de pantalla:

- **Desktop**: Vista completa con tabla amplia
- **Tablet**: Layout adaptado con columnas ajustadas
- **Mobile**: Vista optimizada para pantallas pequeñas

## Próximos Pasos

Una vez domines el uso básico, considera:

1. Integrar con el backend API
2. Configurar la funcionalidad de FaceID
3. Personalizar los departamentos según tu gimnasio
4. Agregar más campos personalizados si es necesario

## Soporte

Para reportar problemas o sugerencias, contacta al administrador del sistema.
