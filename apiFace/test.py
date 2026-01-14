from compreface import CompreFace
from compreface.service import RecognitionService
from compreface.collections import FaceCollection
# from compreface.collections.face_collections import Subjects  # si necesitas subjects

DOMAIN = "http://localhost"
PORT = "8000"
API_KEY = "85c094c6-e31a-4c00-9573-67b4eed440d6"

# 1) Inicializa CompreFace con servidor y puerto
compre_face = CompreFace(DOMAIN, PORT)

# 2) Inicializa el servicio de reconocimiento con tu API key
recognition: RecognitionService = compre_face.init_face_recognition(API_KEY)

# 3) Obtén la colección de caras desde el servicio
face_collection: FaceCollection = recognition.get_face_collection()

# 4) Ahora puedes agregar la imagen
image_path = "C:/Users/Andre/Downloads/w.jpg"
subject = "jose"

face_collection.add(image_path=image_path, subject=subject)
