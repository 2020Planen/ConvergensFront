import React from "react";

import { Button, Modal } from "react-bootstrap";

const removeNodeModal = ({ setShowRemove, removeNode, handleCloseRemove }) => {
  return (
    <Modal
      size="sm"
      show={setShowRemove}
      onHide={handleCloseRemove}
      animation={true}
      autoFocus={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Slet Regel?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Hvis du sletter denne regel vil alle tilhørende regler også blive
          slettet
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleCloseRemove}>
          Anuller
        </Button>
        <Button variant="danger" onClick={removeNode}>
          Slet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default removeNodeModal;