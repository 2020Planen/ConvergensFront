import React from 'react';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Jumbotron, Container } from 'react-bootstrap';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home"
import Send from "./components/Send"
import Reciever from "./components/reciever/Reciever"
import Condition from "./components/conditions/Condition"
import CreateRoutingSlip from "./components/createRoutingSlip/CreateRoutingSlip"
import ErrorReciever from "./components/reciever/ErrorReciever"

function NoMatch() {
  return (
    <Container>
    <Jumbotron>
      <h3>404 - siden kan ikke findes</h3>
    </Jumbotron>
    </Container>
  );
}

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
      <Navbar.Brand href="#home">Convergens-Strap</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#send">Send Besked</Nav.Link>
          <NavDropdown title="Routing Slips" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#createRoutingSlip">Opret routing slip</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#condition">Ændring af routing slips</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Modtag beskeder" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#reciever">Modtag Beskeder</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#errorReciever">Modtag Fejlbeskeder</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Link eventKey={2} href="#about">About</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

  )
}




function App() {

  return (
    <>
      <Router>
          <Header />
          <Switch>
            <Route exact path="/home" render={() => <Home />} />
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/send" render={() => <Send />} />
            <Route exact path="/reciever" render={() => <Reciever />} />
            <Route exact path="/condition" render={() => <Condition />} />
            <Route exact path="/createRoutingSlip" render={() => <CreateRoutingSlip />} />
            <Route exact path="/errorReciever" render={() => <ErrorReciever />} />
            <Route component={NoMatch} />
          </Switch>
      </Router>
    </>
  );
}

export default App;
