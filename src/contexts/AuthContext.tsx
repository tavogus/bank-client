'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { TokenDTO, UserDTO } from '@/types/bank';
import Cookies from 'js-cookie';

interface AuthContextType {
    user: UserDTO | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string, cpf: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = Cookies.get('token');
        console.log('Initial token from cookies:', storedToken);
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ username: email, password });
            console.log('Login response:', response.data);
            const { accessToken, username, authenticated, expiration } = response.data;
            
            if (authenticated && accessToken) {
                console.log('Setting token:', accessToken);
                // Remove old token first
                Cookies.remove('token');
                localStorage.removeItem('token');
                
                // Calculate expiration time from the token's expiration date
                const expirationDate = new Date(expiration);
                const now = new Date();
                const expiresInDays = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                
                // Set new token with proper expiration
                Cookies.set('token', accessToken, { 
                    expires: expiresInDays > 0 ? expiresInDays : 1, // Use token expiration or 1 day as fallback
                    secure: true, // Only send over HTTPS
                    sameSite: 'strict' // Prevent CSRF attacks
                });
                localStorage.setItem('token', accessToken);
                setToken(accessToken);
                setUser({ id: 0, email: username, fullName: '', cpf: '' });
                router.push('/dashboard');
                router.refresh();
            } else {
                console.error('Authentication failed - no token or not authenticated');
                throw new Error('Authentication failed');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, fullName: string, cpf: string) => {
        try {
            await authApi.register({ email, password, fullName, cpf });
            await login(email, password);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        console.log('Logging out - current token:', token);
        // Remove token from all storage locations
        Cookies.remove('token');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        router.push('/');
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 