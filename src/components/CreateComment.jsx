import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

const API_COMMENT_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/comment/insert?secret=TallerReact2025!';

const CreateComment = ({ entityType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(state => state.auth.user);

  const [formData, setFormData] = useState({
    text: '',
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleTextChange = (e) => {
    setFormData({ ...formData, text: e.target.value });
  };
  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      setError("Debes estar autenticado para enviar un comentario.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        comment: {
          userId: authUser.id,
          naturalAreaId: entityType === "naturalArea" ? Number(id) : null,
          speciesId: entityType === "species" ? Number(id) : null,
          text: formData.text,
          rating: Number(formData.rating)
        }
      };
      const response = await axios.post(API_COMMENT_URL, payload);
      if (response.data && response.data.result === true) {
        setSuccess(true);
      } else {
        setError("No se pudo enviar el comentario.");
      }
    } catch (err) {
      console.error("Error al enviar el comentario:", err);
      setError("Error al enviar el comentario.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container mt-4">
        <div className="alert alert-success">
          Se envió su comentario correctamente.
        </div>
        <Link
          to={`/${entityType === "naturalArea" ? "areas" : "species"}/${id}`}
          className="btn btn-primary"
        >
          Volver a Detalles
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Añadir Comentario</h2>
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Comentario:</label>
          <textarea
            name="text"
            className="form-control"
            value={formData.text}
            onChange={handleTextChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label>Valoración:</label>
          <div>
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
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Comentario'}
        </button>
      </form>
    </div>
  );
};

export default CreateComment;
