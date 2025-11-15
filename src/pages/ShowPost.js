import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useNavigateToProfile } from '../hooks/useNavigateToProfile';
import { useFetchPosts } from '../hooks/useFetchPosts';
import { usePostActions } from '../hooks/usePostActions';
import { useCommentModal } from '../hooks/useCommentModal';
import '../styles/ShowPost.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const BASE_URL = "http://localhost:3001";

const ShowPost = () => {
  const { postId } = useParams();

  // Fetch posts via hook
  const { posts, setPosts, loading, error, fetchPosts } = useFetchPosts();

  const { toggleLike, addComment } = usePostActions(posts, setPosts, fetchPosts);
  const { activePost, newComment, setNewComment, openModal } = useCommentModal();

  // Find post by ID
  const post = posts.find((p) => p.ID === parseInt(postId));

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !activePost) return;

    const updatedComments = await addComment(activePost.ID, newComment);
    if (updatedComments) {
      setNewComment('');
      openModal({ ...activePost, comments: updatedComments });
    }
  };

  const goToProfile = useNavigateToProfile();

  if (loading) return <div className="full-notifications-page">Loading...</div>;

  if (error || !post)
    return (
      <div className="full-notifications-page">
        <div
          className="notification-item"
          style={{ backgroundColor: 'white', textAlign: 'center', padding: '20px' }}
        >
          <h3>{error || 'Post not found'}</h3>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="show-post-container">
        {/* Post Header */}
        <div className="comment-post-header">
          <img src={post.avatar} alt="avatar" className="avatar" />
          <span
            className="username"
            onClick={() => goToProfile(post.Username)}
            style={{ cursor: 'pointer' }}
          >
            {post.Username}
          </span>
        </div>

        <p className="comment-post-text">{post.Text}</p>
        {post.Image && (
          <img
            src={post.Image.startsWith('http') ? post.Image : `${BASE_URL}${post.Image}`}
            alt="Post"
            className="post-image"
          />
        )}

        {/* Like + Comment Count */}
        <div className="post-actions">
          <i
            className={`bi ${post.isLiked ? 'bi-heart-fill liked' : 'bi-heart'}`}
            onClick={() => toggleLike(post.ID)}
            style={{ cursor: 'pointer' }}
          ></i>
          {post.Likes > 0 && <span>{post.Likes}</span>}
          <i
            className="bi bi-chat"
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            onClick={() => openModal(post)}
          ></i>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {post.comments.map((comment) => (
            <div className="comment-item" key={comment.ID || comment.text}>
              <div className="comment-header">
                <div className="comment-user">
                  <img src={comment.avatar} alt={comment.username} className="comment-avatar" />
                  <span
                    className="comment-author"
                    onClick={() => goToProfile(comment.username)}
                    style={{ cursor: 'pointer' }}
                  >
                    {comment.username}
                  </span>
                </div>
                <span className="comment-timestamp">{comment.CreatedAt || comment.timestamp}</span>
              </div>
              <div className="comment-text">{comment.text || comment.Text}</div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        {activePost && activePost.ID === post.ID && (
          <div className="comment-input">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleSubmitComment}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPost;
