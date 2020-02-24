import React, { Component } from "react";
import "./showNodeData.css";

class AlertModal extends Component {
  render() {
    if (this.props.node.title !== undefined) {
      return (
        <div className="popup_alert">
          <div className="inside_popup_alert">
            <h5>PopUp: </h5>
            <button className="close" onClick={this.props.closePopup}>
              &times;
            </button>
            <p>
              Change this and that and try again. Duis mollis, est non commodo
              luctus, nisi erat porttitor ligula, eget lacinia odio sem nec
              elit. Cras mattis consectetur purus sit amet fermentum.
            </p>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default AlertModal;
