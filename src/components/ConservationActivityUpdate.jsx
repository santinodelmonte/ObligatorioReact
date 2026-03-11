import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_UPDATE_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/update?secret=TallerReact2025!';
const API_BYUSER_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/byUser?secret=TallerReact2025!';

const ConservationActivityUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(state => state.auth.user);
  const [formData, setFormData] = useState({
    naturalAreaId: '',
    description: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchActivityData = async () => {
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
            naturalAreaId: found.naturalAreaId.toString(),
            description: found.description,
            date: found.date ? found.date.split('T')[0] : ''
          });
        } else {
          setError("No puedes modificar una actividad de otro usuario.");
        }
      }
    } catch (err) {
      console.error("Error al obtener la actividad para modificación:", err);
      setError("Error al obtener los datos de la actividad.");
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchActivityData();
    } else {
      setError("Debes estar autenticado para modificar una actividad.");
    }
  }, [id, authUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!authUser) {
      setError("No estás autenticado.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        conservationActivity: {
          id: parseInt(id, 10),
          userId: authUser.id,
          naturalAreaId: Number(formData.naturalAreaId),
          description: formData.description,
          date: formData.date
        }
      };
      const response = await axios.put(API_UPDATE_URL, payload);
      if (response.data && (response.data.result === true || response.data.Result === true)) {
        setSuccess(true);
      } else {
        setError("No se pudo actualizar la actividad.");
      }
    } catch (err) {
      console.error("Error al actualizar la actividad:", err);
      setError("Error al actualizar la actividad de conservación.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container mt-4">
        <div className="alert alert-success">
          Modificación exitosa.
        </div>
        <Link to={`/conservation-activity`} className="btn btn-primary">
          Volver a Detalles
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Modificar Actividad de Conservación</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>ID del Área Natural:</label>
            <input 
              type="number"
              name="naturalAreaId"
              className="form-control"
              value={formData.naturalAreaId}
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
            <label>Fecha:</label>
            <input 
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Actividad'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ConservationActivityUpdate;
