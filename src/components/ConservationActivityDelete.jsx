import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_DELETE_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/delete?secret=TallerReact2025!';
const API_BYUSER_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/byUser?secret=TallerReact2025!';

const ConservationActivityDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para verificar que la actividad pertenece al usuario autenticado
  const verifyOwnership = async () => {
    try {
      const params = {
        userId: authUser.id,
        page: 1,
        pageSize: 100,
      };
      const response = await axios.get(API_BYUSER_URL, { params });
      if (response.data && Array.isArray(response.data.items)) {
        return response.data.items.some(activity => activity.id === parseInt(id, 10));
      }
    } catch (err) {
      console.error("Error al verificar la propiedad de la actividad:", err);
    }
    return false;
  };

  const handleDelete = async () => {
    if (!authUser) {
      setError("Debes estar autenticado para eliminar una actividad.");
      return;
    }
    setLoading(true);
    const isOwner = await verifyOwnership();
    if (!isOwner) {
      setError("No puedes eliminar una actividad de otro usuario.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        userId: authUser.id,
        id: parseInt(id, 10)
      };
      const response = await axios.delete(API_DELETE_URL, { data: payload });
      if (response.data && (response.data.result === true || response.data.Result === true)) {
        navigate('/conservation-activity');
      } else {
        setError("No se pudo eliminar la actividad de conservación.");
      }
    } catch (err) {
      console.error("Error al eliminar la actividad:", err);
      setError("Error al eliminar la actividad de conservación.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-danger">Eliminar Actividad de Conservación</h2>
      <div className="alert alert-warning">
        ¿Estás seguro que deseas eliminar esta actividad de conservación? Esta acción no se puede deshacer.
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <button 
          className="btn btn-danger me-2" 
          onClick={handleDelete} 
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
        <Link to={`/conservation-activity/${id}`} className="btn btn-secondary">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default ConservationActivityDelete;
