import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/byUser?secret=TallerReact2025!';

const ConservationActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [filterUserId, setFilterUserId] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const authUser = useSelector(state => state.auth.user);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      if (filterUserId.trim() === '') {
        setActivities([]);
        setLoading(false);
        return;
      }
      const params = {
        userId: Number(filterUserId),
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
      console.log('Parámetros de búsqueda:', params);
      const response = await axios.get(API_URL, { params });
      console.log('Respuesta de actividades:', response.data);
      if (response.data && Array.isArray(response.data.items)) {
        setActivities(response.data.items);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages,
        }));
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Error al obtener actividades de conservación", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [filterUserId, pagination.page]);

  const handleFilterChange = (e) => {
    setFilterUserId(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Actividades de Conservación</h2>
      {authUser && (
        <div className="mb-3">
          <Link to="/conservation-activity/crear-actividad" className="btn btn-success">
            Agregar Actividad de Conservación
          </Link>
        </div>
      )}
      <div className="row mb-3">
        <div className="col-md-4">
          <input 
            type="number" 
            name="filterUserId" 
            className="form-control" 
            placeholder="ID del usuario" 
            value={filterUserId} 
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="mb-3">
        <button 
          className="btn btn-primary" 
          onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
        >
          Filtrar
        </button>
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : activities.length === 0 ? (
        <p>No se encontraron actividades para el usuario especificado.</p>
      ) : (
        <div className="row">
          {activities.map(activity => (
            <div key={activity.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Actividad #{activity.id}</h5>
                  <p className="card-text">
                    <strong>Área Natural:</strong> {activity.naturalAreaId} <br />
                    <strong>Descripción:</strong> {activity.description} <br />
                    <strong>Fecha:</strong> {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-end">
                  <Link to={`/conservation-activity/${activity.id}/update`} className="btn btn-warning btn-sm me-2">
                    Modificar Actividad
                  </Link>
                  <Link to={`/conservation-activity/${activity.id}/delete`} className="btn btn-danger">
                    Eliminar Actividad
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Anterior
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Página {pagination.page} de {pagination.totalPages}
            </span>
          </li>
          <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ConservationActivityList;
