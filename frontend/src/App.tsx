import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import UserList from './components/UserList';
import UserForm from './components/UserForm.tsx';
import { User } from './types/User';
import { apiService } from './services/api';
import logo from './assets/VitosLogo.jpeg';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff3b3b',
      light: '#ff6b6b',
      dark: '#cc0000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#e0e0e0',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(26, 26, 26, 0.95)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.85)',
    },
    divider: 'rgba(255, 59, 59, 0.2)',
    error: {
      main: '#ff3b3b',
    },
    success: {
      main: '#00ff88',
    },
    warning: {
      main: '#ffa500',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 59, 59, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff3b3b',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 500,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#ff3b3b',
            fontWeight: 600,
          },
          '& .MuiInputBase-input': {
            color: '#ffffff',
          },
          '& .MuiSelect-icon': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 59, 59, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 59, 59, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 59, 59, 0.25)',
            },
          },
        },
      },
    },
  },
});

type View = 'list' | 'form';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<View>('list');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  // Cargar usuarios al iniciar
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      // Normalizar IDs para compatibilidad
      const normalizedData = data.map(user => ({
        ...user,
        _id: user.id,
      }));
      setUsers(normalizedData);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar usuarios. Verifica que la API esté corriendo.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (user: User): Promise<string | undefined> => {
    try {
      setLoading(true);
      
      // Preparar datos para la API
      const userData = {
        nombre: user.nombre,
        apellido: user.apellido,
        codigo: user.codigo,
        departamento: user.departamento,
        genero: user.genero || '',
        fecha_nacimiento: user.fecha_nacimiento || '',
        fecha_inicio: user.fecha_inicio,
        fecha_fin: user.fecha_fin,
        celular: user.celular,
        email: user.email,
        direccion: user.direccion,
        tipo_documento: user.tipo_documento,
        numero_documento: user.numero_documento,
      };

      console.log('Datos enviados a la API:', userData);

      let userId: string;
      if (editingUser && (editingUser._id || editingUser.id)) {
        // Actualizar usuario existente
        userId = String(editingUser._id || editingUser.id!);
        await apiService.updateUser(editingUser._id || editingUser.id!, userData);
        setSnackbar({
          open: true,
          message: 'Usuario actualizado exitosamente',
          severity: 'success',
        });
      } else {
        // Crear nuevo usuario
        const response = await apiService.createUser(userData);
        userId = String(response.id);
        setSnackbar({
          open: true,
          message: 'Usuario registrado exitosamente',
          severity: 'success',
        });
      }
      
      setEditingUser(null);
      setCurrentView('list');
      await loadUsers(); // Recargar la lista
      return userId;
    } catch (error: any) {
      console.error('Error al guardar usuario:', error);
      console.error('Mensaje de error:', error.message);
      setSnackbar({
        open: true,
        message: error.message || 'Error al guardar usuario',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setCurrentView('form');
  };

  const handleDeleteUser = async (id: number) => {
    try {
      setLoading(true);
      await apiService.deleteUser(id);
      setSnackbar({
        open: true,
        message: 'Usuario eliminado exitosamente',
        severity: 'success',
      });
      await loadUsers(); // Recargar la lista
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error al eliminar usuario',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setCurrentView('form');
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setCurrentView('list');
  };

  const handleFaceID = (user?: User) => {
    // Abrir la página de reconocimiento facial en una nueva pestaña
    window.open('/face-recognition.html', '_blank', 'noopener,noreferrer');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 59, 59, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}>
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 59, 59, 0.3)',
            boxShadow: '0 8px 32px rgba(255, 59, 59, 0.15)',
          }}
        >
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img 
                src={logo} 
                alt="Vito's Gym Logo" 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  marginRight: '20px',
                  borderRadius: '50%',
                  border: '3px solid #ff3b3b',
                  boxShadow: '0 0 20px rgba(255, 59, 59, 0.5)',
                  transition: 'all 0.3s ease',
                }} 
              />
              <Box>
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ff3b3b 0%, #ff6b6b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Vito's Gym Club
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500,
                  }}
                >
                  Sistema de Control de Usuarios
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {currentView === 'list' && (
                <Button 
                  variant="outlined"
                  startIcon={<FingerprintIcon />}
                  onClick={() => handleFaceID()}
                  sx={{
                    color: '#ff3b3b',
                    borderColor: '#ff3b3b',
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
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
              )}
              <Button 
                variant="contained"
                startIcon={currentView === 'list' ? <AddIcon /> : <ListIcon />}
                onClick={() => currentView === 'list' ? handleNewUser() : setCurrentView('list')}
                sx={{
                  background: 'linear-gradient(135deg, #ff3b3b 0%, #ff6b6b 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
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
                {currentView === 'list' ? 'Nuevo Usuario' : 'Ver Lista'}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '400px',
            }}>
              <CircularProgress 
                size={60} 
                sx={{ 
                  color: '#ff3b3b',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }} 
              />
            </Box>
          )}
          
          {!loading && currentView === 'list' && (
            <>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nombre, apellido o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      height: '56px',
                    },
                  }}
                />
              </Box>
              <UserList 
                users={users.filter(user => {
                  const search = searchTerm.toLowerCase();
                  return (
                    user.nombre.toLowerCase().includes(search) ||
                    user.apellido.toLowerCase().includes(search) ||
                    (user.codigo && user.codigo.toLowerCase().includes(search))
                  );
                })}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onFaceID={handleFaceID}
              />
            </>
          )}
          
          {!loading && currentView === 'form' && (
            <UserForm
              user={editingUser}
              onSave={handleSaveUser}
              onCancel={handleCancelEdit}
              onFaceID={() => handleFaceID()}
            />
          )}
        </Container>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
