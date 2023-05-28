import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { resultOpenCV } from "../openCV/openCV";
import { Alert } from "../components/Alert";
import Webcam from "react-webcam";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

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
      if (result.status === "success") {
        await login(user.email, user.password);
        navigate("/profile");
      } else {
        window.alert("No se encuentra, por favor regístrese...");
      }
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Correo inválido");
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
          setError("Correo inválido");
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
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="my-5">
        <Form.Group controlId="email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="SuCorreo@SuDominio.com"
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="*************"
          />
        </Form.Group>

        <Form.Group controlId="video" className="mb-4">
          <Form.Label>Video</Form.Label>
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
            <Button
              variant="primary"
              type="button"
              onClick={handleCapture}
              className="absolute bottom-0 right-0 mb-2 mr-2"
            >
              {firstCapture
                ? "Capturar"
                : capturing
                ? "Capturar"
                : "Volver a capturar"}
            </Button>
          </div>
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center">
          <Button variant="primary" type="submit">
            Ingresar
          </Button>
          <a
            href="#!"
            onClick={handleResetPassword}
            className="text-blue-500 hover:text-blue-800"
          >
            ¿Olvidaste la contraseña?
          </a>
        </div>
      </Form>

      <Button
        variant="light"
        onClick={handleGoogleSignin}
        className="shadow rounded"
      >
        Iniciar sesión con Google
      </Button>

      <p className="my-4 text-sm text-center">
        ¿No tienes una cuenta?{" "}
        <Link to="/register" className="text-blue-700 hover:text-blue-900">
          Registrarse
        </Link>
      </p>
    </Container>
  );
};
