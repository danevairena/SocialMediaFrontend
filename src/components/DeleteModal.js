import '../styles/DeletePostModal.css';

const DeleteModal = ({ onClose, onDelete }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h2>Are you sure you want to delete your profile?</h2>
        <p>This action is irreversible.</p>
        <div className="delete-modal-buttons">
          <button className="delete-btn" onClick={onDelete}>Yes, Delete</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;