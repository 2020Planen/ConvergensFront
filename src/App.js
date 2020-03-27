import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import ChooseRealm from "./components/chooseRealm/ChooseRealm";
import Secured from "./Secured";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { realmPicked: false };
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={ChooseRealm} />
          <Route path="/secured" component={Secured} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
