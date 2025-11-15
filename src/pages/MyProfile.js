import "../styles/MyProfile.css";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CommentModal from "../components/CommentModal";
import CreatePost from "../components/CreatePost";
import Pagination from "../components/Pagination";
import EditPostModal from "../components/EditPostModal";
import DeletePostModal from "../components/DeletePostModal";

import { useNavigate } from "react-router-dom";
import { useFetchPosts } from "../hooks/useFetchPosts";
import { usePostActions } from "../hooks/usePostActions";
import { useCommentModal } from "../hooks/useCommentModal";
import { usePagination } from "../hooks/usePagination";
import { usePostManagement } from "../hooks/usePostManagement";
import { useProfileContext } from "../context/ProfileContext";

const BASE_URL = "http://localhost:3001";

function MyProfile() {
  const navigate = useNavigate();
  const postsPerPage = 10;

  const { profile, loading: profileLoading, error: profileError } = useProfileContext();

  const { posts, setPosts, loading, error, fetchPosts } = useFetchPosts({
    includeFollowing: false,
    userFilter: profile?.username || null,
  });

  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination(posts.length, postsPerPage);

  const { toggleLike, addComment, createPost } =
    usePostActions(posts, setPosts, fetchPosts);

  const {
    editModalPost,
    editText,
    setEditText,
    deleteModalPost,
    handleEditClick,
    handleSubmitEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelEdit,
    handleCancelDelete,
  } = usePostManagement(posts, setPosts);

  const { activePost, newComment, setNewComment, openModal, closeModal } =
    useCommentModal();

  const myPosts = posts.slice(startIndex, endIndex);

  // Comment
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !activePost) return;
    const updatedComments = await addComment(activePost.ID, newComment);
    if (updatedComments) {
      setNewComment("");
      openModal({ ...activePost, comments: updatedComments });
    }
  };

  // New post
  const handleCreatePost = async ({ text, image }) => {
    if (!profile) return;
    await createPost({ text, image });
    goToPage(1);
  };

  if (profileLoading || loading) return <div className="my-profile-page">Loading...</div>;
  if (profileError || error)
    return (
      <div className="my-profile-page">
        {profileError?.message || error?.message || "Error loading profile"}
      </div>
    );

  return (
    <div className="my-profile-page">
      <Navbar />

      {profile && (
        <div className="profile-container">
          <div className="profile-header">
            <img
              src={
                profile.profilePicture
                  ? `${BASE_URL}/uploads/profile_pics/${profile.profilePicture}`
                  : "/avatars/default-profile-icon.png"
              }
              alt="avatar"
              className="profile-avatar"
            />
            <div className="profile-info">
              <h2 className="profile-username">
                <span className="username-bold">{profile.username}</span>
                {profile.firstName || profile.lastName ? (
                  <> / <span className="fullname-normal">{profile.firstName} {profile.lastName}</span></>
                ) : null}
                <i
                  className="bi bi-pencil-square edit-profile-icon"
                  onClick={() => navigate("/edit-profile")}
                  title="Edit profile"
                ></i>
              </h2>
              <p>{profile.bio || "No bio yet."}</p>
            </div>
          </div>

          {/* Create new post */}
          <div className="create-post-section">
            <CreatePost onCreate={handleCreatePost} />
          </div>

          <div className="user-posts">
            {myPosts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              myPosts.map((post) => (
                <PostCard
                  key={post.ID}
                  post={post}
                  onLikeToggle={() => toggleLike(post.ID)}
                  onCommentClick={() => openModal(post)}
                  onEdit={() => handleEditClick(post)}
                  onDelete={() => handleDeleteClick(post)}
                  showEditOptions={true}
                />
              ))
            )}
          </div>

          {posts.length > postsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <CommentModal
        post={activePost}
        newComment={newComment}
        setNewComment={setNewComment}
        onClose={closeModal}
        onSubmitComment={handleSubmitComment}
      />
      <EditPostModal
        post={editModalPost}
        newText={editText}
        setNewText={setEditText}
        onClose={handleCancelEdit}
        onSubmitEdit={handleSubmitEdit}
      />
      <DeletePostModal
        post={deleteModalPost}
        onClose={handleCancelDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}

export default MyProfile;
