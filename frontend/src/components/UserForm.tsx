import { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, MenuItem, Button, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { User } from '../types/User';
import { faceRecognitionService } from '../services/api';

interface UserFormProps {
  user?: User | null;
  onSave: (user: User) => Promise<string | undefined>;
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

  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturedBlobs, setCapturedBlobs] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [uploadingFaces, setUploadingFaces] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Limpiar stream de cámara cuando se cierra el diálogo
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Primero guardar el usuario y obtener su ID
    const userId = await onSave(formData);
    
    // Luego subir las imágenes faciales si hay alguna
    if (capturedBlobs.length > 0 && userId) {
      try {
        setUploadingFaces(true);
        const subject = userId;
        
        // Verificar que los blobs tengan contenido
        console.log('Blobs capturados:', capturedBlobs.length);
        capturedBlobs.forEach((blob, i) => {
          console.log(`Blob ${i}: tamaño=${blob.size}, tipo=${blob.type}`);
        });
        
        // Convertir los blobs a archivos
        const imageFiles = capturedBlobs.map((blob, index) => {
          const file = new File([blob], `face_${index}.jpg`, { 
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          console.log(`File ${index}: tamaño=${file.size}, tipo=${file.type}, nombre=${file.name}`);
          return file;
        });
        
        console.log('Subiendo', imageFiles.length, 'imágenes faciales para:', subject);
        await faceRecognitionService.addFaces(subject, imageFiles);
        console.log('Imágenes faciales subidas exitosamente');
        alert('¡Imágenes faciales subidas exitosamente!');
        
        // Limpiar las imágenes capturadas después de subirlas exitosamente
        setCapturedImages([]);
        setCapturedBlobs([]);
      } catch (error: any) {
        console.error('Error al subir imágenes faciales:', error);
        alert(`Error al subir las imágenes faciales: ${error.message}`);
      } finally {
        setUploadingFaces(false);
      }
    }
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      setCameraOpen(true);
      
      // Dar tiempo para que el video se inicialice
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        setVideoReady(true);
      }, 500);
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setVideoReady(false);
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob && blob.size > 0) {
        setCapturedBlobs(prev => [...prev, blob]);
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImages(prev => [...prev, imageUrl]);
      }
    }, 'image/jpeg', 0.9);
  };

  const deleteImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
    setCapturedBlobs(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        // Agregar el blob del archivo
        setCapturedBlobs(prev => [...prev, file]);
        
        // Crear URL para vista previa
        const imageUrl = URL.createObjectURL(file);
        setCapturedImages(prev => [...prev, imageUrl]);
      }
    });

    // Limpiar el input para permitir seleccionar los mismos archivos nuevamente
    event.target.value = '';
  };

  const handleCameraClose = () => {
    closeCamera();
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

            {/* Sección de Captura de Rostro */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  background: 'rgba(255, 59, 59, 0.1)',
                  borderRadius: '16px',
                  border: '2px dashed rgba(255, 59, 59, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#ff6b6b',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <FingerprintIcon />
                  Reconocimiento Facial
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<CameraAltIcon />}
                    onClick={openCamera}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff3b3b 100%)',
                      fontWeight: 600,
                      borderRadius: '12px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff3b3b 0%, #cc0000 100%)',
                      },
                    }}
                  >
                    Usar Cámara
                  </Button>

                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #444 0%, #222 100%)',
                      fontWeight: 600,
                      borderRadius: '12px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #555 0%, #333 100%)',
                      },
                    }}
                  >
                    Subir Fotos
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Box>

                {capturedImages.length > 0 && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      {capturedImages.length} {capturedImages.length === 1 ? 'foto capturada' : 'fotos capturadas'}
                    </Typography>
                    <ImageList cols={4} gap={8}>
                      {capturedImages.map((img, index) => (
                        <ImageListItem key={index}>
                          <img
                            src={img}
                            alt={`Captura ${index + 1}`}
                            loading="lazy"
                            style={{ borderRadius: '8px' }}
                          />
                          <ImageListItemBar
                            actionIcon={
                              <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                                onClick={() => deleteImage(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={uploadingFaces}
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
              {uploadingFaces ? 'Subiendo imágenes...' : (user ? 'Actualizar' : 'Registrar')}
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

      {/* Diálogo de Cámara */}
      <Dialog
        open={cameraOpen}
        onClose={handleCameraClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(18, 18, 18, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 59, 59, 0.3)',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #ff3b3b 0%, #ff6b6b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoCameraIcon sx={{ color: '#ff3b3b' }} />
            <span>Captura de Rostro</span>
          </Box>
          <IconButton onClick={handleCameraClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ 
            position: 'relative', 
            width: '100%', 
            borderRadius: '12px',
            overflow: 'hidden',
            mb: 2,
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '12px',
              }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Box>
          
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, textAlign: 'center' }}>
            Posiciona tu rostro en el centro y captura varias fotos desde diferentes ángulos
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
          <Button
            onClick={capturePhoto}
            variant="contained"
            startIcon={<PhotoCameraIcon />}
            disabled={!videoReady}
            sx={{
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #ff3b3b 0%, #ff6b6b 100%)',
              fontWeight: 600,
              borderRadius: '12px',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff3b3b 100%)',
              },
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            {videoReady ? `Capturar Foto (${capturedImages.length})` : 'Cargando...'}
          </Button>
          <Button
            onClick={handleCameraClose}
            variant="outlined"
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
              },
            }}
          >
            Finalizar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserForm;
