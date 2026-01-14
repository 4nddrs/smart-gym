# Vito's Gym - Frontend

Sistema de control de usuarios para Vito's Gym Club desarrollado con React, TypeScript y Material-UI.

## 🚀 Tecnologías

- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- @mui/x-data-grid
- Emotion (CSS-in-JS)

## 📋 Características

- ✅ **CRUD Completo**: Crear, Leer, Actualizar y Eliminar usuarios
- ✅ **Tabla Moderna**: Vista de lista con filtros, paginación y ordenamiento
- ✅ **Formulario Responsivo**: Formulario completo con validaciones
- ✅ **Integración con FaceID**: Botón preparado para integración futura
- ✅ **Interfaz Moderna**: Diseño dark theme con colores corporativos
- ✅ **Notificaciones**: Snackbars para feedback al usuario
- ✅ **Responsive**: Adaptable a diferentes tamaños de pantalla

## 🛠️ Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

3. Abrir en el navegador:

```
http://localhost:5173
```

4. Compilar para producción:

```bash
npm run build
```

## 📝 Funcionalidades

### Lista de Usuarios

- Ver todos los usuarios registrados en una tabla interactiva
- Buscar, filtrar y ordenar usuarios
- Paginación configurable (5, 10, 25, 50 usuarios por página)
- Indicador visual de membresías vencidas
- Acciones rápidas: Editar, Eliminar, FaceID

### Formulario de Registro/Edición

- Campos del formulario:
  - **Información Personal**: Nombre, Apellido, Género, Fecha de Nacimiento
  - **Membresía**: Código, Departamento, Fecha Inicio, Fecha Fin
  - **Contacto**: Celular, Email, Dirección
  - **Identificación**: Tipo de Documento, Número de Documento

### Departamentos Disponibles

- Fuerza
- Cardio
- Funcional
- CrossFit
- Natación

## 🎨 Diseño

El proyecto utiliza:

- **Color primario**: Rojo (#ff0000) - Color corporativo de Vito's Gym
- **Tema**: Dark mode para reducir fatiga visual
- **Componentes**: Material-UI para una UI consistente y profesional
- **Logo**: Integración del logo oficial de Vito's Gym

## 🔜 Próximas Funcionalidades

- Integración completa con backend REST API
- Sistema de autenticación
- Implementación completa de FaceID con cámara
- Exportación de datos (PDF, Excel)
- Dashboard con estadísticas
- Historial de asistencias
- Gestión de pagos

## 📄 Licencia

Copyright © 2026 Vito's Gym Club
