import { useState } from 'react';
import '../styles/EditPostModal.css'; // Reusing the same styling

const EditProfileModal = ({ fieldName, value, onClose, onSubmit }) => {
  const [newValue, setNewValue] = useState(value);

  const handleSubmit = () => {
    if (newValue.trim()) {
      onSubmit(fieldName, newValue); // Pass both the field name and the new value
      onClose();
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h3>Edit {fieldName}</h3>
        {fieldName === 'Bio' ? (
          <textarea
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="modal-textarea"
          />
          ) : (
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="modal-input"
            />
          )
        }
        <div className="edit-modal-buttons">
          <button onClick={handleSubmit} className="save">Save</button>
          <button onClick={onClose} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;