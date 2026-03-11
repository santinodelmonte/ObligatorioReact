import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_DELETE_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/species/delete?secret=TallerReact2025!';
const API_BYUSER_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/species/byUser?secret=TallerReact2025!';

const SpeciesDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyOwnership = async () => {
    try {
      const params = {
        userId: authUser.id,
        page: 1,
        pageSize: 100,
      };
      const response = await axios.get(API_BYUSER_URL, { params });
      if (response.data && Array.isArray(response.data.items)) {
        return response.data.items.some(specie => specie.id === parseInt(id, 10));
      }
    } catch (err) {
      console.error("Error al verificar la propiedad de la especie:", err);
    }
    return false;
  };

  const handleDelete = async () => {
    if (!authUser) {
      setError("No puedes eliminar una especie sin estar autenticado.");
      return;
    }
    setLoading(true);
    const isOwner = await verifyOwnership();
    if (!isOwner) {
      setError("No puedes eliminar una especie de otro usuario.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        userId: authUser.id,
        speciesId: parseInt(id, 10)
      };
      const response = await axios.delete(API_DELETE_URL, { data: payload });
      if (response.data && (response.data.result === true || response.data.Result === true)) {
        navigate('/species');
      } else {
        setError("No se pudo eliminar la especie.");
      }
    } catch (err) {
      console.error("Error al eliminar la especie:", err);
      setError("Error al eliminar la especie.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-danger">Eliminar Especie</h2>
      <div className="alert alert-warning">
        ¿Estás seguro que deseas eliminar esta especie? Esta acción no se puede deshacer.
      </div>
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      <div className="mb-3">
        <button 
          className="btn btn-danger me-2" 
          onClick={handleDelete} 
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
        <Link to={`/species/${id}`} className="btn btn-secondary">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default SpeciesDelete;
