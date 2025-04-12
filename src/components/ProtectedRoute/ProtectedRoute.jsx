import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

export default function ProtectedRoute({ children }) {
    const [userToken] = useState(() => localStorage.getItem("token"));

  if (!userToken) {
    // 🚫 Not logged in — redirect to login page
    return <Navigate to="/login" replace />;
  }

  // ✅ User is logged in — allow access to child component
  return children;
}   