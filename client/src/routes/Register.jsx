import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const Register = () => {
  const { signup } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(user.email, user.password);
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Correo invalido");
          break;
        case "auth/internal-error":
          setError("Ingrese alguna contraseña");
          break;
        case "auth/weak-password":
          setError("La contraseña debe tener minimo 6 caracteres");
          break;
        case "auth/email-already-in-use":
          setError("El correo ya se encuentra registrado");
          break;
        default:
          setError(error.message);
      }
    }
  };

  return (
    <div className="w-full max-w-xs m-auto text-black">
      {error}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="SuCorreo@SuDominio.com"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Contraseña
          </label>
          <input
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="*************"
          />
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Registrarse
        </button>
      </form>
      <p className="my-4 text-sm flex justify-between px-3">
        Ya tienes una cuenta?
        <Link to="/login" className="text-blue-700 hover:text-blue-900">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
};