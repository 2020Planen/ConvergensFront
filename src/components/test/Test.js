import React, { Component } from "react";

import { Button } from "react-bootstrap";

import SendJson from "../../fetch/SendJson";

class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  sendTest = async () => {
    const url = process.env.REACT_APP_COUCH_TARGET + "/getAllRoutes/odense";
    let response = await SendJson.SendWithToken(url, "GET");
    alert(JSON.stringify(response));

/*
    const  routingSlipUrl = URL + "_design/RoutingSlip/_view/by_pr_get_docs"
    let routingSlipList = await SendJson.SendJson(routingSlipUrl, "GET");
    this.setState({ routingSlipList: routingSlipList.rows});
    */
  }

  render() {
    return (
      <div>
        <h1>Hej</h1>
        <Button onClick={this.sendTest}> TEST</Button>
      </div>
    );
  }
}

export default Test;
