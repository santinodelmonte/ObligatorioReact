import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_UPDATE_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/species/update?secret=TallerReact2025!';
const API_BYUSER_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/species/byUser?secret=TallerReact2025!';

const SpeciesUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(state => state.auth.user);
  const [formData, setFormData] = useState({
    commonName: '',
    scientificName: '',
    category: '',
    conservationStatus: '',
    naturalAreaId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchSpeciesData = async () => {
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
            commonName: found.commonName,
            scientificName: found.scientificName,
            category: found.category,
            conservationStatus: found.conservationStatus,
            naturalAreaId: found.naturalAreaId.toString()
          });
        } else {
          setError("No puedes modificar una especie de otro usuario.");
        }
      }
    } catch (err) {
      console.error("Error al obtener la especie para modificación:", err);
      setError("Error al obtener los datos de la especie.");
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchSpeciesData();
    } else {
      setError("Debes estar autenticado para modificar una especie.");
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
        userId: authUser.id,
        species: {
          id: parseInt(id, 10),
          ...formData,
          naturalAreaId: Number(formData.naturalAreaId)
        }
      };
      const response = await axios.put(API_UPDATE_URL, payload);
      if (response.data && (response.data.result === true || response.data.Result === true)) {
        setSuccess(true);
      } else {
        setError("No se pudo actualizar la especie.");
      }
    } catch (err) {
      console.error("Error al actualizar la especie:", err);
      setError("Error al actualizar la especie.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container mt-4">
        <div className="alert alert-success">
          Modificación exitosa.
        </div>
        <Link to={`/species/${id}`} className="btn btn-primary">
          Volver a Detalles
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Modificar Especie</h2>
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      {!error && (
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
            {loading ? 'Actualizando...' : 'Actualizar Especie'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SpeciesUpdate;
