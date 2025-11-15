import '../styles/DeletePostModal.css';

const DeletePostModal = ({ post, onClose, onConfirmDelete }) => {
  if (!post) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3>Delete Post</h3>
        <p>Are you sure you want to delete this post?</p>
        <div className="delete-modal-buttons">
          <button onClick={() => onConfirmDelete(post.id)} className="delete-delete-btn">Delete</button>
          <button onClick={onClose} className="delete-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;