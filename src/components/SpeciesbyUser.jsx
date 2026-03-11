import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SpeciesByUser = () => {
  const { id: userId } = useParams();
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = 1;
  const pageSize = 10;

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await fetch(
          `https://mammal-excited-tarpon.ngrok-free.app/api/species/byUser?secret=TallerReact2025!&userId=${userId}&page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) {
          throw new Error('Error al obtener las especies');
        }
        const result = await response.json();
        
        const speciesArray = result.items || [];
        setSpecies(speciesArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [userId]);

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Cargando especies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p className="alert alert-danger">Error: {error}</p>
      </div>
    );
  }

  if (!species.length) {
    return (
      <div className="container mt-4">
        <p>No se encontraron especies para este usuario.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {species.map((specie) => (
          <div className="col" key={specie.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{specie.commonName || specie.scientificName}</h5>
                <p className="card-text">
                  <strong>Categoría:</strong> {specie.category} <br />
                  <strong>Estado:</strong> {specie.conservationStatus} <br />
                  <strong>ID del Área Natural:</strong> {specie.naturalAreaId}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeciesByUser;
