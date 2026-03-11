import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/insert?secret=TallerReact2025!';

const CreateConservationActivity = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const userId = user?.id;
  
  const [formData, setFormData] = useState({
    naturalAreaId: '',
    description: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!userId) {
      console.error('Usuario no autenticado');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        conservationActivity: {
          userId,
          naturalAreaId: Number(formData.naturalAreaId),
          description: formData.description,
          date: formData.date,
        }
      };
      await axios.post(API_URL, payload);
      navigate('/conservation-activity');
    } catch (error) {
      console.error("Error al agregar la actividad de conservación", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Agregar Actividad de Conservación</h2>
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
          />
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
          {loading ? 'Agregando...' : 'Agregar Actividad'}
        </button>
      </form>
    </div>
  );
};

export default CreateConservationActivity;
