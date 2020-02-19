import React, { Component } from "react";
import SortableTree, { toggleExpandedForAll } from "react-sortable-tree";
import {
  Navbar,
  Nav,
  Form,
  Button,
  FormControl,
  Modal,
  Col,
  InputGroup,
  Popover, OverlayTrigger
} from "react-bootstrap";
//import SendJson from "../fetch/SendJson";

import * as TreeUtils from "./test/tree-data-utils";
import "react-sortable-tree/style.css";

const getNodeKey = ({ treeIndex }) => treeIndex;
//const url = "http://cis-x.convergens.dk:5984/routingslips/";
var count = 0;


const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Popover right</Popover.Title>
    <Popover.Content>
      And here's some <strong>amazing</strong> content. It's very engaging.
      right?
    </Popover.Content>
  </Popover>
);



function optionsTranslator(value) {
  switch (value) {
    case "lig med":
      value = "equals";
      break;
    case "større end":
      value = "greater than";
      break;
    case "mindre end":
      value = "less than";
      break;
    default:
      value = "";
  }
  return value;
}

function toDelete(index) {
  if (index === "expanded") return true;
  if (index === "isDirectory") return true;
  if (index === "title") return true;
  if (index === "parentKey") return true;

  return false;
}

function editConditionSlip(input) {
  if (Array.isArray(input)) {
    for (var index = input.length - 1; index >= 0; index--) {
      if (typeof input[index] == "object") {
        editConditionSlip(input[index]);
      }
      if (toDelete(index)) {
        input.splice(index, 1);
      }
    }
  } else {
    for (var jndex in input) {
      if (typeof input[jndex] == "object") {
        editConditionSlip(input[jndex]);
      }
      if (toDelete(jndex)) {
        delete input[jndex];
      }
      if (jndex === "conditions") {
        input.priority = count;
        count++;
      }
      if (jndex === "children") {
        input.routes = input[jndex];
        delete input[jndex];
      }
    }
  }
  return input;
}
//

class About extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newNodeconditions: [{ field: "", action: "", value: "" }],
      newNode: {
        title: "",
        topic: "",
        children: [],
        isDirectory: true
      },

      setShow: false,
      searchString: "",
      searchFocusIndex: 0,
      searchFoundCount: null,
      producerReference: "",
      treeData: [
        {
          title: "data.cvr lig med convergens",
          conditions: [
            { field: "data.cvr", action: "lig med", value: "convergens" }
          ],
          topic: "cvr-beriger",
          isDirectory: true,
          children: [
            {
              title: "data.address.zip lig med 4400",
              condtions: [
                { field: "data.address.zip", action: "lig med", value: "4400" }
              ],
              topic: "kommune-beriger",
              isDirectory: true,
              children: [
                {
                  title: "data.filstørrelse større end 2000",
                  conditions: [
                    {
                      field: "data.filstørrelse",
                      action: "større end",
                      value: "2000"
                    }
                  ],
                  topic: "??",
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
    this.removeNode = TreeUtils.removeNodeAtPath.bind(this);
    this.addNodeUnderParent = TreeUtils.addNodeUnderParent.bind(this);
    this.mapTree = TreeUtils.map.bind(this);
  }

  createRoutingSlipJson = (producerReference, conditionsList) => {
    var jsonObj = `{"producerReference": "${producerReference}", routingSlip${conditionsList}}`;
    return jsonObj;
  };

  generateRoutingSlip = async () => {
    count = 0;

    var oldJson = {};
    oldJson = JSON.parse(JSON.stringify(this.state.treeData)); //dårlig clone løsning
    var newJson = editConditionSlip(oldJson);

    const routingSlipString = `{"producerReference": "${
      this.state.producerReference
    }", "routingSlip": {routes: ${JSON.stringify(newJson)}}}`;
    /*
    const uuidv4 = require("uuid/v4");
    const dbUrl = url + uuidv4();

    let response = await SendJson.SendJson(dbUrl, "PUT", routingSlipString);
    alert(response);
    */

    alert(routingSlipString);
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

  onNodeConditionsChange = evt => {
    var value = evt.target.value;
    /*
    if (evt.target.id.split("_")[0] === "action") {
      value = optionsTranslator(evt.target.value);
    }
*/
    const index = evt.target.id.split("_")[1];

    var copy = [...this.state.newNodeconditions];

    copy[index][evt.target.id.split("_")[0]] = value;

    this.setState({
      newNodeconditions: copy
    });
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

  handleAddNodeCondition = () => {
    this.setState({
      newNodeconditions: this.state.newNodeconditions.concat([
        { field: "", action: "", value: "" }
      ])
    });
  };

  handleRemoveNodeCondition = idx => () => {
    this.setState({
      newNodeconditions: this.state.newNodeconditions.filter(
        (s, sidx) => idx !== sidx
      )
    });
  };

  createNewNode = () => {
    const title =
      this.state.newNodeconditions[0].field +
      " " +
      this.state.newNodeconditions[0].action +
      " " +
      this.state.newNodeconditions[0].value;

    this.setState({
      treeData: this.addNodeUnderParent({
        treeData: this.state.treeData,
        parentKey: this.state.newNode.parentKey,
        expandParent: true,
        getNodeKey,
        newNode: {
          ...this.state.newNode,
          title: title,
          conditions: this.state.newNodeconditions
        }
      }).treeData,
      setShow: false
    });

    this.setState({
      newNodeconditions: [{ field: "", action: "", value: "" }],
      newNode: {
        title: "",
        topic: "",
        children: [],
        isDirectory: true
      }
    });
  };

  addNodeModal = () => {
    return (
      <>
        <Modal
          //size="lg"
          show={this.state.setShow}
          onHide={this.handleClose}
          animation={true}
          autoFocus={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Tilføj Ny Regel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.newNodeconditions.map((condition, idx) => (
              <Form.Row key={idx}>
                <Form.Group as={Col}>
                  <Form.Label>Field</Form.Label>
                  <Form.Control
                    id={"field_" + idx}
                    required
                    placeholder={`field #${idx}`}
                    value={condition.field}
                    onChange={this.onNodeConditionsChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Action</Form.Label>
                  <Form.Control
                    as="select"
                    id={"action_" + idx}
                    value={condition.action}
                    required
                    onChange={this.onNodeConditionsChange}
                  >
                    <option hidden> ... </option>
                    <option> lig med </option>
                    <option> større end </option>
                    <option> mindre end </option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Value</Form.Label>
                  <InputGroup>
                    <Form.Control
                      id={"value_" + idx}
                      required
                      placeholder={`value #${idx}`}
                      value={condition.value}
                      onChange={this.onNodeConditionsChange}
                    />
                    <Button
                      disabled={
                        this.state.newNodeconditions.length > 1 ? false : true
                      }
                      variant="outline-danger"
                      onClick={this.handleRemoveNodeCondition(idx)}
                    >
                      -
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form.Row>
            ))}
            {console.log(this.state.newNodeconditions)}
            <Form.Row>
              <Form.Group as={Col} />
              <Form.Group as={Col} />
              <Form.Group as={Col} />
              <Button
                variant="outline-success"
                onClick={this.handleAddNodeCondition}
              >
                +
              </Button>
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
        <Navbar collapseOnSelect expand="lg">
          <Navbar.Brand>Ændring af Routing Slip</Navbar.Brand>
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
                  <div>
                    {" "}
                    <h6 style={{}}>
                      &nbsp;
                      {rowInfo.node.topic}
                      &nbsp;
                    </h6>
                  </div>,
                  <OverlayTrigger
                    trigger="click"
                    placement="right"
                    overlay={popover}
                  >
                    <button></button>
                  </OverlayTrigger>,
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

export default About;
