import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, isUser }) {
    return isUser ? children : <Navigate to="/iniciar-sesion" replace />
}