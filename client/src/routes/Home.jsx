import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import PapayaLogo from "../images/papaya.svg";
import CarouselImage1 from "../images/carrusel_1.png";
import CarouselImage2 from "../images/carrusel_2.png";
import CarouselImage3 from "../images/carrusel_3.png";

export const Home = () => {
  return (
    <Container>
      <div className="text-center my-5">
        <Image src={PapayaLogo} width="150" height="150" />
        <h1>Bienvenidos a Banco Papaya</h1>
        <p>Donde tus finanzas crecen tan saludables como una papaya.</p>
      </div>

      <Carousel fade>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={CarouselImage1} 
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Nuestras tarjetas de crédito</h3>
            <p>Beneficios y recompensas que te encantarán.</p>
            <Button variant="primary">Descubre más</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={CarouselImage2}
            alt="First slide"
          />

          <Carousel.Caption>
            <h3>Ahorro y depósito</h3>
            <p>Los mejores intereses en tus ahorros y depósitos.</p>
            <Button variant="primary">Descubre más</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={CarouselImage3}
            alt="First slide"
          />

          <Carousel.Caption>
            <h3>Nuestros préstamos</h3>
            <p>Soluciones de préstamo para cada necesidad.</p>
            <Button variant="primary">Descubre más</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};
