import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from './AuthLayout';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(username, password);
        } catch (err) {
            // Error handling dari AuthContext
            setError(err instanceof Error ? err.message : 'Login gagal');
        } finally {
            setLoading(false);
        }
    };

    // Konten formulir login yang dinamis
    const formContent = (
        <div className="w-full max-w-[440px] flex flex-col gap-6">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="lg:hidden flex justify-center mb-4">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">school</span>
                </div>
            </div>
            {/* Header Section */}
            <div className="text-center lg:text-left space-y-2">
                <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">Admin Login</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                    Student Placement System - Panitia Access
                </p>
            </div>
            {/* Form Container */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
                {/* Username Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Username</label>
                    <div className="relative">
                        <input
                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#d0d7e7] dark:border-slate-700 bg-white dark:bg-[#1a202c] focus:border-primary h-12 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal transition-all"
                            placeholder="Enter your username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading} />
                    </div>
                </div>
                {/* Password Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Password</label>
                    <div className="flex w-full items-stretch rounded-lg relative">
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#d0d7e7] dark:border-slate-700 bg-white dark:bg-[#1a202c] focus:border-primary h-12 placeholder:text-slate-400 p-[15px] pr-12 text-base font-normal leading-normal transition-all"
                            placeholder="Enter your password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading} />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-0 top-0 h-full px-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center rounded-r-lg focus:outline-none"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            <span className="material-symbols-outlined text-[24px]">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                </div>
                {/* Forgot Password & Error Message */}
                <div className="flex items-center justify-between mt-1">
                    {/* Placeholder for Remember Me / Checkbox functionality */}
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {error && (
                            <span className="text-red-500 font-medium">Error: {error}</span>
                        )}
                        {!error && (
                            <a className="text-sm font-medium text-primary hover:text-blue-700 transition-colors" href="#">Forgot Password?</a>
                        )}
                    </span>
                </div>
                {/* Action Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-sm hover:shadow-md mt-2 ${loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-blue-700'}`}
                >
                    <span className="truncate">{loading ? 'Processing...' : 'Sign In'}</span>
                </button>
            </form>
            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                <p className="text-slate-400 dark:text-slate-500 text-xs">
                    © 2024 Pondok Modern Darussalam Gontor.<br />All rights reserved.
                </p>
            </div>
        </div>
    );

    return <AuthLayout>{formContent}</AuthLayout>;
}

export default Login;