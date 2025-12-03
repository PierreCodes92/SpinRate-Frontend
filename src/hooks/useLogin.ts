import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';
import { API_BASE_URL } from '@/config/api';

export const useLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useAuthContext();

  const login = async (email: string, password: string, isGoogleLogin: string = ''): Promise<string | undefined> => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isGoogleLogin }),
      });

      const json = await response.json();

      if (!response.ok) {
        return json.error || 'Login failed';
      }

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(json));
        dispatch({ type: 'LOGIN', payload: json });
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return errorMessage;
    }
  };

  return { login, error };
};

