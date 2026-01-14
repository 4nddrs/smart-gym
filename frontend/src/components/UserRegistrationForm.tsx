import { useState } from 'react';
import { User } from '../types/User';
import './UserRegistrationForm.css';

const UserRegistrationForm = () => {
  const [formData, setFormData] = useState<User>({
    nombre: '',
    apellido: '',
    codigo: '',
    departamento: 'fuerza',
    genero: '',
    fecha_nacimiento: '',
    fecha_inicio: '',
    fecha_fin: '',
    celular: '',
    email: '',
    direccion: '',
    tipo_documento: 'DNI',
    numero_documento: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del usuario:', formData);
    // Aquí se implementará la lógica para enviar los datos al backend
    alert('Usuario registrado exitosamente!');
  };

  const handleFaceID = () => {
    console.log('Iniciar FaceID');
    // Aquí se implementará la lógica de FaceID
    alert('Funcionalidad FaceID - Próximamente');
  };

  return (
    <div className="registration-form">
      <h2 className="form-title">Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ingrese el nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido *</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              placeholder="Ingrese el apellido"
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo">Código *</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              placeholder="Ej: A54"
            />
          </div>

          <div className="form-group">
            <label htmlFor="departamento">Departamento *</label>
            <select
              id="departamento"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              required
            >
              <option value="fuerza">Fuerza</option>
              <option value="cardio">Cardio</option>
              <option value="funcional">Funcional</option>
              <option value="crossfit">CrossFit</option>
              <option value="natacion">Natación</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="genero">Género *</label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha_inicio">Fecha de Inicio *</label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha_fin">Fecha de Fin *</label>
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="celular">Celular *</label>
            <input
              type="tel"
              id="celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              required
              placeholder="Ej: 72268469"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ejemplo@email.com"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="direccion">Dirección *</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              placeholder="Ingrese la dirección completa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo_documento">Tipo de Documento *</label>
            <select
              id="tipo_documento"
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              required
            >
              <option value="DNI">DNI</option>
              <option value="CI">CI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="RUT">RUT</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="numero_documento">Número de Documento *</label>
            <input
              type="text"
              id="numero_documento"
              name="numero_documento"
              value={formData.numero_documento}
              onChange={handleChange}
              required
              placeholder="Ingrese el número"
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-submit">
            Registrar Usuario
          </button>
          <button type="button" className="btn-faceid" onClick={handleFaceID}>
            Iniciar FaceID
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
