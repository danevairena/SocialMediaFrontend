import "../styles/CommentModal.css";
import { useNavigateToProfile } from "../hooks/useNavigateToProfile";

function CommentModal({ post, newComment, setNewComment, onClose, onSubmitComment }) {
  const goToProfile = useNavigateToProfile();
  if (!post) return null;

  return (
    <div className="comment-modal-overlay">
      <div className="comment-modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Post */}
        <div className="comment-post-header" onClick={() => goToProfile(post.username)} style={{ cursor: 'pointer' }}>
          <img src={post.avatar} alt="avatar" className="avatar" />
          <span className="username">{post.username || "[unknown user]"}</span>
        </div>

        <p className="comment-post-text">{post.Text}</p>
        {post.Image && <img src={post.image} alt="Post" className="modal-post-image" />}

        {/* Load comments */}
        <div className="comments-list">
          {post.comments.map((comment) => (
            <div className="comment-item" key={comment.ID}>
              <div className="comment-header">
                <div className="comment-user" onClick={() => goToProfile(comment.username)} style={{ cursor: 'pointer' }}>
                  <img
                    src={comment.avatar || "/avatars/default-profile-icon.png"}
                    alt={comment.username}
                    className="comment-avatar"
                  />
                  <span className="comment-author">{comment.username}</span>
                </div>
                <span className="comment-timestamp">
                  {new Date(comment.CreatedAt).toLocaleString()}
                </span>
              </div>
              <div className="comment-text">{comment.Text}</div>
            </div>
          ))}
        </div>

        {/* New comment */}
        <div className="comment-input">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={onSubmitComment}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
