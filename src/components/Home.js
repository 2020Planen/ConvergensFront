import React from "react";
import { Container, Row, Col, Jumbotron } from "react-bootstrap";

function Home() {
  return (
    <>
      <Container>
        <Row>
          <Col>
            <Jumbotron>
              <h3>Frontend test</h3>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
