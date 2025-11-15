import "../styles/FeedPage.css";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CommentModal from "../components/CommentModal";
import CreatePost from "../components/CreatePost";
import Pagination from "../components/Pagination";
import { usePostActions } from "../hooks/usePostActions";
import { useFetchPosts } from "../hooks/useFetchPosts";
import { useCommentModal } from "../hooks/useCommentModal";
import { usePagination } from "../hooks/usePagination";
import { useProfileContext } from "../context/ProfileContext";

function FeedPage() {
  const postsPerPage = 10;
  const { profile, loading: profileLoading } = useProfileContext();

  const { posts, setPosts, loading: postsLoading, error, fetchPosts } = useFetchPosts({
    includeFollowing: true,
    page: 1,
    postsPerPage,
    currentUser: profile, 
  });

  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination(posts.length, postsPerPage);

  const { toggleLike, addComment, createPost } = usePostActions(posts, setPosts, fetchPosts);
  const { activePost, newComment, setNewComment, openModal, closeModal } = useCommentModal();

  const currentPosts = posts.slice(startIndex, endIndex);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !activePost) return;
    const updatedComments = await addComment(activePost.ID, newComment);
    if (updatedComments) {
      setNewComment("");
      openModal({ ...activePost, comments: updatedComments });
    }
  };

  const handleCreatePost = async ({ text, image }) => {
    if (!profile) return;
    await createPost({ text, image });
    goToPage(1);
  };

  if (profileLoading || postsLoading) return <div className="feed-container">Loading...</div>;
  if (error) return <div className="feed-container">{error}</div>;

  return (
    <div className="feed-container">
      <Navbar />
      <main className="feed-content">
        {profile && <CreatePost onCreate={handleCreatePost} />}
        {profile && currentPosts.map(post => (
          <PostCard
            key={post.ID}
            post={post}
            onLikeToggle={() => toggleLike(post.ID)}
            onCommentClick={() => openModal(post)}
          />
        ))}
      </main>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      <CommentModal
        post={activePost}
        newComment={newComment}
        setNewComment={setNewComment}
        onClose={closeModal}
        onSubmitComment={handleSubmitComment}
      />
    </div>
  );
}

export default FeedPage;
