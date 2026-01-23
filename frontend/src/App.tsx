import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CalonSantriPage from './pages/CalonSantri'; 
// Asumsi halaman admin lain akan segera dibuat

// Komponen placeholder
const LandingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Selamat Datang di Sistem Informasi Penempatan Santri Baru</h1>
    <p className="text-lg text-gray-600 mb-8">Silakan <a href="/login" className="text-blue-600 hover:underline font-semibold">Login</a> untuk mengakses Dashboard Admin, atau <a href="/cek-hasil" className="text-green-600 hover:underline font-semibold">Cek Hasil Penempatan</a> (Coming Soon).</p>
  </div>
);

// --- Komponen Utama Aplikasi ---
function App() {
  // Menghapus state dan JSX default Vite
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cek-hasil" element={<div>Halaman Cek Hasil (Coming Soon)</div>} />

          {/* Rute Admin (Akan diproteksi nanti) */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/santri" element={<CalonSantriPage />} />
          {/* Tambahkan rute admin lainnya di sini */}

          {/* Redirect jika path tidak ditemukan */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;