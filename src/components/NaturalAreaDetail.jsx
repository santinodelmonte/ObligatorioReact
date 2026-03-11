import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

const API_AREA_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!';
const API_COMMENTS_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/comment/byEntityId?secret=TallerReact2025!';
const GOOGLE_MAPS_API_KEY = 'AIzaSyA4R_0KtIL_XCsYW5p6ZaJbsN41PrPkeAs';

const NaturalAreaDetail = () => {
  const { id } = useParams();
  const authUser = useSelector(state => state.auth.user);
  const [area, setArea] = useState(null);
  const [loadingArea, setLoadingArea] = useState(false);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const commentsPageSize = 10; 

  const [species, setSpecies] = useState([]);
  const [loadingSpecies, setLoadingSpecies] = useState(false);

  const [mapUrl, setMapUrl] = useState('');

  const fetchAreaDetail = async () => {
    setLoadingArea(true);
    try {
      const params = {
        userId: 0,
        keyword: '',
        areaType: '',
        region: '',
        conservationStatus: '',
        page: 1,
        pageSize: 100,
      };
      const response = await axios.get(API_AREA_URL, { params });
      if (response.data && Array.isArray(response.data.items)) {
        const found = response.data.items.find(item => item.id === parseInt(id, 10));
        setArea(found);
        if (found) {
          setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(found.name)}&zoom=5`);
        }
      }
    } catch (error) {
      console.error("Error al obtener los detalles del área natural:", error);
    }
    setLoadingArea(false);
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const params = {
        naturalAreaId: Number(id),
        entityType: "naturalArea",
        page: commentsPage,
        pageSize: commentsPageSize,
      };
      const response = await axios.get(API_COMMENTS_URL, { params });
      if (response.data && Array.isArray(response.data.items)) {
        setComments(response.data.items);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error al obtener los comentarios:", error);
    }
    setLoadingComments(false);
  };

  const fetchSpecies = async () => {
    setLoadingSpecies(true);
    try {
      const speciesUrl = `https://mammal-excited-tarpon.ngrok-free.app/api/species/list?secret=TallerReact2025!&naturalAreaId=${area.id}&page=1&pageSize=10`;
      
      const response = await axios.get(speciesUrl);
      if (response.data && Array.isArray(response.data.items)) {
        setSpecies(response.data.items);
      } else {
        setSpecies([]);
      }
    } catch (error) {
      console.error("Error al obtener las especies:", error);
    }
    setLoadingSpecies(false);
  };

  useEffect(() => {
    fetchAreaDetail();
  }, [id]);

  useEffect(() => {
    if (area) {
      fetchComments();
    }
  }, [area, commentsPage]);

  useEffect(() => {
    if (area) {
      fetchSpecies();
    }
  }, [area]);

  if (loadingArea) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="container mt-4">
        <p>Área natural no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Detalles del Área Natural</h2>
      <div className="card mb-4">
        <img
          src={area.imageUrl}
          className="card-img-top"
          alt={area.name}
          style={{ height: '300px', objectFit: 'cover' }}
        />
        <div className="card-body">
          <h5 className="card-title">{area.name}</h5>
          <p className="card-text">
            <strong>ID del Área:</strong> {area.id} <br />
            {area.userId && (
              <span>
                <strong>ID del Usuario:</strong> {area.userId} <br />
              </span>
            )}
            <strong>Ubicación:</strong> {area.location} <br />
            <strong>Tipo de Área:</strong> {area.areaType} <br />
            <strong>Región:</strong> {area.region} <br />
            <strong>Estado de Conservación:</strong> {area.conservationStatus} <br />
            <strong>Descripción:</strong> {area.description}
          </p>
          <div className="d-flex justify-content-end">
            <Link to={`/areas/${area.id}/update`} className="btn btn-warning me-2">
              Modificar Área
            </Link>
            <Link to={`/areas/${area.id}/delete`} className="btn btn-danger">
              Eliminar Área
            </Link>
          </div>
          <div className="mt-3">
            <Link to={`/areas/${area.id}/comment`} className="btn btn-info">
              Añadir Comentario
            </Link>
          </div>
        </div>
      </div>

      <h3 className="mb-3">Ubicación en el Mapa</h3>
      <iframe
        title="Mapa de ubicación"
        width="100%"
        height="400"
        frameBorder="0"
        style={{ border: 0 }}
        src={mapUrl}
        allowFullScreen
      ></iframe>


      <h3 className="mb-3">Especies Asociadas</h3>
      {loadingSpecies ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando especies...</span>
          </div>
        </div>
      ) : species.length === 0 ? (
        <p>No hay especies asociadas a este área.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {species.map(specie => (
            <div key={specie.id} className="col">
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
      )}


      <h3 className="mb-3">Comentarios</h3>
      {loadingComments ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando comentarios...</span>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <p>No hay comentarios para este área.</p>
      ) : (
        <div className="list-group">
          {comments.map(comment => (
            <div key={comment.id} className="list-group-item">
              <p className="mb-1">
                <strong>ID del Usuario:</strong> {comment.userId}
              </p>
              <p className="mb-1">
                <strong>Comentario:</strong> {comment.text}
              </p>
              <p className="mb-1">
                <strong>Valoración:</strong> 
                {[1, 2, 3, 4, 5].map(estrella => (
                  <FaStar 
                    key={estrella} 
                    size={20} 
                    color={estrella <= comment.rating ? "#ffc107" : "#e4e5e9"} 
                  />
                ))}
              </p>
              <Link to={`/areas/${comment.naturalAreaId}/updateComment/${comment.id}`} className="btn btn-warning btn-sm me-2">
                Modificar
              </Link>
              <Link to={`/comment/${comment.id}/delete`} className="btn btn-danger btn-sm">
                Eliminar
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default NaturalAreaDetail;
