import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Webcam from "react-webcam";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export const Register = () => {
  const { signup } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
    imagenes: [],
  });

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

  var apollo = 0;

  const handleCapture = async (e) => {
    e.preventDefault();

    let arrayImages = [];

    // Suponiendo que 'capturing' es un estado que determina si debes tomar capturas de pantalla o no.
    if (capturing) {
      for (let i = 0; i < 100; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Espera 100ms antes de tomar la siguiente captura de pantalla.
        let imageSrc = webcamRef.current.getScreenshot(); // Toma la captura de pantalla.
        arrayImages.push(imageSrc); // Añade la captura de pantalla al array de imágenes.
        apollo++;

        // Cuando se haya tomado la captura de pantalla número 100...
        if (apollo === 100) {
          setUser({
            ...user,
            imagenes: arrayImages,
          });
          // Actualiza el estado con el array de imágenes.
        }
      }
    }
    setCapturing(!capturing); // Cambia el estado de 'capturing'.
  };

  const dataURLsToBlobs = (dataurls) => {
    return dataurls.map((dataurl) => {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", user.email);
    const emailName = user.email.split("@")[0];
    const blobs = dataURLsToBlobs(user.imagenes);
    blobs.forEach((blob, index) => {
      const file = new File([blob], `imagen_${emailName}_${index}.jpeg`, {
        type: "image/jpeg",
      });
      // Se agrega cada archivo al objeto FormData
      formData.append("files", file);
    });
    setError("");
    try {
      const result = await fetch("http://127.0.0.1:8000/api/archivo/", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();

      if (data.status === "success") {
        await signup(user.email, user.password);
        navigate("/");
      } else {
        window.alert("Error al cargar el archivo: " + data.detail);
      }
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
    <Container>
      <div className="w-full max-w-xs m-auto text-black">
        {error}

        <Form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-4"
        >
          <Form.Group controlId="email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="SuCorreo@SuDominio.com"
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="*************"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Camara</Form.Label>
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
                onClick={handleCapture}
                className="absolute bottom-0 right-0 mb-2 mr-2"
                variant="primary"
              >
                {firstCapture
                  ? "Capturar"
                  : capturing
                  ? "Capturar"
                  : "Volver a capturar"}
              </Button>
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">
            Registrarse
          </Button>
        </Form>

        <p className="my-4 text-sm flex justify-between px-3">
          Ya tienes una cuenta?
          <Link to="/login" className="text-blue-700 hover:text-blue-900">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </Container>
  );
};
