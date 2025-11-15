import api from '../api/axios';
import { getCurrentUser } from '../data/auth';

export function usePostActions(posts, setPosts, fetchPosts) {
  const currentUser = getCurrentUser();

  // Toggle like
  const toggleLike = async (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.ID === postId) {
          const newIsLiked = !post.isLiked;
          return {
            ...post,
            Likes: newIsLiked ? post.Likes + 1 : post.Likes - 1,
            isLiked: newIsLiked,
          };
        }
        return post;
      })
    );

    try {
      const post = posts.find(p => p.ID === postId);
      if (!post) return;

      if (!post.isLiked) {
        await api.post('/likes', { postId, userId: currentUser.id });
      } else {
        await api.delete('/likes', { data: { postId, userId: currentUser.id } });
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.ID === postId) {
            return {
              ...post,
              Likes: post.isLiked ? post.Likes - 1 : post.Likes + 1,
              isLiked: post.isLiked
            };
          }
          return post;
        })
      );
    }
  };

  // Add comment
  const addComment = async (postId, text) => {
    if (!text.trim()) return;

    try {
      await api.post('/comments', { postId, userId: currentUser.id, text });

      const res = await api.get(`/comments/${postId}`);
      const updatedComments = res.data.map(c => ({
        ...c,
        avatar: c.avatar || '/avatars/default-profile-icon.png',
        username: c.username || 'Unknown',
        text: c.text || c.Content
      }));

      setPosts(prev =>
        prev.map(p =>
          p.ID === postId ? { ...p, comments: updatedComments } : p
        )
      );

      return updatedComments;
    } catch (err) {
      console.error('Error adding comment:', err);
      return null;
    }
  };

  // Create post
  const createPost = async ({ text, image }) => {
    if (!currentUser) return;

    try {
      const formData = new FormData();
      formData.append('UserID', currentUser.id);
      if (text) formData.append('Text', text);
      if (image) formData.append('image', image);

      await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (fetchPosts) await fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return { toggleLike, addComment, createPost };
}
