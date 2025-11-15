import "../styles/UserProfilePage.css";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CommentModal from "../components/CommentModal";

import { useFetchPosts } from "../hooks/useFetchPosts";
import { usePostActions } from "../hooks/usePostActions";
import { useCommentModal } from "../hooks/useCommentModal";
import { usePagination } from "../hooks/usePagination";
import { useFollow } from "../hooks/useFollow";

function UserProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const postsPerPage = 10;

  const { posts, setPosts, userData, loading, error, fetchPosts } =
    useFetchPosts({
      includeFollowing: false,
      userFilter: username || "",
    });

  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination(posts.length, postsPerPage);

  const { toggleLike, addComment } = usePostActions(
    posts,
    setPosts,
    fetchPosts
  );

  const { activePost, newComment, setNewComment, openModal, closeModal } =
    useCommentModal();

  const currentPosts = posts.slice(startIndex, endIndex);

  const { isFollowing, toggleFollow } = useFollow(userData?.ID);

  if (!username) return <div>Invalid profile.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>User not found.</div>;

  // Redirect to chat
  const goToMessages = () => {
    if (!userData?.ID || !userData?.Username) return;
    navigate(`/messages?userId=${userData.ID}&username=${userData.Username}`);
  };
  return (
    <div className="user-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-header">
          <img
            src={
              userData.ProfilePicture
                ? `http://localhost:3001/uploads/profile_pics/${userData.ProfilePicture}`
                : "/avatars/default-profile-icon.png"
            }
            alt="avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2 className="profile-username">
              <span className="username-bold">{userData.Username}</span>
              {userData.FirstName || userData.LastName ? (
                <>
                  {" "}
                  /{" "}
                  <span className="fullname-normal">
                    {userData.FirstName} {userData.LastName}
                  </span>
                </>
              ) : null}
            </h2>
            <p className="profile-bio">{userData.Bio || "No bio yet."}</p>
          </div>

          <div className="profile-actions">
            <button className="follow-btn" onClick={toggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button
              className="message-btn"
              onClick={goToMessages}
              disabled={!userData?.ID || !userData?.Username}
            >
              Message
            </button>
          </div>
        </div>

        <div className="user-posts">
          {currentPosts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            currentPosts.map((post) => (
              <PostCard
                key={post.ID}
                post={post}
                onLikeToggle={() => toggleLike(post.ID)}
                onCommentClick={() => openModal(post)}
              />
            ))
          )}

          {posts.length > postsPerPage && (
            <nav className="pagination-nav">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </div>

      <CommentModal
        post={activePost}
        newComment={newComment}
        setNewComment={setNewComment}
        onClose={closeModal}
        onSubmitComment={() =>
          addComment(activePost.ID, newComment).then(() => setNewComment(""))
        }
      />
    </div>
  );
}

export default UserProfilePage;
