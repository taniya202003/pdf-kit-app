import React from "react";

export const CustomModle = ({ onClose, onConfirm, message }) => {

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-detail">
        <h3>{message}</h3>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="modle-delete-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};


