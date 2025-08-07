// src/pages/admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { FaSpinner, FaUserShield, FaUserGraduate } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if(error) {
            console.error('Error fetching users', error);
            toast.error('No se pudieron cargar los usuarios.');
        } else {
            setUsers(data);
        }
        setLoading(false);
    };
    
    useEffect(() => {
        fetchUsers();
    }, []);
    
    // Nueva función para cambiar el rol
    const handleRoleChange = async (userId, newRole) => {
        const { error } = await supabase
            .from('users')
            .update({ role: newRole })
            .eq('id', userId);
        
        if (error) {
            toast.error('Error al actualizar el rol.');
            console.error(error);
        } else {
            toast.success('¡Rol actualizado con éxito!');
            fetchUsers(); // Refrescamos la lista para ver el cambio
        }
    };


    if (loading) return <div className="flex justify-center p-4"><FaSpinner className="animate-spin text-2xl"/></div>;
    
    return (
        <div>
             <h2 className="text-2xl font-bold mb-4">Usuarios Registrados ({users.length})</h2>
             <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Usuario</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Rol Actual</th>
                            <th className="p-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 flex items-center">
                                    <img src={user.photo_url} alt={user.display_name} className="w-8 h-8 rounded-full mr-3" />
                                    <span className="font-medium">{user.display_name}</span>
                                </td>
                                <td className="p-3 text-gray-600">{user.email}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3">
                                  {user.role !== 'admin' &&
                                    <button 
                                      onClick={() => handleRoleChange(user.id, 'admin')}
                                      className="flex items-center text-sm px-2 py-1 bg-gray-200 hover:bg-red-500 hover:text-white rounded transition-colors"
                                      title="Hacer Administrador"
                                    >
                                      <FaUserShield className="mr-2"/> Asignar Admin
                                    </button>
                                  }
                                  {user.role === 'admin' &&
                                    <button
                                      onClick={() => handleRoleChange(user.id, 'user')}
                                      className="flex items-center text-sm px-2 py-1 bg-gray-200 hover:bg-green-500 hover:text-white rounded transition-colors"
                                      title="Quitar rol de Administrador"
                                    >
                                       <FaUserGraduate className="mr-2"/> Asignar User
                                    </button>
                                  }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
}

export default ManageUsers;