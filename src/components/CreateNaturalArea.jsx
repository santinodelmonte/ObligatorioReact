import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateNaturalArea = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [areaType, setAreaType] = useState('');
  const [region, setRegion] = useState('');
  const [conservationStatus, setConservationStatus] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!user) {
      setError('Debes iniciar sesión para agregar un área natural.');
      setIsSubmitting(false);
      return;
    }

    if (!name || !location || !areaType || !region || !conservationStatus || !description) {
      setError('Por favor completa todos los campos obligatorios.');
      setIsSubmitting(false);
      return;
    }

    const newArea = {
      userId: user.id,
      naturalArea: {
        name,
        location,
        areaType,
        region,
        conservationStatus,
        description,
        imageUrl,
      },
    };

    try {
      const response = await fetch(
        'https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/insert?secret=TallerReact2025!',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newArea),
        }
      );

      const data = await response.json();

      if (data.result) {
        setSuccess('Área natural creada exitosamente.');

        setName('');
        setLocation('');
        setAreaType('');
        setRegion('');
        setConservationStatus('');
        setDescription('');
        setImageUrl('');
        

        setTimeout(() => {
          navigate('/natural-areas');
        }, 2000);
      } else {
        setError('Ocurrió un error al crear el área natural.');
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const conservationStatusOptions = ['Crítico', 'En riesgo', 'Estable', 'Óptimo'];
  const areaTypeOptions = ['Reserva Natural', 'Parque Nacional', 'Área Protegida', 'Santuario de Vida Silvestre', 'Monumento Natural'];
  const regionOptions = ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Misiones', 'Corrientes', 'Santiago del Estero', 'Salta', 'Chaco', 'San Juan', 'Jujuy', 'Río Negro', 'Formosa', 'Neuquén', 'Chubut', 'San Luis', 'La Pampa', 'Catamarca', 'La Rioja', 'Santa Cruz', 'Tierra del Fuego'];

  if (!user) {
    return (
      <div className="container my-4">
        <div className="alert alert-warning">
          Debes <a href="/login" className="alert-link">iniciar sesión</a> para agregar un área natural.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Crear Nueva Área Natural</h2>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Ubicación <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="location" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <div className="col-md-6">
                    <label htmlFor="areaType" className="form-label">Tipo de área <span className="text-danger">*</span></label>
                    <select 
                      className="form-select" 
                      id="areaType" 
                      value={areaType} 
                      onChange={e => setAreaType(e.target.value)} 
                      required
                    >
                      <option value="">-- Seleccionar tipo --</option>
                      {areaTypeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  </div> 

                  <div>   
                  <div className="mb-3">
                  <label htmlFor="region" className="form-label">Region <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="region" 
                    value={region} 
                    onChange={e => setRegion(e.target.value)} 
                    required 
                  />
                </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="conservationStatus" className="form-label">Estado de conservación <span className="text-danger">*</span></label>
                  <select 
                    className="form-select" 
                    id="conservationStatus" 
                    value={conservationStatus} 
                    onChange={e => setConservationStatus(e.target.value)} 
                    required
                  >
                    <option value="">-- Seleccionar estado --</option>
                    {conservationStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripción <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control" 
                    id="description" 
                    rows="4" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    required
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="imageUrl" className="form-label">URL de la imagen</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    id="imageUrl" 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)} 
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <div className="form-text">Introduce una URL válida para mostrar una imagen del área natural.</div>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => navigate('/natural-areas')}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Área Natural'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNaturalArea;