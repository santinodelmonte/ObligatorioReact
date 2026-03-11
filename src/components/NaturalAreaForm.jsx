import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!';

const NaturalAreaList = () => {
  const user = useSelector(state => state.auth.user);
  const userId = user?.id;

  const [areas, setAreas] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    areaType: '',
    region: '',
    conservationStatus: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);

  const fetchAreas = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const params = {
        userId,
        keyword: filters.keyword,
        areaType: filters.areaType,
        region: filters.region,
        conservationStatus: filters.conservationStatus,
        page: pagination.page,
        pageSize: pagination.pageSize
      };
      const response = await axios.get(API_URL, { params });
      setAreas(response.data.items);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages
      }));
    } catch (error) {
      console.error("Error al obtener las áreas naturales", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAreas();
  }, [filters, pagination.page, userId]);

  const handleFilterChange = e => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handlePageChange = newPage => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Áreas Naturales</h2>
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            name="keyword"
            className="form-control"
            placeholder="Buscar por nombre"
            value={filters.keyword}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="areaType"
            className="form-control"
            placeholder="Tipo de área"
            value={filters.areaType}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="region"
            className="form-control"
            placeholder="Región o país"
            value={filters.region}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="conservationStatus"
            className="form-control"
            placeholder="Estado de conservación"
            value={filters.conservationStatus}
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
      ) : (
        <div className="row">
          {areas.map(area => (
            <div key={area.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img 
                  src={area.imageUrl} 
                  className="card-img-top" 
                  alt={area.name} 
                  style={{ height: '200px', objectFit: 'cover' }} 
                />
                <div className="card-body">
                  <h5 className="card-title">{area.name}</h5>
                  <p className="card-text">{area.description}</p>
                </div>
                <div className="card-footer">
                  <small className="text-muted">Región: {area.region}</small>
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

export default NaturalAreaList;
