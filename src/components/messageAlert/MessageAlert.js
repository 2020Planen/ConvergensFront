import React, { Component } from "react";
import "./messageStyle.css";

class MessageAlert extends Component {
  render() {
    var type = "rgb(255, 204, 204)";
    if (this.props.type === "info") {
      type = "rgb(207, 224, 252)";
    }
    return (
      <div className="alert" style={{ backgroundColor: type }}>
        <div className="inside_alert">
          <h5>{this.props.title} </h5>
          <button className="close" onClick={this.props.closePopup}>&times;</button>
          <p>{this.props.body}</p>
        </div>
      </div>
    );
  }
}

export default MessageAlert;
