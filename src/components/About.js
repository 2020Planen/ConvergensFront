import React from "react";
import { Container, Row, Col, Jumbotron, Accordion, Card, Button } from "react-bootstrap";

function About() {
  return (
    <Container>
      <Row>
        <Col>
        <Jumbotron>

        </Jumbotron>
          <Jumbotron>
              <h5> TEST </h5>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Click me!
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Click me!
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>Hello! I'm another body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
