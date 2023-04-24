import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Alert } from "./Alert";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (!user) {
    return (
      <>
        <Alert mensaje="Inicia sesion primero..." />
        <Navigate to="/login" />
      </>
    );
  }

  return <>{children}</>;
}
