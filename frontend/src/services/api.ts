// Usa la IP de red para acceso desde dispositivos móviles
// Para desarrollo local usa: 'https://localhost:8001'
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'https://localhost:8001'
  : 'https://192.168.0.7:8001';

export interface ApiUser {
  id?: number;
  nombre: string;
  apellido: string;
  codigo: string;
  departamento: string;
  genero?: string;
  fecha_nacimiento?: string;
  fecha_inicio: string;
  fecha_fin: string;
  celular: string;
  email: string;
  direccion: string;
  tipo_documento: string;
  numero_documento: string;
  created_at?: string;
  updated_at?: string;
}

class ApiService {
  // Crear usuario
  async createUser(userData: Omit<ApiUser, 'id' | 'created_at' | 'updated_at'>): Promise<ApiUser> {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      // Manejar errores de validación de FastAPI (422)
      if (error.detail && Array.isArray(error.detail)) {
        const messages = error.detail.map((err: any) => `${err.loc?.join('.')} - ${err.msg}`).join(', ');
        throw new Error(messages);
      }
      throw new Error(typeof error.detail === 'string' ? error.detail : 'Error al crear usuario');
    }

    return response.json();
  }

  // Obtener todos los usuarios
  async getUsers(params?: { skip?: number; limit?: number; departamento?: string }): Promise<ApiUser[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.departamento) queryParams.append('departamento', params.departamento);

    const url = `${API_BASE_URL}/usuarios${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    return response.json();
  }

  // Obtener usuario por ID
  async getUserById(id: number): Promise<ApiUser> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Usuario con ID ${id} no encontrado`);
    }

    return response.json();
  }

  // Actualizar usuario
  async updateUser(id: number, userData: Partial<Omit<ApiUser, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiUser> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      // Manejar errores de validación de FastAPI (422)
      if (error.detail && Array.isArray(error.detail)) {
        const messages = error.detail.map((err: any) => `${err.loc?.join('.')} - ${err.msg}`).join(', ');
        throw new Error(messages);
      }
      throw new Error(typeof error.detail === 'string' ? error.detail : 'Error al actualizar usuario');
    }

    return response.json();
  }

  // Eliminar usuario
  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al eliminar usuario');
    }
  }

  // Buscar usuarios
  async searchUsers(termino: string): Promise<ApiUser[]> {
    const response = await fetch(`${API_BASE_URL}/usuarios/buscar/${encodeURIComponent(termino)}`);

    if (!response.ok) {
      throw new Error('Error al buscar usuarios');
    }

    return response.json();
  }
}

// Servicio de Reconocimiento Facial
// Usa la IP de red para acceso desde dispositivos móviles
const FACE_RECOGNITION_API_URL = window.location.hostname === 'localhost'
  ? 'https://localhost:8002'
  : 'https://192.168.0.7:8002';

class FaceRecognitionService {
  // Agregar imágenes faciales de un usuario
  async addFaces(subject: string, images: File[]): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('subject', subject);
    
    console.log('Construyendo FormData con subject:', subject);
    console.log('Número de imágenes:', images.length);
    
    images.forEach((file, index) => {
      console.log(`Agregando imagen ${index}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      formData.append('images', file, file.name);
    });

    console.log('Enviando a:', `${FACE_RECOGNITION_API_URL}/add_faces/`);
    
    const response = await fetch(`${FACE_RECOGNITION_API_URL}/add_faces/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error del servidor:', error);
      throw new Error(error.detail || 'Error al subir imágenes faciales');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
export const faceRecognitionService = new FaceRecognitionService();
