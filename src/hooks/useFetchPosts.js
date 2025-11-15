import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { getCurrentUser } from "../data/auth";

const BASE_URL = "http://localhost:3001";

export function useFetchPosts({ includeFollowing = true, userFilter = null } = {}) {
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const user = getCurrentUser();
    if (!user) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }
    setCurrentUser(user);

    try {
      let userIdsToFetch = [user.id];

      if (includeFollowing) {
        try {
          const followingRes = await api.get(`/followers/following/${user.id}`);
          const followingIds = followingRes.data.map(f => f.FollowingID);
          if (followingIds.length) userIdsToFetch = [user.id, ...followingIds];
        } 
        catch {}
      }

      
      if (userFilter) {
        try {
          const userRes = await api.get(`/users/username/${userFilter}`);
          if (userRes.data && userRes.data.ID) {
            userIdsToFetch = [userRes.data.ID];
            setUserData(userRes.data);
          } else {
            setPosts([]);
            setUserData(null);
            setLoading(false);
            return;
          }
        } catch (err) {
          setError("User not found");
          setPosts([]);
          setUserData(null);
          setLoading(false);
          return;
        }
      } else {
        setUserData({
          ID: user.id,
          Username: user.username,
          Bio: user.bio || "",
          Avatar: user.avatar || null,
        });
      }

      const res = await api.get("/posts", { params: { userIds: userIdsToFetch.join(",") } });

      const postsWithStatus = await Promise.all(
        res.data.map(async post => {
          let isLiked = false;
          try {
            const likesRes = await api.get(`/likes/${post.ID}`);
            isLiked = likesRes.data.some(l => l.UserID === user.id);
          } catch {}

          let comments = [];
          try {
            const commentsRes = await api.get(`/comments/${post.ID}`);
            comments = commentsRes.data.map(c => ({
              ...c,
              avatar: c.avatar || "/avatars/default-profile-icon.png",
              username: c.username || "Unknown",
            }));
          } catch (err) {
            console.error("Error fetching comments for post", post.ID, err);
          }

          return {
            ...post,
            comments,
            avatar: post.ProfilePicture
              ? `${BASE_URL}/uploads/profile_pics/${post.ProfilePicture}`
              : "/avatars/default-profile-icon.png",
            username: post.Username || "Unknown",
            isLiked,
            Likes: post.Likes || 0,
            image: post.Image ? `${BASE_URL}${post.Image}` : null,
          };
        })
      );

      setPosts(postsWithStatus);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts.");
      setLoading(false);
    }
  }, [includeFollowing, userFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, setPosts, userData, loading, error, currentUser, fetchPosts };
}
