import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        // Fallback jika user tidak ada (meski harusnya ter-handle oleh protected route)
        navigate('/login');
        return null;
    }

    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Admin</h1>
            <p className="text-lg text-gray-700 mb-6">Selamat datang, {user.username} ({user.role}).</p>
            
            <div className="space-x-4 mb-8">
                <button
                    onClick={() => navigate('/admin/santri')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Kelola Data Santri
                </button>
                {/* Tombol menu lain berdasarkan role akan ditambahkan nanti */}
                
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
                <h2 className="text-2xl font-semibold text-blue-800">Status Anda</h2>
                <p>Role: <span className="font-mono text-blue-600">{user.role}</span></p>
                <p>ID Panitia: <span className="font-mono text-blue-600">{user.id}</span></p>
            </div>
        </div>
    );
};

export default Dashboard;