import React, { Component } from "react";
import "./popupStyle.css";

import { Alert } from "react-bootstrap";

class AlertModal extends Component {
  render() {
    if (this.props.node.title !== undefined) {
      return (
        <div className="popup_alert">
          <Alert variant="danger" onClose={() => this.props.closePopup()} dismissible>
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>
              Change this and that and try again. Duis mollis, est non commodo
              luctus, nisi erat porttitor ligula, eget lacinia odio sem nec
              elit. Cras mattis consectetur purus sit amet fermentum.
            </p>
          </Alert>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default AlertModal;
