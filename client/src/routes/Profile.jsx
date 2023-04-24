import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const Profile = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/home");
  };

  if (loading) return <h1>Cargando...</h1>;

  return (
    <div className="w-full max-w-xs m-auto text-black">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="text-xl mb-4">
          Bienvenido {user.displayName || user.email}
        </p>
        <p className="text-xs mb-1">
          Creado por Edwar Mayorga
          <br />
          Codigo: SOF220222028
          <br />ㅤ
        </p>
        <button
          className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
