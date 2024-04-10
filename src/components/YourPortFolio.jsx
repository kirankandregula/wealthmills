import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const YourPortfolio = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['userName', 'userRole']);

  useEffect(() => {
    if (!cookies.userRole) {
      navigate('/login');
    } else if (cookies.userRole === 'Admin') {
      navigate(`/admin/${cookies.userName}`);
    } else if (cookies.userRole === 'Viewer') {
      navigate(`/viewer/${cookies.userName}`);
    }
  }, [cookies.userName, cookies.userRole, navigate]);

  return <div>Loading...</div>; // You can add a loading spinner here if needed
};

export default YourPortfolio;
