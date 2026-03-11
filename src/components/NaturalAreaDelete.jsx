import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_DELETE_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/delete?secret=TallerReact2025!';
const API_BYUSER_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/byUser?secret=TallerReact2025!';

const NaturalAreaDelete = () => {
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
        return response.data.items.some(area => area.id === parseInt(id, 10));
      }
    } catch (err) {
      console.error("Error al verificar la propiedad del área:", err);
    }
    return false;
  };

  const handleDelete = async () => {
    if (!authUser) {
      setError("No puedes eliminar un área sin estar autenticado.");
      return;
    }
    setLoading(true);
    const isOwner = await verifyOwnership();
    if (!isOwner) {
      setError("No puedes eliminar un área de otro usuario.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        userId: authUser.id,
        naturalAreaId: parseInt(id, 10)
      };
      const response = await axios.delete(API_DELETE_URL, { data: payload });
      if (response.data && (response.data.result === true || response.data.Result === true)) {
        navigate('/areas');
      } else {
        setError("No se pudo eliminar el área natural.");
      }
    } catch (err) {
      console.error("Error al eliminar el área natural:", err);
      setError("Error al eliminar el área natural.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-danger">Eliminar Área Natural</h2>
      <div className="alert alert-warning">
        ¿Estás seguro que deseas eliminar esta área natural? Esta acción no se puede deshacer.
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
        <Link to={`/areas/${id}`} className="btn btn-secondary">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default NaturalAreaDelete;
