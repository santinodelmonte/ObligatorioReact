import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
      {user && (
        <div className="d-flex justify-content-start m-4">
        <Link to="/crear-area" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i> Agregar nueva área
        </Link>
      </div>
      
      )}
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
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {areas.map((area) => (
            <div className="col" key={area.id}>
              <div className="card h-100">
                <img
                  src={area.imageUrl || "https://via.placeholder.com/300x200?text=Área+Natural"}
                  className="card-img-top"
                  alt={area.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{area.name}</h5>
                  <p className="card-text">
                    <span className="badge bg-info me-2">{area.areaType}</span>
                    <span
                      className={`badge ${
                        area.conservationStatus === "Crítico"
                          ? "bg-danger"
                          : area.conservationStatus === "En riesgo"
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                    >
                      {area.conservationStatus}
                    </span>
                  </p>
                  <p className="card-text">{area.description.substring(0, 100)}...</p>
                  <p className="card-text">
                    <small className="text-muted">Ubicación: {area.location}</small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Región: {area.region}</small>
                  </p>
                </div>
                <div className="card-footer">
                  <Link to={`/natural-areas/${area.id}`} className="btn btn-primary w-100">
                    Ver detalles
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

export default NaturalAreaList;
