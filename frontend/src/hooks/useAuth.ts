// rohmans234/sistem-informasi-penempatan-santri-baru/.../frontend/src/hooks/useAuth.ts
import { useContext, createContext } from 'react';
// Tipe data yang dibutuhkan oleh AuthProvider
type UserRole = 'Super Admin' | 'Admin Penempatan' | 'Admin Data' | undefined;

export interface AuthUser {
    id: number;
    username: string;
    role: UserRole;
    token: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoggedIn: boolean;
    isAdmin: (requiredRoles: UserRole[]) => boolean;
}

// Inisialisasi Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook kustom untuk penggunaan Auth Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider');
    }
    return context;
};