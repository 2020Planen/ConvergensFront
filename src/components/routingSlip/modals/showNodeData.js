import React, { Component } from "react";
import "./popupStyle.css";

class ShowNodeData extends Component {
    render() {
      if (this.props.node.title !== undefined) {
        return (
          <div className="popup">
            <div className="inside_popup">
              <h5>Regler for {this.props.node.title}: </h5>
              <button className="close" onClick={this.props.closePopup}>
                &times;
              </button>
              {this.props.node.conditions.map((condition, index) => {
                return (
                  <p key={condition + index}>
                    <strong>Regel {index + 1}:</strong> {condition.field}{" "}
                    <strong>-</strong> {condition.action} <strong>-</strong>{" "}
                    {condition.value}
                  </p>
                );
              })}
            </div>
          </div>
        );
      } else {
        return null;
      }
    }
  }

  export default ShowNodeData;