import { useLocation, useNavigate } from "react-router-dom";

const UserDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;

    if (!user) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger text-center">
                    No se encontró información del usuario.
                </div>
                <button onClick={() => navigate(-1)} className="btn btn-primary">
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Detalles del Usuario</h2>

                    <ul className="list-group mb-4">
                        <li className="list-group-item"><strong>ID:</strong> {user.id}</li>
                        <li className="list-group-item"><strong>Nombre:</strong> {user.name}</li>
                        <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
                    </ul>
                    <button onClick={() => navigate(`/usuarios/${user.id}/areas`)} className="btn btn-secondary mt-3">
                        Ver áreas
                    </button>
                    <button onClick={() => navigate(`/usuarios/${user.id}/especies`)} className="btn btn-secondary mt-3">
                        Ver especies
                    </button>
                    <button onClick={() => navigate(`/usuarios/${user.id}/actividades`)} className="btn btn-secondary mt-3">
                        Ver actividades
                    </button>

                    <button onClick={() => navigate(-1)} className="btn btn-secondary mt-3">
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
