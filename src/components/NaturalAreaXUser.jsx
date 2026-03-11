import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const NaturalAreaXUser = () => {
  const { id: userId } = useParams();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = 1;
  const pageSize = 10;

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(
          `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/byUser?userId=${userId}&page=${page}&pageSize=${pageSize}`
        );

        if (!response.ok) {
          throw new Error("Error al obtener las áreas naturales");
        }

        const result = await response.json();

        const areasArray = Array.isArray(result.items) ? result.items : [];

        console.log("Áreas extraídas:", areasArray);
        setAreas(areasArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [userId]);

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Cargando áreas naturales...</p>
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

  if (!areas.length) {
    return (
      <div className="container mt-4">
        <p>No se encontraron áreas naturales para este usuario.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NaturalAreaXUser;
