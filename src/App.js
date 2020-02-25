import React from "react";
// import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navbar,
  Nav,
  NavDropdown,
  Jumbotron,
  Container
} from "react-bootstrap";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Send from "./components/Send";
import Reciever from "./components/reciever/Reciever";
import CreateRoutingSlip from "./components/routingSlip/CreateRoutingSlip";
import EditRoutingSlip from "./components/routingSlip/EditRoutingSlip";
import ErrorReciever from "./components/reciever/ErrorReciever";
import About from "./components/About";
import Test from "./components/test/Test";

//import AddRemove from "./components/AddRemove";

/*
import Logo from "./pictures/Logo.png"
        <img
          src={Logo}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="logo"
        />
        */

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
    <>
      <Navbar
        collapseOnSelect
        expand="sm"
        bg="dark"
        variant="dark"
        sticky="top"
      >
        <Navbar.Brand href="#home">Convergens</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#send">Send Besked</Nav.Link>
            <NavDropdown title="Routing Slips" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#createRoutingSlip">
                Opret routing slip
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#editRoutingSlip">
                Ændring af routing slips
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Modtag beskeder" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#reciever">
                Modtag Beskeder
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#errorReciever">
                Modtag Fejlbeskeder
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link eventKey={2} href="#test">
              Test
            </Nav.Link>
            <Nav.Link eventKey={2} href="#about">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/home" render={() => <Home />} />
          <Route exact path="/send" render={() => <Send />} />
          <Route exact path="/createRoutingSlip" render={() => <CreateRoutingSlip />} />
          <Route exact path="/editRoutingSlip" render={() => <EditRoutingSlip />} />
          <Route exact path="/reciever" render={() => <Reciever />} />
          <Route exact path="/errorReciever" render={() => <ErrorReciever />} />
          <Route exact path="/test" render={() => <Test />} />
          <Route exact path="/about" render={() => <About />} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
