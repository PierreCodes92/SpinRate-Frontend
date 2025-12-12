import { useAuthContext } from './useAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    
    // Preserve language prefix when logging out
    const isEnglish = location.pathname.startsWith('/en');
    navigate(isEnglish ? '/en' : '/');
  };

  return { logout };
};
