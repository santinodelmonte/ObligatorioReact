import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const API_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/species/list?secret=TallerReact2025!';

const SpeciesList = () => {
  const user = useSelector(state => state.auth.user);
  const [species, setSpecies] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    conservationStatus: '',
    naturalAreaId: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);

  const fetchSpecies = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: filters.keyword,
        category: filters.category,
        conservationStatus: filters.conservationStatus,
        naturalAreaId: filters.naturalAreaId.trim() === '' ? undefined : filters.naturalAreaId,
        page: pagination.page,
        pageSize: pagination.pageSize
      };
      const response = await axios.get(API_URL, { params });
      if(response.data && Array.isArray(response.data.items)) {
        setSpecies(response.data.items);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages
        }));
      } else {
        setSpecies([]);
      }
    } catch (error) {
      console.error("Error al obtener las especies", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpecies();
  }, [filters, pagination.page]);

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
      <h2 className="mb-4">Especies Avistadas</h2>
      {user && (
        <div className="mb-3">
          <Link to="/species/crear-especie" className="btn btn-success">
            Agregar Nueva Especie
          </Link>
        </div>
      )}
      <div className="row mb-3">
        <div className="col-md-3">
          <input 
            type="text" 
            name="keyword" 
            className="form-control" 
            placeholder="Nombre común o científico" 
            value={filters.keyword} 
            onChange={handleFilterChange} 
          />
        </div>
        <div className="col-md-3">
          <input 
            type="text" 
            name="category" 
            className="form-control" 
            placeholder="Categoría (mamífero, ave, planta, etc.)" 
            value={filters.category} 
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
        <div className="col-md-3">
          <input 
            type="number" 
            name="naturalAreaId" 
            className="form-control" 
            placeholder="ID Área Natural" 
            value={filters.naturalAreaId} 
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
      ) : species.length === 0 ? (
        <p>No se encontraron especies.</p>
      ) : (
        <div className="row">
          {species.map(specie => (
            <div key={specie.id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{specie.commonName || specie.scientificName}</h5>
                  <p className="card-text">
                    <strong>Categoría:</strong> {specie.category} <br />
                    <strong>Estado:</strong> {specie.conservationStatus} <br />
                    <strong>ID del Área Natural:</strong> {specie.naturalAreaId}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-end">
                  <Link to={`/species/${specie.id}`} className="btn btn-info btn-sm">
                    Ver Detalle
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

export default SpeciesList;
