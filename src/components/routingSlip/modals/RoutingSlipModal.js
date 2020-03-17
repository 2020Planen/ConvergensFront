import React, { Component } from "react";

import { Button, Modal, Spinner, ListGroup } from "react-bootstrap";

import SendJson from "../../../fetch/SendJson";
import DataParser from "../dataParsing/TreeJsonParser"

const URL =process.env.REACT_APP_COUCH_URL +"/routingslips/";

class RoutingSlipModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routingSlipList: []
    };
  }

  componentDidMount = async () => {
    const  routingSlipUrl = URL + "_design/RoutingSlip/_view/by_pr_get_docs"
    let routingSlipList = await SendJson.SendJson(routingSlipUrl, "GET");
    this.setState({ routingSlipList: routingSlipList.rows});
  };

  selectRoutingSlip = (routingSlip) => {
    const treeData = DataParser.routingSlipToTree(routingSlip.routingSlip.routes)
    const newRoutingSlip = {id: routingSlip._id, rev: routingSlip._rev, producerReference: routingSlip.producerReference, treeData: treeData}

    this.props.selectRoutingSlip(newRoutingSlip)
    this.props.handleShowSearch()
  }

  render() {
    return (
      <Modal
        size="lg"
        show={this.props.showSearchRoutingSlips}
        onHide={this.props.handleShowSearch}
        animation={true}
        autoFocus={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            RoutingSlips{"  "}
            {this.state.routingSlipList.length < 1 ? (
              <Spinner animation="border" size="sm" />
            ) : null}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Vælg en routing slip for at redigere den</p>
          {this.state.routingSlipList.length > 0 ? (
            <ListGroup variant="flush">
                {this.state.routingSlipList.map((routingSlip) => (
              <ListGroup.Item key={routingSlip.id} action onClick={() => this.selectRoutingSlip(routingSlip.value)}>{routingSlip.key}</ListGroup.Item>
                ))}
              </ListGroup>
          ) : null
        }
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={this.props.handleShowSearch}
          >
            Anuller
          </Button>
          <Button
            variant="outline-secondary"
            href="#/createRoutingSlip"
          >
            Opret ny routing slip
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RoutingSlipModal;
