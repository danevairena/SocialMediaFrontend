import '../styles/PostCard.css';
import { useNavigateToProfile } from '../hooks/useNavigateToProfile'; 
const BASE_URL = "http://localhost:3001";

function PostCard({
  post,
  onLikeToggle,
  onCommentClick,
  onEdit,
  onDelete,
  showEditOptions,
}) {
  const {
    ID,
    avatar,
    username,
    Text: text,
    Image: imagePath,
    Likes: likes = 0,
    comments = [],
    isLiked = false,
  } = post;

  const goToProfile = useNavigateToProfile(); 

  const image = imagePath ? `${BASE_URL}${imagePath}` : null;

  return (
    <div className="post-card">
      <div className="post-header">
        <div
          className="post-header-left"
          onClick={() => goToProfile(username)} 
          style={{ cursor: 'pointer' }}
        >
          <img src={avatar} alt={username} className="avatar" />
          <span className="username">{username || '[unknown user]'}</span>
        </div>

        {showEditOptions && (
          <div className="edit-delete-icons">
            {onEdit && (
              <i
                className="bi bi-pencil-square"
                title="Edit post"
                onClick={() => onEdit(post)}
              ></i>
            )}
            {onDelete && (
              <i
                className="bi bi-trash"
                title="Delete post"
                onClick={() => onDelete(ID)}
              ></i>
            )}
          </div>
        )}
      </div>

      <div className="post-text">{text}</div>

      {image && <img src={image} alt="Post" className="post-image" />}

      {(onLikeToggle || onCommentClick) && (
        <div className="post-actions">
          {onLikeToggle && (
            <>
              <i
                className={`bi ${isLiked ? 'bi-heart-fill liked' : 'bi-heart'}`}
                onClick={() => onLikeToggle(ID)}
              ></i>
              {likes > 0 && <span>{likes}</span>}
            </>
          )}

          {onCommentClick && (
            <>
              <i
                className="bi bi-chat"
                onClick={() => onCommentClick(post)}
              ></i>
              {comments.length > 0 && <span>{comments.length}</span>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;
