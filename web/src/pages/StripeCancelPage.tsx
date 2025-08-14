import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StripeCancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/services');
  }, [navigate]);

  return null;
};

export default StripeCancelPage;