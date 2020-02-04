import React from 'react';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home"
import Reciever from "./components/Reciever"
import Condition from "./components/Condition"

function NoMatch() {
  return (
    <div>
      <h3>404 kan ikke finde siden</h3>
    </div>
  );
}

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
      <Navbar.Brand href="#home">Convergens-Strap</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#condition">Regler</Nav.Link>
          <Nav.Link href="#reciever">Modtag</Nav.Link>
          <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
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
        <div>
          <Header />
          <Switch>
            <Route exact path="/home" render={() => <Home />} />
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/reciever" render={() => <Reciever />} />
            <Route exact path="/condition" render={() => <Condition />} />

            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
