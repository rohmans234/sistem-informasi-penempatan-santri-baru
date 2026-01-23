// rohmans234/sistem-informasi-penempatan-santri-baru/.../frontend/src/context/AuthContext.tsx
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
// Import type dan context dari file hook yang baru
import { AuthContext, type AuthUser, type UserRole } from '../hooks/useAuth';

// --- Provider Component ---
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const navigate = useNavigate();

    // Didefinisikan menggunakan useCallback untuk mengatasi masalah deklarasi/dependency di useEffect
    const logout = useCallback(() => {
        // Hapus dari Local Storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('id');

        // Hapus header Axios
        delete api.defaults.headers.common['Authorization'];

        setUser(null);
        navigate('/login');
    }, [navigate]);

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { username, password });

            const token = response.data.token;
            const panitiaData = response.data.panitia; // { id, username, role }

            const newUser: AuthUser = {
                id: panitiaData.id,
                username: panitiaData.username,
                role: panitiaData.role,
                token: token,
            };

            // Simpan ke Local Storage
            localStorage.setItem('token', token);
            localStorage.setItem('role', panitiaData.role);
            localStorage.setItem('username', panitiaData.username);
            localStorage.setItem('id', panitiaData.id.toString());
            
            // Set default header untuk Axios
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(newUser);
            navigate('/admin/dashboard', { replace: true });

        } catch (error) {
            // FIX: Explicitly check error type (TS 'unknown' & AxiosError)
            if (api.isAxiosError(error) && error.response) {
                // Backend merespon error 401
                throw new Error(error.response.data.message || 'Gagal login. Cek username dan password Anda.');
            }
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Terjadi kesalahan jaringan atau server internal.');
        }
    };

    // Cek Local Storage saat inisialisasi
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role') as UserRole;
        const storedUsername = localStorage.getItem('username');
        const storedId = localStorage.getItem('id');

        if (storedToken && storedUsername && storedRole && storedId) {
            setUser({
                id: parseInt(storedId),
                username: storedUsername,
                role: storedRole,
                token: storedToken
            });
            
            // Set default header untuk Axios
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
            // Hapus jika ada data parsial
            logout();
        }
    }, [logout]); 

    // Fungsi bantuan untuk pengecekan role
    const isAdmin = useCallback((requiredRoles: UserRole[]): boolean => {
        if (!user || !user.role) return false;
        return requiredRoles.includes(user.role);
    }, [user]);

    const isLoggedIn = user !== null;

    const value = {
        user,
        login,
        logout,
        isLoggedIn,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// Hook useAuth sudah dipindahkan ke src/hooks/useAuth.ts