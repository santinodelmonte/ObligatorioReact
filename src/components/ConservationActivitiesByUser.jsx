import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ConservationActivitiesByUser = () => {
  const { id: userId } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = 1;
  const pageSize = 10;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/byUser?secret=TallerReact2025!&userId=${userId}&page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) {
          throw new Error('Error al obtener las actividades de conservación');
        }
        const result = await response.json();
        console.log('Datos completos recibidos:', result);
        
        // Extraer el array de actividades desde result.items
        const activitiesArray = result.items || [];
        setActivities(activitiesArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Cargando actividades de conservación...</p>
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

  if (!activities.length) {
    return (
      <div className="container mt-4">
        <p>No se encontraron actividades de conservación para este usuario.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {activities.map((activity) => (
          <div className="col" key={activity.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Actividad #{activity.id}</h5>
                <p className="card-text">
                  <strong>Área Natural:</strong> {activity.naturalAreaId} <br />
                  <strong>Descripción:</strong> {activity.description} <br />
                  <strong>Fecha:</strong> {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConservationActivitiesByUser;
