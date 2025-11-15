import { useState } from 'react';
import '../styles/EditPostModal.css';            
import '../styles/ChangePasswordModal.css'; 

const ChangePasswordModal = ({ onClose, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    if (!oldPassword || !newPassword) {
      setError('Please insert old and new password.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(oldPassword, newPassword);
      onClose();
    } catch (e) {
      setError(e.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={stop}>
        <h3>Change Password</h3>

        <div className="cp-fields">
          <label htmlFor="oldPass">Old Password:</label>
          <input
            id="oldPass"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <label htmlFor="newPass">New Password:</label>
          <input
            id="newPass"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {error && <div className="cp-error">{error}</div>}
        </div>

        <div className="edit-modal-buttons">
          <button className="cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="save" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
