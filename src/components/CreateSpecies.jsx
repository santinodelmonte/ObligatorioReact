import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/species/insert?secret=TallerReact2025!';

const CreateSpecies = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const userId = user?.id;

  const [formData, setFormData] = useState({
    commonName: '',
    scientificName: '',
    category: '',
    conservationStatus: '',
    naturalAreaId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error('Usuario no autenticado');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        userId,
        species: {
          ...formData,
          naturalAreaId: Number(formData.naturalAreaId)
        }
      };
      await axios.post(API_URL, payload);
      navigate('/species');
    } catch (error) {
      console.error("Error al agregar la especie", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Agregar Nueva Especie</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre Común:</label>
          <input
            type="text"
            name="commonName"
            className="form-control"
            value={formData.commonName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Nombre Científico:</label>
          <input
            type="text"
            name="scientificName"
            className="form-control"
            value={formData.scientificName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Categoría:</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Agregando...' : 'Agregar Especie'}
        </button>
      </form>
    </div>
  );
};

export default CreateSpecies;
