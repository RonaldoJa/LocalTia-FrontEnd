import { useState } from 'react';
import { LoginPayload, RegisterPayload, AuthResponse } from '../types/Api';
import { AuthService } from '../../api/auth/AuthService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  const handleAuthAction = async <T extends LoginPayload | RegisterPayload>(
    action: (data: T) => Promise<AuthResponse>,
    data: T
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await action(data);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login: (data: LoginPayload) => handleAuthAction(AuthService.login, data),
    register: (data: RegisterPayload) => handleAuthAction(AuthService.register, data),
    logout: async () => {
      try {
        await AuthService.logout();
        setUser(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
        setError(message);
      }
    }
  };
};