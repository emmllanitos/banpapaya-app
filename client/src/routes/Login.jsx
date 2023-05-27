import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { resultOpenCV } from "../openCV/openCV";
import { Alert } from "../components/Alert";
import Webcam from "react-webcam";

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { login, loginWithGoogle, resetPassword } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [firstCapture, setFirstCapture] = useState(true);

  const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: "user",
  };

  const handleCapture = (e) => {
    e.preventDefault();
    if (capturing) {
      const imageSrc = webcamRef.current.getScreenshot();
      setUser({ ...user, video: imageSrc });
      setCapturedImage(imageSrc);
      //console.log(capturedImage);
      if (firstCapture) setFirstCapture(false);
    }
    setCapturing(!capturing);
  };

  const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", user.email);
    const blob = dataURLtoBlob(capturedImage);
    const emailName = user.email.split("@")[0];
    const file = new File([blob], `login_${emailName}.jpeg`, {
      type: "image/jpeg",
    });
    formData.append("file", file);
    setError("");

    try {
      const result = await resultOpenCV(formData);
      console.log(result.status);
      if (result.status === "success") {
        console.log(result.status);
        await login(user.email, user.password);
        navigate("/profile");
      } else {
        window.alert("No se encuentra, por favor registrese...");
      }
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Correo invalido");
          break;
        case "auth/internal-error":
          setError("Ingrese la contraseña");
          break;
        case "auth/user-not-found":
          setError("El usuario no se encuentra registrado");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta");
          break;
        default:
          setError(error.message);
      }
    }
  };

  const handleChange = ({ target: { value, name } }) =>
    setUser({ ...user, [name]: value });

  const handleGoogleSignin = async () => {
    try {
      await loginWithGoogle();
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!user.email)
      return setError(
        "Escriba un correo electrónico para restablecer la contraseña"
      );
    try {
      await resetPassword(user.email);
      setError("Te enviamos un correo electrónico. Revisa tu correo");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Correo invalido");
          break;
        case "auth/internal-error":
          setError("Ingrese la contraseña");
          break;
        case "auth/user-not-found":
          setError("El usuario no se encuentra registrado");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta");
          break;
        default:
          setError(error.message);
      }
    }
  };

  return (
    <div>
      {error}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
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
            name="email"
            id="email"
            onChange={handleChange}
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
            name="password"
            id="password"
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="*************"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="video"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Video
          </label>
          <div className="relative">
            {capturing ? (
              <Webcam
                audio={false}
                height={500}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={500}
                videoConstraints={videoConstraints}
              />
            ) : (
              capturedImage && (
                <img
                  src={capturedImage}
                  alt="captured"
                  style={{ width: "500px", height: "500px" }}
                />
              )
            )}
            <button
              type="button"
              onClick={handleCapture}
              className="absolute bottom-0 right-0 mb-2 mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
            >
              {firstCapture
                ? "Capturar"
                : capturing
                ? "Capturar"
                : "Volver a capturar"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Ingresar
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#!"
            onClick={handleResetPassword}
          >
            Olvido la contraseña?
          </a>
        </div>
      </form>
      <button
        onClick={handleGoogleSignin}
        className="bg-slate-50 hover:bg-slate-200 text-black  shadow rounded border-2 border-gray-300 py-2 px-4 w-full"
      >
        Iniciar sesión con Google
      </button>
      <p className="my-4 text-sm flex justify-between px-3">
        No tienes una cuenta?
        <Link to="/register" className="text-blue-700 hover:text-blue-900">
          Registrarse
        </Link>
      </p>
    </div>
  );
};
