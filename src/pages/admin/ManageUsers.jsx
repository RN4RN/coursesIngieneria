import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/userService';
import { FaSpinner } from 'react-icons/fa';
import { AccountCircle } from '@mui/icons-material';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="table-loading-state"><FaSpinner className="animate-spin"/> Cargando usuarios...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div>
        <h1 className="dashboard-section-title">Gestionar Usuarios</h1>
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <div className="user-cell">
                                    <div className="user-avatar">
                                        {user.photoURL ? <img src={user.photoURL} alt={user.name}/> : <AccountCircle/>}
                                    </div>
                                    {user.name || 'Sin Nombre'}
                                </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`role-badge ${user.role}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="actions-cell">
                                <button className="action-button edit">Editar</button>
                                <button className="action-button delete">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ManageUsers;