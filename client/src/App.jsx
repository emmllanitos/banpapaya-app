import { Route, Routes, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";
import { Register } from "./routes/Register";
import { Profile } from "./routes/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authContext";
import "./stylesheets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Footer } from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
