import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        backgroundColor: "#343a40",
        color: "#fff",
        padding: "20px 0",
        marginTop: "60px",
      }}
    >
      <Container>
        <Row>
          <Col md={6}>
            <h5>Banco Papaya</h5>
            <p>Donde tus finanzas crecen tan saludables como una papaya.</p>
          </Col>
          <Col md={3}>
            <h5>Enlaces</h5>
            <ul style={{ listStyle: "none", paddingLeft: "0" }}>
              <li>
                <a href="/#" style={{ color: "#fff" }}>
                  Inicio
                </a>
              </li>
              <li>
                <a href="/#" style={{ color: "#fff" }}>
                  Acerca de nosotros
                </a>
              </li>
              <li>
                <a href="/#" style={{ color: "#fff" }}>
                  Servicios
                </a>
              </li>
              <li>
                <a href="/#" style={{ color: "#fff" }}>
                  Contacto
                </a>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Contacto</h5>
            <p>Evergreen Terrace 742 en Springfield</p>
            <p>3203044256</p>
            <p>info@bancopapaya.com</p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <p className="text-center" style={{ marginTop: "20px" }}>
              © {year} Banco Papaya. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
