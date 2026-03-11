import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

const API_UPDATE_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/comment/update?secret=TallerReact2025!';

const CommentUpdate = ({ entityType }) => {
  const { entityId, commentId } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(state => state.auth.user);

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchComment = async () => {
      if (!authUser) {
        setError("Debes estar autenticado para modificar un comentario.");
        return;
      }

      try {
        console.log("Llamando a la API para obtener el comentario...");
        const response = await axios.get(
          `https://mammal-excited-tarpon.ngrok-free.app/api/comment/byEntityId?secret=TallerReact2025!&userId=${authUser.id}&${entityType}Id=${entityId}&page=1&pageSize=10`
        );

        if (response.status !== 200 || !response.data.items) {
          throw new Error("La respuesta de la API no es válida.");
        }

        const foundComment = (response.data.items || []).find(comment =>
          Number(comment.id) === Number(commentId) &&
          Number(comment.userId) === Number(authUser.id)
        );

        if (foundComment) {
          setFormData({
            text: foundComment.text || '',
            rating: foundComment.rating || 1,
            naturalAreaId: foundComment.naturalAreaId || null,
            speciesId: foundComment.speciesId || null,
          });
        } else {
          setError("Comentario no encontrado o no tienes permisos para modificarlo.");
        }
      } catch (err) {
        console.error("Error al obtener el comentario:", err);
        setError("Error al cargar el comentario. Por favor intenta nuevamente.");
      }
    };

    fetchComment();
  }, [entityId, commentId, entityType, authUser]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        comment: {
          id: Number(commentId),
          userId: authUser.id,
          naturalAreaId: formData.naturalAreaId,
          speciesId: formData.speciesId,
          text: formData.text,
          rating: Number(formData.rating),
        },
      };

      console.log("Enviando datos a la API:", payload);

      const response = await axios.put(API_UPDATE_URL, payload);

      if (response.status === 200 && response.data.result === true) {
        setSuccess(true);
        setTimeout(() => navigate(-1), 2000);
      } else {
        setError("No se pudo modificar el comentario. Verifica los datos enviados.");
      }
    } catch (err) {
      console.error("Error al actualizar el comentario:", err);
      setError("Error al modificar el comentario. Por favor intenta nuevamente.");
    }
    setLoading(false);
  };
  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  return (
    <div className="container mt-4">
      <h2>Modificar Comentario</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {success ? (
        <div className="alert alert-success">Comentario modificado correctamente.</div>
      ) : (
        formData ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Comentario:</label>
              <textarea
                name="text"
                className="form-control"
                value={formData.text}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Valoración:</label>
              {[1, 2, 3, 4, 5].map(estrella => (
                            <FaStar 
                              key={estrella} 
                              size={30} 
                              color={estrella <= formData.rating ? "#ffc107" : "#e4e5e9"} 
                              onClick={() => handleRatingChange(estrella)} 
                              style={{marginRight: 5 }}
                            />
                          ))}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary ms-2" 
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </form>
        ) : (
          !loading && <p>Cargando datos del comentario...</p>
        )
      )}
    </div>
  );
};

export default CommentUpdate;
