import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { API_BASE_URL } from '@/config/api';

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useAuthContext();

  const signup = async (
    fullName: string,
    email: string,
    phoneNumber: string,
    password: string
  ): Promise<any> => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phoneNumber, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        return json.error || 'Signup failed';
      }

      if (response.ok) {
        // Do not auto-login or navigate; return the created user payload
        // Consumers can decide next steps (e.g., send verification email, show UI)
        return json;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      return errorMessage;
    }
  };

  return { signup, error };
};

