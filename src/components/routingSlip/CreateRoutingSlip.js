import React, { Component } from "react";

import SortableTree, { toggleExpandedForAll } from "react-sortable-tree";
import * as TreeUtils from "./tree-data-utils";
import "react-sortable-tree/style.css";

import { Navbar, Nav, Form, Button, FormControl } from "react-bootstrap";

import SendJson from "../../fetch/SendJson";
import TreeJsonParser from "./dataParsing/TreeJsonParser";
import ShowNodeData from "./modals/showNodeData";
import RemoveNodeModal from "./modals/RemoveNodeModal";
import AddNodeModal from "./modals/AddNodeModal";

const getNodeKey = ({ treeIndex }) => treeIndex;

class CreateRoutingSlip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,

      nodeInfo: {},

      producerReference: "",

      showAddNodeModal: false,

      showRemoveNodeModal: false,
      nodeToDeleteParentKey: null,

      searchString: "",
      searchFocusIndex: 0,
      searchFoundCount: null,

      treeData: [
        {
          title: "cvr-beriger",
          subtitle: "data.cvr - lig med - convergens",
          conditions: [
            { field: "data.cvr", action: "lig med", value: "convergens" }
          ],
          topic: "cvr-beriger",
          isDirectory: true,
          children: [
            {
              title: "kommune-beriger",
              subtitle: "data.address.zip - lig med - 4400",
              conditions: [
                { field: "data.address.zip", action: "lig med", value: "4400" }
              ],
              topic: "kommune-beriger",
              isDirectory: true,
              children: [
                {
                  title: "test-beriger",
                  subtitle: "data.filstørrelse - større end - 2000",
                  conditions: [
                    {
                      field: "data.filstørrelse",
                      action: "større end",
                      value: "2000"
                    }
                  ],
                  topic: "test-beriger",
                  children: [],
                  isDirectory: true
                }
              ]
            }
          ]
        }
      ]
    };

    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.deleteNode = TreeUtils.removeNodeAtPath.bind(this);
    this.addNodeUnderParent = TreeUtils.addNodeUnderParent.bind(this);
    this.mapTree = TreeUtils.map.bind(this);
  }

  generateRoutingSlip = async (e) => {
    e.preventDefault();
    var oldJson = {};
    oldJson = JSON.parse(JSON.stringify(this.state.treeData)); //dårlig clone løsning
    var newJson = TreeJsonParser.treeToRoutingSlip(0, oldJson);

    const routingSlipString = `{"producerReference": "${
      this.state.producerReference
    }", "routingSlip": {"routes": ${JSON.stringify(newJson)}}}`;


    const url = process.env.REACT_APP_COUCH_TARGET + "/add/realm";
    let response = await SendJson.SendWithToken(url, "POST", routingSlipString);
    alert(JSON.stringify(response));

  };

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded
      })
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
      nodeToDeleteParentKey: parentKey
    });
  };

  removeNode = () => {
    this.setState({
      treeData: this.deleteNode(
        this.state.treeData,
        this.state.nodeToDeleteParentKey,
        getNodeKey
      )
    });
    this.setState({ nodeToDeleteParentKey: null, showRemoveNodeModal: false });
  };

  handleClose = () => this.setState({ showAddNodeModal: false });
  handleShow = ({ parentKey }) => {
    this.setState({
      newNode: {
        ...this.state.newNode,
        parentKey: parentKey
      }
    });
    this.setState({ showAddNodeModal: true });
  };

  createNewNode = newNode => {
    this.setState({
      treeData: this.addNodeUnderParent({
        treeData: this.state.treeData,
        parentKey: newNode.parentKey,
        expandParent: true,
        getNodeKey,
        newNode: newNode
      }).treeData,
      showAddNodeModal: false
    });
  };

  showConditions = ({ node }) => {
    this.setState({
      searchString: node.subtitle,
      nodeInfo: node,
      showPopup: true
    });
  };

  togglePopup = () => {
    this.setState({
      showPopup: false,
      searchString: ""
    });
  };

  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount
    } = this.state;

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0
      });

    return (
      <>
        <Navbar collapseOnSelect expand="lg">
          <Navbar.Brand>Opret Routing Slip</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Button variant="outline-secondary" onClick={this.expandAll}>
                Udvid Regler
              </Button>
              <Button variant="outline-secondary" onClick={this.collapseAll}>
                Kollaps Regler
              </Button>
              <Form inline>
                <FormControl
                  type="text"
                  placeholder="Søg I Regler"
                  className="mr-sm-2"
                  onChange={event =>
                    this.setState({ searchString: event.target.value })
                  }
                />
              </Form>
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
            </Nav>
            <Form inline>
              <Form.Control
                id="producerReference"
                required
                placeholder="producer reference navn"
                onChange={event => {
                  this.setState({ producerReference: event.target.value });
                }}
              />
              <Button
                disabled={this.state.producerReference === "" ? true : false}
                variant="outline-secondary"
                onClick={this.generateRoutingSlip}
              >
                Tilføj Routing Slip
              </Button>
            </Form>
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
            height: "100vh",
            backgroundColor: "#ededed"
          }}
        >
          <div style={{ flex: "1 0 50%", padding: "0 0 0 15px" }}>
            {this.state.showPopup ? (
              <ShowNodeData
                node={this.state.nodeInfo}
                closePopup={this.togglePopup.bind(this)}
              />
            ) : null}

            <SortableTree
              treeData={treeData}
              onChange={this.updateTreeData}
              searchQuery={searchString}
              searchFocusOffset={searchFocusIndex}
              //onlyExpandSearchedNodes="true"
              rowHeight={rowInfo => (rowInfo.node.topic === "??" ? 60 : 60)}
              searchFinishCallback={matches =>
                this.setState({
                  searchFoundCount: matches.length,
                  searchFocusIndex:
                    matches.length > 0 ? searchFocusIndex % matches.length : 0
                })
              }
              canDrag={({ node }) => !node.dragDisabled}
              canDrop={({ nextParent }) =>
                !nextParent || nextParent.isDirectory
              }
              generateNodeProps={rowInfo => ({
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
                          borderColor: rowInfo.node.expanded ? "white" : "gray"
                        }}
                      />
                    ]
                  : [
                      <div
                        style={{
                          border: "solid 1px black",
                          fontSize: 8,
                          textAlign: "center",
                          marginRight: 10,
                          width: 12,
                          height: 16
                        }}
                      >
                        F
                      </div>
                    ],

                buttons: [
                  <Button
                    variant="info"
                    style={{
                      padding: 0,
                      margin: 2,
                      width: 20,
                      height: 20,
                      border: 10
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
                      border: 10
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
                      border: 10
                    }}
                    onClick={() =>
                      this.handleShow({
                        parentKey: rowInfo.path[rowInfo.path.length - 1]
                      })
                    }
                  >
                    +
                  </Button>
                ]
              })}
            />
            {this.state.treeData.length === 0 ? (
              <>
                <h5>Du har ingen regler </h5>
                <Button
                  variant="success"
                  onClick={() =>
                    this.handleShow({
                      parentKey: null
                    })
                  }
                >
                  Opret en regel
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

export default CreateRoutingSlip;
