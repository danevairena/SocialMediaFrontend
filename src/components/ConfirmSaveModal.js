import '../styles/ConfirmSaveModal.css';

const ConfirmSaveModal = ({ onClose, onSave }) => {
  return (
    <div className="confirm-save-modal-overlay">
      <div className="confirm-save-modal">
        <h2>Are you sure you want to save the updates?</h2>
        <p>Please review your changes before proceeding.</p>
        <div className="confirm-save-modal-buttons">
          <button className="save-btn" onClick={onSave}>Yes, Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSaveModal;