import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Jumbotron, Container } from "react-bootstrap";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Send from "./components/Send";
import Reciever from "./components/reciever/Reciever";
import CreateRoutingSlip from "./components/routingSlip/CreateRoutingSlip";
import EditRoutingSlip from "./components/routingSlip/EditRoutingSlip";
import ErrorReciever from "./components/reciever/ErrorReciever";
//import About from "./components/About";
import Header from "./components/Navbar";
import Test from "./components/test/Test";
import Keycloak from "keycloak-js";

require("dotenv").config();

function NoMatch() {
  return (
    <Container>
      <Jumbotron>
        <h3>404 - Ups siden findes ikke ?</h3>
      </Jumbotron>
    </Container>
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
                <Route exact path="/test" render={() => <Test />} />
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
                <Route component={NoMatch} />
              </Switch>
            </Router>
          </>
        );
      else return <div>Kunne ikke godkende.</div>;
    }
    return <div>Vent venligst...</div>;
  }
}

export default App;
