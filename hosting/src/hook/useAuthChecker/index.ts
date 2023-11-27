import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthChecker = (token: string | null) => {
    const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
};

export default useAuthChecker
