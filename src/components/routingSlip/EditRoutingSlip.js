import React, { Component } from "react";

import SortableTree, { toggleExpandedForAll } from "react-sortable-tree";
import * as TreeUtils from "./tree-data-utils";
import "react-sortable-tree/style.css";

import {
  Navbar,
  Nav,
  Form,
  Button,
  FormControl,
  NavDropdown,
} from "react-bootstrap";

import SendJson from "../../fetch/SendJson";
import TreeJsonParser from "./dataParsing/TreeJsonParser";
import ShowNodeData from "./modals/showNodeData";
import RemoveNodeModal from "./modals/RemoveNodeModal";
import AddNodeModal from "./modals/AddNodeModal";
import RoutingSlipModal from "./modals/RoutingSlipModal";
//import ShowAlert from "./modals/AlertModal"

const getNodeKey = ({ treeIndex }) => treeIndex;

class EditRoutingSlip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodeInfo: {},

      routingSlip: {
        id: "",
        rev: "",
        producerReference: "",
      },

      alert: {
        heading: "",
        text: "",
        style: "danger",
        show: true,
      },

      showPopup: false,
      showAddNodeModal: false,
      showRemoveNodeModal: false,
      showSearchRoutingSlips: false,

      nodeToDeleteParentKey: null,

      searchString: "",
      searchFocusIndex: 0,
      searchFoundCount: null,

      treeData: [],
    };

    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.deleteNode = TreeUtils.removeNodeAtPath.bind(this);
    this.addNodeUnderParent = TreeUtils.addNodeUnderParent.bind(this);
    this.mapTree = TreeUtils.map.bind(this);
  }

  sendRoutingSlip = async () => {
    var oldJson = {};
    oldJson = JSON.parse(JSON.stringify(this.state.treeData));
    var newJson = TreeJsonParser.treeToRoutingSlip(0, oldJson);

    const routingSlipString = `{ "producerReference": "${
      this.state.routingSlip.producerReference
    }", "routingSlip": {"routes": ${JSON.stringify(newJson)}}}`;

    const dbUrl =
      process.env.REACT_APP_COUCH_TARGET +
      "/change/" +
      this.state.routingSlip.id +
      "/" +
      this.state.routingSlip.rev +
      "/realm";

    const gateUrl =
      process.env.REACT_APP_GATEWAY_URL +
      "/" +
      this.state.routingSlip.id +
      "/" +
      this.state.routingSlip.rev;

    try {
      let response = await SendJson.SendWithTokenIdRev(
        gateUrl,
        dbUrl,
        "PUT",
        routingSlipString
      );

      this.setState({
        routingSlip: {
          ...this.state.routingSlip,
          rev: response.rev,
        },
      });
      alert(JSON.stringify(response));
    } catch (error) {
      this.setState({ routingSlip: {} });
      alert(error);
    }
  };

  deletRoutingSlip = async () => {
    const dbUrl =
      process.env.REACT_APP_COUCH_TARGET +
      "/delete/" +
      this.state.routingSlip.id +
      "/" +
      this.state.routingSlip.rev;
    const gateUrl =
      process.env.REACT_APP_GATEWAY_URL +
      "/" +
      this.state.routingSlip.id +
      "/" +
      this.state.routingSlip.rev;

    try {
      let response = await SendJson.SendWithTokenIdRev(
        gateUrl,
        dbUrl,
        "DELETE"
      );
      alert(JSON.stringify(response));

      this.setState({
        treeData: [],
        routingSlip: {
          id: "",
          rev: "",
          producerReference: "",
        },
      });
    } catch (error) {
      alert(error);
    }
  };

  findRoutingSlip = async () => {};

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  handleCloseRemove = () => this.setState({ showRemoveNodeModal: false });
  handleShowRemove = ({ parentKey }) => {
    this.setState({
      showRemoveNodeModal: true,
      nodeToDeleteParentKey: parentKey,
    });
  };
  handleClose = () => this.setState({ showAddNodeModal: false });
  handleShow = ({ parentKey }) => {
    this.setState({
      newNode: {
        ...this.state.newNode,
        parentKey: parentKey,
      },
    });
    this.setState({ showAddNodeModal: true });
  };

  handleShowSearch = () => {
    this.setState({
      showSearchRoutingSlips: !this.state.showSearchRoutingSlips,
    });
  };

  removeNode = () => {
    this.setState({
      treeData: this.deleteNode(
        this.state.treeData,
        this.state.nodeToDeleteParentKey,
        getNodeKey
      ),
    });
    this.setState({ nodeToDeleteParentKey: null, showRemoveNodeModal: false });
  };

  createNewNode = (newNode) => {
    this.setState({
      treeData: this.addNodeUnderParent({
        treeData: this.state.treeData,
        parentKey: newNode.parentKey,
        expandParent: true,
        getNodeKey,
        newNode: newNode,
      }).treeData,
      showAddNodeModal: false,
    });
  };

  showConditions = ({ node }) => {
    this.setState({
      searchString: node.subtitle,
      nodeInfo: node,
      showPopup: true,
    });
  };

  togglePopup = () => {
    this.setState({
      showPopup: false,
      searchString: "",
    });
  };

  selectRoutingSlip = (routingSlip) => {
    this.setState({
      routingSlip: {
        id: routingSlip.id,
        rev: routingSlip.rev,
        producerReference: routingSlip.producerReference,
      },
      treeData: routingSlip.treeData,
    });
  };

  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    return (
      <>
        <Navbar collapseOnSelect expand="md">
          {this.state.routingSlip.producerReference === "" ? (
            <Navbar.Brand>Rediger en Routing Slip </Navbar.Brand>
          ) : (
            <Navbar.Brand>
              Redigering af RoutingSlip
              <strong> {this.state.routingSlip.producerReference} </strong>
            </Navbar.Brand>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={this.handleShowSearch}>
                Find RoutingSlip
              </Nav.Link>
            </Nav>
            {this.state.routingSlip.producerReference !== "" ? (
              <Nav>
                <Form inline>
                  <NavDropdown title="Rediger routing slip" id="crud-dropdown">
                    <Nav.Link>Routing Slip Navn</Nav.Link>
                    <Nav.Link onClick={this.deletRoutingSlip}>
                      Slet Routing Slip
                    </Nav.Link>
                  </NavDropdown>
                  <NavDropdown title="Søg i regler" id="search-dropdown">
                    <Nav.Link onClick={this.expandAll}>Udvid Regler</Nav.Link>
                    <Nav.Link onClick={this.collapseAll}>
                      Kollaps Regler
                    </Nav.Link>

                    <FormControl
                      type="text"
                      placeholder="Søg I Regler"
                      className="mr-sm-2"
                      onChange={(event) =>
                        this.setState({ searchString: event.target.value })
                      }
                    />

                    <button
                      type="button"
                      disabled={!searchFoundCount}
                      onClick={selectPrevMatch}
                    >
                      &lt;
                    </button>
                    <button
                      type="submit"
                      disabled={!searchFoundCount}
                      onClick={selectNextMatch}
                    >
                      &gt;
                    </button>
                    <span>
                      &nbsp;
                      {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
                      &nbsp;/&nbsp;
                      {searchFoundCount || 0}
                    </span>
                  </NavDropdown>
                  <Button
                    disabled={
                      this.state.routingSlip.producerReference === ""
                        ? true
                        : false
                    }
                    variant="secondary"
                    onClick={this.sendRoutingSlip}
                  >
                    Gem Routing Slip
                  </Button>
                </Form>
              </Nav>
            ) : null}
          </Navbar.Collapse>

          {this.state.showAddNodeModal === true ? (
            <AddNodeModal
              showAddNodeModal={this.state.showAddNodeModal}
              handleClose={this.handleClose}
              parentKey={this.state.newNode.parentKey}
              createNewNode={this.createNewNode}
            />
          ) : null}

          <RemoveNodeModal
            showRemoveNodeModal={this.state.showRemoveNodeModal}
            removeNode={this.removeNode}
            handleCloseRemove={this.handleCloseRemove}
          />
        </Navbar>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "88vh",
            backgroundColor: "#ededed",
          }}
        >
          <div style={{ flex: "1 0 50%", padding: "0 0 0 15px" }}>
            {this.state.showPopup ? (
              <ShowNodeData
                node={this.state.nodeInfo}
                closePopup={this.togglePopup.bind(this)}
              />
            ) : null}
            {/*this.state.showPopup ? (
              <ShowAlert
                node={this.state.nodeInfo}
                closePopup={this.togglePopup.bind(this)}
              />
            ) : null*/}

            <SortableTree
              treeData={treeData}
              onChange={this.updateTreeData}
              searchQuery={searchString}
              searchFocusOffset={searchFocusIndex}
              //onlyExpandSearchedNodes="true"
              rowHeight={(rowInfo) => (rowInfo.node.topic === "??" ? 60 : 60)}
              searchFinishCallback={(matches) =>
                this.setState({
                  searchFoundCount: matches.length,
                  searchFocusIndex:
                    matches.length > 0 ? searchFocusIndex % matches.length : 0,
                })
              }
              canDrag={({ node }) => !node.dragDisabled}
              canDrop={({ nextParent }) =>
                !nextParent || nextParent.isDirectory
              }
              generateNodeProps={(rowInfo) => ({
                icons: rowInfo.node.isDirectory
                  ? [
                      <div
                        style={{
                          borderLeft: "solid 8px gray",
                          borderBottom: "solid 10px gray",
                          marginRight: 10,
                          boxSizing: "border-box",
                          width: 16,
                          height: 12,
                          filter: rowInfo.node.expanded
                            ? "drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)"
                            : "none",
                          borderColor: rowInfo.node.expanded ? "white" : "gray",
                        }}
                      />,
                    ]
                  : [
                      <div
                        style={{
                          border: "solid 1px black",
                          fontSize: 8,
                          textAlign: "center",
                          marginRight: 10,
                          width: 12,
                          height: 16,
                        }}
                      >
                        F
                      </div>,
                    ],

                buttons: [
                  <Button
                    variant="info"
                    style={{
                      padding: 0,
                      margin: 2,
                      width: 20,
                      height: 20,
                      border: 10,
                    }}
                    onClick={() => this.showConditions(rowInfo)}
                  >
                    i
                  </Button>,
                  <Button
                    variant="danger"
                    style={{
                      //borderRadius: "100%",
                      padding: 0,
                      margin: 2,
                      width: 20,
                      height: 20,
                      border: 10,
                    }}
                    onClick={() => {
                      this.handleShowRemove({ parentKey: rowInfo.path });
                    }}
                  >
                    -
                  </Button>,
                  <Button
                    variant="success"
                    style={{
                      //borderRadius: "100%",
                      padding: 0,
                      margin: 2,
                      width: 20,
                      height: 20,
                      border: 10,
                    }}
                    onClick={() =>
                      this.handleShow({
                        parentKey: rowInfo.path[rowInfo.path.length - 1],
                      })
                    }
                  >
                    +
                  </Button>,
                ],
              })}
            />
            {this.state.treeData.length === 0 ? (
              this.state.routingSlip.rev === "" ? (
                <>
                  <h5>Vælg en Routing Slip </h5>
                  <Button variant="secondary" onClick={this.handleShowSearch}>
                    Rediger tidligere Routing Slips
                  </Button>
                  <br />
                  <br />
                  <Button
                    variant="outline-secondary"
                    href="#/createRoutingSlip"
                  >
                    {" "}
                    Opret ny Routing Slip
                  </Button>
                </>
              ) : (
                <>
                  <h5>Du har ingen regler </h5>
                  <Button
                    variant="success"
                    onClick={() =>
                      this.handleShow({
                        parentKey: null,
                      })
                    }
                  >
                    Opret en regel
                  </Button>
                </>
              )
            ) : null}
          </div>
        </div>
        {this.state.showSearchRoutingSlips ? (
          <RoutingSlipModal
            showSearchRoutingSlips={this.state.showSearchRoutingSlips}
            handleShowSearch={this.handleShowSearch}
            selectRoutingSlip={this.selectRoutingSlip}
          />
        ) : null}
      </>
    );
  }
}

export default EditRoutingSlip;
