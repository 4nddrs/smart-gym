import { useState, useEffect } from 'react';
import { Box, Paper, TextField, MenuItem, Button, Typography, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CancelIcon from '@mui/icons-material/Cancel';
import { User } from '../types/User';

interface UserFormProps {
  user?: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
  onFaceID: () => void;
}

const UserForm = ({ user, onSave, onCancel, onFaceID }: UserFormProps) => {
  const [formData, setFormData] = useState<User>({
    nombre: '',
    apellido: '',
    codigo: '',
    departamento: '',
    genero: '',
    fecha_nacimiento: '',
    fecha_inicio: '',
    fecha_fin: '',
    celular: '',
    email: '',
    direccion: '',
    tipo_documento: '',
    numero_documento: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        fecha_nacimiento: user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toISOString().split('T')[0] : '',
        fecha_inicio: user.fecha_inicio ? new Date(user.fecha_inicio).toISOString().split('T')[0] : '',
        fecha_fin: user.fecha_fin ? new Date(user.fecha_fin).toISOString().split('T')[0] : '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const departamentos = [
    { value: 'fuerza', label: 'Fuerza' },
    { value: 'funcional', label: 'Funcional' },
    { value: 'crossfit', label: 'CrossFit' },
    { value: 'aerobico', label: 'Aeróbico' },
    { value: 'natacion', label: 'Natación' },
  ];

  const generos = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' },
  ];

  const tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'Pasaporte', label: 'Pasaporte' },
  ];

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      minHeight: '56px',
      fontSize: '1rem',
      '& fieldset': { 
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: '1.5px',
      },
      '&:hover fieldset': { 
        borderColor: 'rgba(255, 59, 59, 0.5)',
        borderWidth: '1.5px',
      },
      '&.Mui-focused fieldset': { 
        borderColor: '#ff3b3b',
        borderWidth: '2px',
      },
      '& .MuiSelect-select': {
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '14px',
        paddingRight: '14px',
        display: 'flex',
        alignItems: 'center',
      },
      '& input': {
        padding: '16px 14px',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '1rem',
      '&.Mui-focused': { 
        color: '#ff3b3b',
        fontWeight: 600,
      },
    },
    '& .MuiSelect-icon': { 
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '1.5rem',
    },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        bgcolor: 'rgba(26, 26, 26, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 59, 59, 0.3)',
        borderRadius: '12px',
        mt: 1,
        maxHeight: '300px',
        '& .MuiMenuItem-root': {
          color: '#ffffff',
          padding: '14px 24px',
          fontSize: '1rem',
          minHeight: '50px',
          '&:hover': {
            backgroundColor: 'rgba(255, 59, 59, 0.15)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 59, 59, 0.25)',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(255, 59, 59, 0.35)',
            },
          },
        },
      },
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(18, 18, 18, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 59, 59, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #ff3b3b 0%, #ff6b6b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
            textTransform: 'uppercase',
            mb: 4,
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          {user ? 'Editar Usuario' : 'Registro de Usuario'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Nombre */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Apellido */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Código */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Departamento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                SelectProps={{ MenuProps: menuProps }}
                sx={textFieldStyle}
              >
                {departamentos.map((dept) => (
                  <MenuItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Género */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Género"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                SelectProps={{ MenuProps: menuProps }}
                sx={textFieldStyle}
              >
                {generos.map((gen) => (
                  <MenuItem key={gen.value} value={gen.value}>
                    {gen.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Fecha de Nacimiento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Fecha de Inicio */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Fecha de Inicio"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Fecha de Fin */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Fecha de Fin"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Celular */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Celular"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>

            {/* Tipo de Documento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Documento"
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                SelectProps={{ MenuProps: menuProps }}
                sx={textFieldStyle}
              >
                {tiposDocumento.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Número de Documento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Documento"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #ff3b3b 0%, #ff6b6b 100%)',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(255, 59, 59, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff3b3b 100%)',
                  boxShadow: '0 6px 25px rgba(255, 59, 59, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {user ? 'Actualizar' : 'Registrar'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<FingerprintIcon />}
              onClick={onFaceID}
              sx={{
                px: 4,
                py: 1.5,
                color: '#ff3b3b',
                borderColor: '#ff3b3b',
                fontWeight: 600,
                borderRadius: '12px',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#ff6b6b',
                  borderWidth: '2px',
                  backgroundColor: 'rgba(255, 59, 59, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Iniciar FACEID
            </Button>

            {user && (
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                sx={{
                  px: 4,
                  py: 1.5,
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  fontWeight: 600,
                  borderRadius: '12px',
                  borderWidth: '2px',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default UserForm;
