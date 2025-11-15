import '../styles/EditPostModal.css'; 

const EditPostModal = ({ post, newText, setNewText, onClose, onSubmitEdit }) => {
  if (!post) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h3>Edit Post</h3>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <div className="edit-modal-buttons">
          <button onClick={onSubmitEdit} className="save">Save</button>
          <button onClick={onClose} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;