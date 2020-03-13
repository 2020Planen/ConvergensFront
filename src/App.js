import React, { Component, useState } from "react";
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
import Keycloak from "keycloak-js";
import JWT from "jwt-decode";

function NoMatch() {
  return (
    <Container>
      <Jumbotron>
        <h3>404 - siden kan ikke findes</h3>
      </Jumbotron>
    </Container>
  );
}

function Header({ keycloak }) {
  const [userInfo, setInfo] = useState({
    username: "",
    email: "",
    email_verified: false
  });
  keycloak.loadUserInfo().then(userInfo => {
    setInfo({
      username: userInfo.preferred_username,
      email: userInfo.email,
      email_verified: userInfo.email_verified
    });
  });

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
          {localStorage.getItem("keycloak-token") ? (
            <>
              <Nav className="mr-auto">
                {JWT(
                  localStorage.getItem("keycloak-token")
                ).realm_access.roles.includes("superuser") ||
                JWT(
                  localStorage.getItem("keycloak-token")
                ).realm_access.roles.includes("user") ? (
                  <>
                    <Nav.Link href="#send">Send Besked</Nav.Link>
                    <NavDropdown
                      title="Routing Slips"
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item href="#createSimpleRoutingSlip">
                        Opret simpel routing slip
                      </NavDropdown.Item>
                      {JWT(
                        localStorage.getItem("keycloak-token")
                      ).realm_access.roles.includes("superuser") ? (
                        <>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#createRoutingSlip">
                            Opret routing slip
                          </NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#editRoutingSlip">
                            Ændring af routing slips
                          </NavDropdown.Item>
                        </>
                      ) : null}
                    </NavDropdown>

                    <NavDropdown
                      title="Modtag beskeder"
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item href="#reciever">
                        Modtag Beskeder
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="#errorReciever">
                        Modtag Fejlbeskeder
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : null}
              </Nav>
              <Nav>
                {JWT(
                  localStorage.getItem("keycloak-token")
                ).realm_access.roles.includes("admin") ? (
                  <Nav.Link
                    onClick={() =>
                      console.log(
                        JWT(localStorage.getItem("keycloak-token")).iss
                      )
                    }
                  >
                    Test
                  </Nav.Link>
                ) : null}

                <NavDropdown title={userInfo.username} id="user-nav-dropdown">
                  {userInfo.email !== undefined ? (
                    <>
                      <NavDropdown.Item>{userInfo.email}</NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  ) : null}
                  <NavDropdown.Item
                    href={
                      JWT(localStorage.getItem("keycloak-token")).iss +
                      "/account/"
                    }
                  >
                    Rediger bruger
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => {
                      keycloak.logout();
                      localStorage.clear();
                    }}
                  >
                    log ud
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav>
              <Nav.Link
                onClick={() => {
                  keycloak.logout();
                  localStorage.clear();
                }}
              >
                log ind igen
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

const initOptions = {
  realm: "odense",
  url: "http://cis-x.convergens.dk:8089/auth/",
  clientId: "react-test-app",
  onLoad: "login-required"
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false };
  }

  componentDidMount() {
    const keycloak = Keycloak(initOptions);
    keycloak
      .init({ onLoad: "login-required", promiseType: "native" })
      .then(authenticated => {
        this.setState(
          { keycloak: keycloak, authenticated: authenticated },
          localStorage.setItem("keycloak-token", keycloak.token)
        );
      });
  }

  render() {
    if (this.state.keycloak) {
      if (this.state.authenticated)
        return (
          <>
            <Router>
              <Header keycloak={this.state.keycloak} />
              <Switch>
                <Route exact path="/" render={() => <Home />} />
                <Route exact path="/home" render={() => <Home />} />
                <Route exact path="/send" render={() => <Send />} />
                <Route
                  exact
                  path="/createRoutingSlip"
                  render={() => <CreateRoutingSlip />}
                />
                <Route
                  exact
                  path="/editRoutingSlip"
                  render={() => <EditRoutingSlip />}
                />
                <Route exact path="/reciever" render={() => <Reciever />} />
                <Route
                  exact
                  path="/errorReciever"
                  render={() => <ErrorReciever />}
                />
                <Route exact path="/test" render={() => <Test />} />
                <Route exact path="/about" render={() => <About />} />
                <Route component={NoMatch} />
              </Switch>
            </Router>
          </>
        );
      else return <div>Unable to authenticate!</div>;
    }
    return <div>Verificere login...</div>;
  }
}

export default App;
