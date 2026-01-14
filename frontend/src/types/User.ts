export interface User {
  _id?: number;
  id?: number; // Para compatibilidad con la API
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
