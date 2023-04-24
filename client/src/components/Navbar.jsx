import { Outlet, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavbarBootstrap from "react-bootstrap/Navbar";

export function Navbar() {
  return (
    <div>
      <NavbarBootstrap bg="dark" variant="dark">
        <Container>
          <NavbarBootstrap.Brand as={Link} to="/">
            BANPAPAYA-APP
          </NavbarBootstrap.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
          </Nav>
        </Container>
      </NavbarBootstrap>

      <section>
        <Outlet></Outlet>
      </section>
    </div>
  );
}
