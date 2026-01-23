import React from 'react';
import { useNavigate } from 'react-router-dom';

const CalonSantriPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Kelola Data Calon Santri</h1>
            <p className="text-gray-700 mb-6">
                Ini adalah halaman untuk melihat daftar santri, mengimpor data, dan menginput nilai ujian.
            </p>
            
            <button 
                onClick={() => navigate('/admin/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
                Kembali ke Dashboard
            </button>

            <div className="mt-8 p-6 border-t border-gray-200">
                 <p className="text-lg text-red-500">
                     (Implementasi daftar dan form input akan dilakukan di langkah selanjutnya.)
                 </p>
            </div>
        </div>
    );
};

export default CalonSantriPage;