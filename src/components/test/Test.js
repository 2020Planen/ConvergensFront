import React, { Component } from "react";
import SortableTree, { toggleExpandedForAll } from "react-sortable-tree";
import {
  Navbar,
  Nav,
  Form,
  Button,
  FormControl,
  Modal,
  Col
} from "react-bootstrap";

import * as TreeUtils from "./tree-data-utils";
import "react-sortable-tree/style.css";

const getNodeKey = ({ treeIndex }) => treeIndex;

function isExpanded(index) {
  if (index === "expanded") return true;

  if (index === "isDirectory") return true;

  if (index === "title") return true;

  return false;
}

var count = 0;

function editConditionSlip(input) {
  if (Array.isArray(input)) {
    for (var index = input.length - 1; index >= 0; index--) {
      if (typeof input[index] == "object") {
        editConditionSlip(input[index]);
      }
      if (isExpanded(index)) {
        input.splice(index, 1);
      }
    }
  } else {
    for (var jndex in input) {
      if (typeof input[jndex] == "object") {
        editConditionSlip(input[jndex]);
      }
      if (isExpanded(jndex)) {
        delete input[jndex];
      }
      if (jndex === "children") {
        input.priority = count;
        count++;
        input.conditions = input[jndex];
        delete input[jndex];
      }
    }
  }
  return input;
}

class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newNode: {
        title: "",
        field: "",
        action: "",
        value: "",
        topic: "",
        parentKey: 0,
        isDirectory: true
      },

      setShow: false,
      searchString: "",
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [
        {
          title: "data.cvr lig med convergens",
          field: "data.cvr",
          action: "lig med",
          value: "convergens",
          topic: "cvr-beriger",
          isDirectory: true,
          children: [
            {
              title: "data.address.zip lig med 4400",
              field: "data.address.zip",
              action: "lig med",
              value: "4400",
              topic: "kommune-beriger",
              isDirectory: true,
              children: [
                {
                  title: "data.filstørrelse større end 2000",
                  field: "data.filstørrelse",
                  action: "større end",
                  value: "2000",
                  topic: "??",
                  isDirectory: true
                }
              ]
            }
          ]
        },
        {
          title: "data.address.zip lig med 4400",
          field: "data.address.zip",
          action: "lig med",
          value: "4400",
          topic: "kommune-beriger",
          isDirectory: true,
          children: [
            {
              title: "data.filstørrelse større end 2000",
              field: "data.filstørrelse",
              action: "større end",
              value: "2000",
              topic: "??",
              isDirectory: true,
              children: []
            },
            {
              title: "data.cvr lig med convergens",
              field: "data.cvr",
              action: "lig med",
              value: "convergens",
              topic: "cvr-beriger",
              isDirectory: true,
              children: []
            }
          ]
        },
        {
          title: "data.filstørrelse større end 2000",
          field: "data.filstørrelse",
          action: "større end",
          value: "2000",
          topic: "??",
          isDirectory: true,
          children: [
            {
              title: "data.cvr lig med convergens",
              field: "data.cvr",
              action: "lig med",
              value: "convergens",
              topic: "cvr-beriger",
              isDirectory: true,
              children: [
                {
                  title: "data.address.zip lig med 4400",
                  field: "data.address.zip",
                  action: "lig med",
                  value: "4400",
                  topic: "kommune-beriger",
                  isDirectory: true,
                  children: []
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
    this.removeNode = TreeUtils.removeNodeAtPath.bind(this);
    this.addNodeUnderParent = TreeUtils.addNodeUnderParent.bind(this);
    this.mapTree = TreeUtils.map.bind(this);
  }

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

  showTree = () => {
    count = 0;
    var oldJson = {};
    oldJson = JSON.parse(JSON.stringify(this.state.treeData)); //dårlig clone løsning

    var newJson = editConditionSlip(oldJson);
    alert(JSON.stringify(newJson));
  };

  onNodeChange = evt => {
    this.setState({
      newNode: {
        ...this.state.newNode,
        [evt.target.id]: evt.target.value
      }
    });
  };

  handleClose = () => this.setState({ setShow: false });
  handleShow = ({ parentKey }) => {
    this.setState({
      newNode: {
        ...this.state.newNode,
        parentKey: parentKey
      }
    });
    this.setState({ setShow: true });
  };

  createNewNode = () => {
    const title =
      this.state.newNode.field +
      " " +
      this.state.newNode.action +
      " " +
      this.state.newNode.value;

    this.setState({
      treeData: this.addNodeUnderParent({
        treeData: this.state.treeData,
        parentKey: this.state.newNode.parentKey,
        expandParent: true,
        getNodeKey,
        newNode: {
          ...this.state.newNode,
          title: title
        }
      }).treeData,
      setShow: false
    });
  };

  addNodeModal = () => {
    return (
      <>
        <Modal
          show={this.state.setShow}
          onHide={this.handleClose}
          animation={true}
          autoFocus={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Tilføj Ny Regel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Field</Form.Label>
                <Form.Control
                  id="field"
                  required
                  placeholder="field"
                  onChange={this.onNodeChange}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Action</Form.Label>
                <Form.Control
                  as="select"
                  id={"action"}
                  required
                  onChange={this.onNodeChange}
                >
                  <option> ... </option>
                  <option> lig med </option>
                  <option> større end </option>
                  <option> mindre end </option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Value</Form.Label>
                <Form.Control
                  id="value"
                  required
                  placeholder="value"
                  onChange={this.onNodeChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Topic</Form.Label>
                <Form.Control
                  id="topic"
                  required
                  placeholder="topic"
                  onChange={this.onNodeChange}
                />
              </Form.Group>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={this.handleClose}>
              Luk
            </Button>
            <Button variant="secondary" onClick={this.createNewNode}>
              Tilføj regel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount
    } = this.state;

    const alertNodeInfo = ({ node, path, treeIndex }) => {
      const objectString = Object.keys(node)
        .map(k => (k === "children" ? "children: Array" : `${k}: '${node[k]}'`))
        .join(",\n   ");

      global.alert(
        "Info passed to the icon and button generators:\n\n" +
          `node: {\n   ${objectString}\n},\n` +
          `path: [${path.join(", ")}],\n` +
          `treeIndex: ${treeIndex}`
      );
    };

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
        <Navbar>
          <Navbar.Brand href="#home">Ændring af Routing slip</Navbar.Brand>
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
            <Button variant="outline-secondary" onClick={this.showTree}>
              Vis RoutingSlip
            </Button>
          </Form>

          <this.addNodeModal />
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
            <SortableTree
              treeData={treeData}
              onChange={this.updateTreeData}
              searchQuery={searchString}
              searchFocusOffset={searchFocusIndex}
              //onlyExpandSearchedNodes="true"
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
                  <h6 style={{}}>
                    &nbsp;
                    {rowInfo.node.topic}
                    &nbsp;
                  </h6>,
                  <button
                    style={{
                      padding: 0,
                      borderRadius: "100%",
                      backgroundColor: "gray",
                      color: "white",
                      width: 20,
                      height: 20,
                      border: 0,
                      fontWeight: 100
                    }}
                    onClick={() => alertNodeInfo(rowInfo)}
                  >
                    i
                  </button>,
                  <button
                    style={{
                      padding: 0,
                      borderRadius: "100%",
                      backgroundColor: "red",
                      color: "white",
                      width: 20,
                      height: 20,
                      border: 0,
                      fontWeight: 100
                    }}
                    onClick={() =>
                      this.setState({
                        treeData: this.removeNode(
                          this.state.treeData,
                          rowInfo.path,
                          getNodeKey
                        )
                      })
                    }
                  >
                    R
                  </button>,
                  <button
                    style={{
                      padding: 0,
                      borderRadius: "100%",
                      backgroundColor: "Green",
                      color: "white",
                      width: 20,
                      height: 20,
                      border: 0,
                      fontWeight: 100
                    }}
                    onClick={() =>
                      this.handleShow({
                        parentKey: rowInfo.path[rowInfo.path.length - 1],
                        getNodeKey
                      })
                    }
                  >
                    A
                  </button>
                ]
              })}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Test;
