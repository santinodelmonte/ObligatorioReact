import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

const API_SPECIES_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/species/list?secret=TallerReact2025!';
const API_COMMENTS_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/comment/byEntityId?secret=TallerReact2025!';

const SpeciesDetail = () => {
    const { id } = useParams();
    const authUser = useSelector(state => state.auth.user);
    const [specie, setSpecie] = useState(null);
    const [loadingSpecies, setLoadingSpecies] = useState(false);

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentsPage, setCommentsPage] = useState(1);
    const commentsPageSize = 10;

    const fetchSpeciesDetail = async () => {
        setLoadingSpecies(true);
        try {
            const params = {
                keyword: '',
                category: '',
                conservationStatus: '',
                speciesId: undefined,
                page: 1,
                pageSize: 100
            };
            const response = await axios.get(API_SPECIES_URL, { params });
            if (response.data && Array.isArray(response.data.items)) {
                const found = response.data.items.find(item => item.id === parseInt(id, 10));
                setSpecie(found);
            }
        } catch (error) {
            console.error("Error al obtener el detalle de la especie:", error);
        }
        setLoadingSpecies(false);
    };

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const params = {
                speciesId: Number(id),
                entityType: "species",
                page: commentsPage,
                pageSize: commentsPageSize,
            };
            console.log("Parámetros de comentarios:", params);
            const response = await axios.get(API_COMMENTS_URL, { params });
            console.log("Respuesta de comentarios:", response.data);
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

    useEffect(() => {
        fetchSpeciesDetail();
    }, [id]);

    useEffect(() => {
        if (specie) {
            fetchComments();
        }
    }, [specie, commentsPage]);

    if (loadingSpecies) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!specie) {
        return (
            <div className="container mt-4">
                <p>Especie no encontrada.</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Detalles de la Especie</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{specie.commonName || specie.scientificName}</h5>
                    <p className="card-text">
                        <strong>ID de la Especie:</strong> {specie.id} <br />
                        <strong>ID del Usuario:</strong> {specie.userId || 'N/A'} <br />
                        <strong>Nombre Común:</strong> {specie.commonName} <br />
                        <strong>Nombre Científico:</strong> {specie.scientificName} <br />
                        <strong>Categoría:</strong> {specie.category} <br />
                        <strong>Estado de Conservación:</strong> {specie.conservationStatus} <br />
                        <strong>ID del Área Natural:</strong> {specie.naturalAreaId}
                    </p>
                    <div className="d-flex justify-content-end">
                        <Link to={`/species/${specie.id}/update`} className="btn btn-warning me-2">
                            Modificar Especie
                        </Link>
                        <Link to={`/species/${specie.id}/delete`} className="btn btn-danger">
                            Eliminar Especie
                        </Link>
                    </div>
                    <div className="mt-3">
                        <Link to={`/species/${specie.id}/comment`} className="btn btn-info">
                            Añadir Comentario
                        </Link>
                    </div>
                </div>
            </div>
            <h3 className="mb-3">Comentarios</h3>
            {loadingComments ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando comentarios...</span>
                    </div>
                </div>
            ) : comments.length === 0 ? (
                <p>No hay comentarios para esta especie.</p>
            ) : (
                <div className="list-group">
                    {comments.map(comment => (
                        <div key={comment.id} className="list-group-item">
                            <p className="mb-1"><strong>ID del Usuario:</strong> {comment.userId}</p>
                            <p className="mb-1"><strong>Comentario:</strong> {comment.text}</p>
                            <p className="mb-1"><strong>Valoración:</strong>{[1, 2, 3, 4, 5].map(estrella => (
                                              <FaStar 
                                                key={estrella} 
                                                size={20} 
                                                color={estrella <= comment.rating ? "#ffc107" : "#e4e5e9"} 
                                              />
                                            ))}</p>
                            <Link to={`/species/${comment.speciesId}/updateComment/${comment.id}`} className="btn btn-warning btn-sm me-2">
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

export default SpeciesDetail;
