import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_UPDATE_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/update?secret=TallerReact2025!';
const API_BYUSER_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/byUser?secret=TallerReact2025!';

const NaturalAreaUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(state => state.auth.user);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    areaType: '',
    region: '',
    conservationStatus: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchAreaData = async () => {
    try {
      const params = {
        userId: authUser.id,
        page: 1,
        pageSize: 100,
      };
      const response = await axios.get(API_BYUSER_URL, { params });
      if (response.data && Array.isArray(response.data.items)) {
        const found = response.data.items.find(item => item.id === parseInt(id, 10));
        if (found) {
          setFormData({
            name: found.name,
            location: found.location,
            areaType: found.areaType,
            region: found.region,
            conservationStatus: found.conservationStatus,
            description: found.description,
            imageUrl: found.imageUrl
          });
        } else {
          setError("No puedes modificar un área de otro usuario.");
        }
      }
    } catch (err) {
      console.error("Error al obtener el área para modificación:", err);
      setError("Error al obtener los datos del área.");
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchAreaData();
    } else {
      setError("Debes estar autenticado para modificar un área.");
    }

  }, [id, authUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      setError("No estás autenticado.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        userId: authUser.id,
        naturalArea: {
          id: parseInt(id, 10),
          ...formData
        }
      };
      const response = await axios.put(API_UPDATE_URL, payload);
      if (response.data && (response.data.result === true || response.data.Result === true)) {
        setSuccess(true);
      } else {
        setError("No se pudo actualizar el área.");
      }
    } catch (err) {
      console.error("Error al actualizar el área natural:", err);
      setError("Error al actualizar el área natural.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container mt-4">
        <div className="alert alert-success">
          Modificación exitosa.
        </div>
        <Link to={`/natural-areas`} className="btn btn-primary">
          Volver a Detalles
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Modificar Área Natural</h2>
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      {!error && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nombre:</label>
            <input 
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Ubicación:</label>
            <input 
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Tipo de Área:</label>
            <input 
              type="text"
              name="areaType"
              className="form-control"
              value={formData.areaType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Región:</label>
            <input 
              type="text"
              name="region"
              className="form-control"
              value={formData.region}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Estado de Conservación:</label>
            <input 
              type="text"
              name="conservationStatus"
              className="form-control"
              value={formData.conservationStatus}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Descripción:</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label>URL de Imagen:</label>
            <input 
              type="text"
              name="imageUrl"
              className="form-control"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Área'}
          </button>
        </form>
      )}
    </div>
  );
};

export default NaturalAreaUpdate;
