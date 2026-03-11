import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_DELETE_URL = 'https://mammal-excited-tarpon.ngrok-free.app/api/comment/delete?secret=TallerReact2025!';

const CommentDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Nuevo estado para mostrar mensaje de éxito

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = { userId: authUser.id, id: parseInt(id, 10) };
      const response = await axios.delete(API_DELETE_URL, { data: payload });

      if (response.data && response.data.result === true) {
        setSuccess(true); // Mostramos el mensaje de éxito
        setTimeout(() => {
          navigate(-1); // Regresar automáticamente a la página anterior
        }, 2000);
      } else {
        setError("No se pudo eliminar el comentario.");
      }
    } catch (err) {
      setError("Error. No puedes eliminar un comentario de otro usuario.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-danger">Eliminar Comentario</h2>
      
      {success ? (
        <div className="alert alert-success">✅ Se eliminó el comentario correctamente.</div>
      ) : (
        <>
          <p>¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.</p>
          {error && <div className="alert alert-danger">{error}</div>}

          <button className="btn btn-danger me-2" onClick={handleDelete} disabled={loading}>
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </button>
          <Link to={-1} className="btn btn-secondary">Cancelar</Link>
        </>
      )}
    </div>
  );
};

export default CommentDelete;
