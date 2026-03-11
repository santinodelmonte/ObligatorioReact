import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]); 
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(""); 
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const userId = 1; 
    const navigate = useNavigate();


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `https://mammal-excited-tarpon.ngrok-free.app/api/user/list?secret=TallerReact2025!&userId=${userId}&page=1&pageSize=1000`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error en la API: ${response.status}`);
            }

            const data = await response.json();

            if (data.users?.items) {
                const uniqueUsers = Array.from(new Map(data.users.items.map(user => [user.id, user])).values());
                setAllUsers(uniqueUsers);
                setUsers(uniqueUsers.slice(0, pageSize));
            } else {
                setError("No se encontraron usuarios.");
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setError("Error al obtener los usuarios. Inténtalo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearch(value);

        if (!value) {
            setUsers(allUsers.slice(0, pageSize)); 
            return;
        }

        const filteredUsers = allUsers.filter((user) => {
            if (!user.name || !user.id) return false; 

            return (
                user.name.toLowerCase().includes(value) || 
                user.id.toString().includes(value)
            );
        });

        setUsers(filteredUsers.slice(0, pageSize)); 
        setPage(1);
    };

    const handleNextPage = () => {
        const nextPage = page + 1;
        const startIndex = (nextPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        if (startIndex >= allUsers.length) return;

        setUsers(allUsers.slice(startIndex, endIndex));
        setPage(nextPage);
    };

    const handlePreviousPage = () => {
        if (page === 1) return;

        const prevPage = page - 1;
        const startIndex = (prevPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        setUsers(allUsers.slice(startIndex, endIndex));
        setPage(prevPage);
    };

    const handleUserClick = (user) => {
        navigate(`/user/${user.id}`, { state: { user } });
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Lista de Usuarios</h2>

                    {error && <div className="alert alert-danger text-center">{error}</div>}

                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Buscar por ID o nombre..."
                        value={search}
                        onChange={handleSearch}
                    />

                    <ul className="list-group">
                        {users.length === 0 ? (
                            <div className="alert alert-warning text-center">No se encontraron resultados.</div>
                        ) : (
                            users.map((user) => (
                                <li key={user.id} className="list-group-item">
                                    <h5 className="mb-1">{user.name}</h5>
                                    <p className="text-muted">{user.email}</p>
                                    <button 
                                        onClick={() => handleUserClick(user)} 
                                        className="btn btn-info mt-2"
                                    >
                                        Ver detalles
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>

                    <div className="d-flex justify-content-between mt-3">
                        <button 
                            onClick={handlePreviousPage} 
                            className="btn btn-secondary"
                            disabled={page === 1}
                        >
                            Anterior
                        </button>

                        <span>Página {page}</span>

                        <button 
                            onClick={handleNextPage} 
                            className="btn btn-secondary"
                            disabled={page * pageSize >= allUsers.length}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
