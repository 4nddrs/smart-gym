from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from typing import List, Optional
from compreface import CompreFace
from compreface.service import RecognitionService
from compreface.collections import FaceCollection
import shutil
import os
import logging
from pathlib import Path
import uuid
import cv2
import asyncio
import json
from threading import Lock
import time

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuración de CompreFace
DOMAIN = "http://localhost"
PORT = "8000"
API_KEY = "85c094c6-e31a-4c00-9573-67b4eed440d6"

# Configuración de archivos
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_FILES_PER_REQUEST = 10

# Inicializar CompreFace y FaceCollection
try:
    compre_face = CompreFace(DOMAIN, PORT)
    recognition: RecognitionService = compre_face.init_face_recognition(API_KEY)
    face_collection: FaceCollection = recognition.get_face_collection()
    logger.info("CompreFace inicializado correctamente")
except Exception as e:
    logger.error(f"Error al inicializar CompreFace: {str(e)}")
    raise

# Clase para manejar la webcam y reconocimiento facial
class WebcamManager:
    def __init__(self):
        self.capture: Optional[cv2.VideoCapture] = None
        self.is_running = False
        self.current_frame = None
        self.recognition_results = []
        self.lock = Lock()
        self.last_recognition_time = 0
        self.recognition_interval = 0.3  # Reconocer cada 0.3 segundos
        
    def start(self):
        """Inicia la captura de la webcam"""
        if self.is_running:
            return {"status": "already_running", "message": "La webcam ya está en uso"}
        
        try:
            # Usar DirectShow en Windows para inicio más rápido
            self.capture = cv2.VideoCapture(0, cv2.CAP_DSHOW)
            if not self.capture.isOpened():
                # Fallback a método por defecto
                self.capture = cv2.VideoCapture(0)
                if not self.capture.isOpened():
                    return {"status": "error", "message": "No se pudo abrir la webcam"}
            
            # Configuración optimizada para inicio rápido
            self.capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            self.capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.capture.set(cv2.CAP_PROP_FPS, 30)
            
            # Leer primer frame para "calentar" la cámara
            self.capture.read()
            
            self.is_running = True
            logger.info("Webcam iniciada correctamente")
            return {"status": "success", "message": "Webcam iniciada"}
        except Exception as e:
            logger.error(f"Error al iniciar webcam: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def stop(self):
        """Detiene la captura de la webcam"""
        if self.capture:
            self.capture.release()
            self.capture = None
        self.is_running = False
        self.current_frame = None
        self.recognition_results = []
        logger.info("Webcam detenida")
        return {"status": "success", "message": "Webcam detenida"}
    
    async def get_frame_with_recognition(self):
        """Captura un frame y realiza reconocimiento facial"""
        if not self.is_running or not self.capture:
            return None, []
        
        ret, frame = self.capture.read()
        if not ret:
            return None, []
        
        # Voltear el frame horizontalmente (efecto espejo)
        frame = cv2.flip(frame, 1)
        
        # Realizar reconocimiento facial si ha pasado el intervalo
        current_time = time.time()
        if current_time - self.last_recognition_time >= self.recognition_interval:
            self.last_recognition_time = current_time
            try:
                # Codificar frame con menor calidad para procesamiento más rápido
                _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
                byte_im = buffer.tobytes()
                
                # Reconocer caras
                data = recognition.recognize(byte_im)
                results = data.get('result', [])
                
                with self.lock:
                    self.recognition_results = results
            except Exception as e:
                logger.error(f"Error en reconocimiento facial: {str(e)}")
                with self.lock:
                    self.recognition_results = []
        
        # Dibujar recuadros y datos en el frame
        with self.lock:
            results = self.recognition_results.copy()
        
        for result in results:
            box = result.get('box')
            if box:
                # Dibujar recuadro
                cv2.rectangle(frame, (box['x_min'], box['y_min']),
                            (box['x_max'], box['y_max']), (0, 255, 0), 2)
                
                # Información de la persona
                subjects = result.get('subjects', [])
                y_offset = box['y_min'] - 10
                
                if subjects:
                    subjects = sorted(subjects, key=lambda k: k.get('similarity', 0), reverse=True)
                    subject_name = subjects[0].get('subject', 'Desconocido')
                    similarity = subjects[0].get('similarity', 0)
                    text = f"{subject_name} ({similarity:.2f})"
                    cv2.putText(frame, text, (box['x_min'], y_offset),
                              cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                else:
                    cv2.putText(frame, "Desconocido", (box['x_min'], y_offset),
                              cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        
        return frame, results
    
    def get_recognition_data(self):
        """Obtiene los últimos datos de reconocimiento"""
        with self.lock:
            return self.recognition_results.copy()

# Instancia global del WebcamManager
webcam_manager = WebcamManager()

# Inicializar API
app = FastAPI(title="Face Recognition API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes (desarrollo)
    allow_credentials=False,  # Debe ser False cuando allow_origins es "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carpeta temporal para guardar imágenes subidas
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def validate_image_file(file: UploadFile) -> tuple[bool, str]:
    """Valida que el archivo sea una imagen válida"""
    if not file.filename:
        return False, "Nombre de archivo vacío"
    
    # Verificar extensión
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return False, f"Formato no permitido. Use: {', '.join(ALLOWED_EXTENSIONS)}"
    
    # Verificar content type
    if file.content_type and not file.content_type.startswith('image/'):
        return False, f"Tipo de contenido inválido: {file.content_type}"
    
    return True, "OK"


@app.get("/")
async def root():
    """Endpoint raíz para verificar que el API está funcionando"""
    return {
        "status": "online",
        "message": "Face Recognition API is running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Endpoint de salud del servicio"""
    try:
        # Verificar conexión con CompreFace
        return {
            "status": "healthy",
            "compreface": "connected",
            "upload_dir": os.path.exists(UPLOAD_DIR)
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)}
        )


@app.post("/add_faces/")
async def add_faces(
    subject: str = Form(..., min_length=1, max_length=100),
    images: List[UploadFile] = File(...)
):
    """
    Agrega múltiples imágenes a un sujeto en CompreFace
    
    Args:
        subject: Nombre o identificador del sujeto (1-100 caracteres)
        images: Lista de archivos de imagen (máximo 10)
    
    Returns:
        JSON con mensaje de éxito y detalles de las imágenes procesadas
    """
    # Validar que subject no esté vacío o solo espacios
    subject = subject.strip()
    if not subject:
        raise HTTPException(
            status_code=400,
            detail="El nombre del sujeto no puede estar vacío"
        )
    
    # Validar cantidad de archivos
    if not images:
        raise HTTPException(
            status_code=400,
            detail="Debe proporcionar al menos una imagen"
        )
    
    if len(images) > MAX_FILES_PER_REQUEST:
        raise HTTPException(
            status_code=400,
            detail=f"Máximo {MAX_FILES_PER_REQUEST} imágenes por solicitud. Recibidas: {len(images)}"
        )
    
    logger.info(f"Procesando {len(images)} imágenes para el sujeto: {subject}")
    
    uploaded_files = []
    successful_uploads = []
    errors = []
    
    try:
        # Validar y guardar todos los archivos primero
        for idx, image in enumerate(images):
            try:
                # Validar archivo
                is_valid, error_msg = validate_image_file(image)
                if not is_valid:
                    errors.append({
                        "file": image.filename,
                        "error": error_msg
                    })
                    logger.warning(f"Archivo inválido: {image.filename} - {error_msg}")
                    continue
                
                # Leer contenido del archivo
                contents = await image.read()
                file_size = len(contents)
                
                # Validar tamaño
                if file_size == 0:
                    errors.append({
                        "file": image.filename,
                        "error": "Archivo vacío"
                    })
                    logger.warning(f"Archivo vacío: {image.filename}")
                    continue
                
                if file_size > MAX_FILE_SIZE:
                    errors.append({
                        "file": image.filename,
                        "error": f"Archivo muy grande ({file_size} bytes). Máximo: {MAX_FILE_SIZE} bytes"
                    })
                    logger.warning(f"Archivo muy grande: {image.filename} ({file_size} bytes)")
                    continue
                
                # Generar nombre único para evitar conflictos
                file_ext = Path(image.filename).suffix.lower()
                unique_filename = f"{uuid.uuid4()}{file_ext}"
                file_path = os.path.join(UPLOAD_DIR, unique_filename)
                
                # Guardar archivo
                with open(file_path, "wb") as f:
                    f.write(contents)
                
                uploaded_files.append(file_path)
                logger.info(f"Archivo guardado: {unique_filename} ({file_size} bytes)")
                
                # Intentar agregar a CompreFace
                try:
                    result = face_collection.add(image_path=file_path, subject=subject)
                    successful_uploads.append({
                        "file": image.filename,
                        "size": file_size,
                        "status": "success"
                    })
                    logger.info(f"Imagen agregada a CompreFace: {image.filename}")
                except Exception as cf_error:
                    error_detail = str(cf_error)
                    errors.append({
                        "file": image.filename,
                        "error": f"Error en CompreFace: {error_detail}"
                    })
                    logger.error(f"Error de CompreFace para {image.filename}: {error_detail}")
                
            except Exception as e:
                error_detail = str(e)
                errors.append({
                    "file": image.filename if image.filename else f"archivo_{idx}",
                    "error": error_detail
                })
                logger.error(f"Error procesando {image.filename}: {error_detail}")
    
    finally:
        # Limpiar archivos temporales
        for file_path in uploaded_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Archivo temporal eliminado: {file_path}")
            except Exception as e:
                logger.error(f"Error al eliminar archivo temporal {file_path}: {str(e)}")
    
    # Preparar respuesta
    total_processed = len(successful_uploads)
    total_failed = len(errors)
    
    if total_processed == 0:
        # Todas las imágenes fallaron
        raise HTTPException(
            status_code=400,
            detail={
                "message": "No se pudo procesar ninguna imagen",
                "errors": errors
            }
        )
    
    response = {
        "message": f"Se procesaron {total_processed} de {len(images)} imágenes para '{subject}'",
        "subject": subject,
        "successful": total_processed,
        "failed": total_failed,
        "details": successful_uploads
    }
    
    if errors:
        response["errors"] = errors
        logger.warning(f"Proceso completado con {total_failed} errores")
    
    logger.info(f"Proceso completado: {total_processed} éxitos, {total_failed} fallos")
    
    return response


@app.post("/webcam/start")
async def start_webcam():
    """
    Inicia la captura de la webcam para reconocimiento facial en tiempo real
    
    Returns:
        JSON con el estado de la operación
    """
    result = webcam_manager.start()
    logger.info(f"Solicitud de inicio de webcam: {result['status']}")
    
    if result['status'] == 'error':
        raise HTTPException(status_code=500, detail=result['message'])
    
    return result


@app.post("/webcam/stop")
async def stop_webcam():
    """
    Detiene la captura de la webcam
    
    Returns:
        JSON con el estado de la operación
    """
    result = webcam_manager.stop()
    logger.info("Webcam detenida")
    return result


@app.get("/webcam/status")
async def webcam_status():
    """
    Verifica si la webcam está activa
    
    Returns:
        JSON con el estado de la webcam
    """
    return {
        "is_running": webcam_manager.is_running,
        "status": "active" if webcam_manager.is_running else "inactive"
    }


@app.get("/webcam/stream")
async def webcam_stream():
    """
    Stream de video en tiempo real con reconocimiento facial
    
    Returns:
        StreamingResponse con frames MJPEG
    """
    if not webcam_manager.is_running:
        raise HTTPException(
            status_code=400,
            detail="La webcam no está activa. Usa /webcam/start primero"
        )
    
    async def generate_frames():
        """Genera frames de video con reconocimiento facial"""
        try:
            while webcam_manager.is_running:
                frame, _ = await webcam_manager.get_frame_with_recognition()
                
                if frame is None:
                    await asyncio.sleep(0.033)  # ~30 FPS
                    continue
                
                # Codificar frame como JPEG
                _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                frame_bytes = buffer.tobytes()
                
                # Retornar en formato MJPEG
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                
                await asyncio.sleep(0.033)  # ~30 FPS
        except Exception as e:
            logger.error(f"Error en streaming: {str(e)}")
        finally:
            logger.info("Stream finalizado")
    
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.get("/webcam/recognition")
async def get_recognition_data():
    """
    Obtiene los datos de reconocimiento facial actuales (solo nombres)
    
    Returns:
        JSON con los nombres de las personas reconocidas
    """
    if not webcam_manager.is_running:
        return {
            "status": "inactive",
            "faces": []
        }
    
    results = webcam_manager.get_recognition_data()
    
    # Solo extraer nombres de personas reconocidas
    faces = []
    for result in results:
        subjects = result.get('subjects', [])
        if subjects:
            # Obtener la mejor coincidencia
            best_match = max(subjects, key=lambda k: k.get('similarity', 0))
            faces.append({
                "name": best_match.get('subject'),
                "similarity": round(best_match.get('similarity', 0), 4)
            })
        else:
            faces.append({
                "name": None,
                "similarity": 0
            })
    
    return {
        "status": "active",
        "faces": faces
    }
