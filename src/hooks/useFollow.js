import { useState, useEffect } from "react";
import api from "../api/axios";
import { getCurrentUser } from "../data/auth";

export function useFollow(userId) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!userId || !currentUser) return;

    const fetchFollowStatus = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/follow/status`, {
          params: { followerId: currentUser.id, followingId: userId },
        });
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error("Error fetching follow status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowStatus();
  }, [userId]);

  const toggleFollow = async () => {
    const currentUser = getCurrentUser();
    if (!userId || !currentUser) return;

    try {
      if (isFollowing) {
        const res = await api.post("/follow/unfollow", {
          followerId: currentUser.id,
          followingId: userId,
        });
        if (res.status === 200) setIsFollowing(false);
      } else {
        const res = await api.post("/follow/follow", {
          followerId: currentUser.id,
          followingId: userId,
        });
        if (res.status === 201) setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  return { isFollowing, toggleFollow, loading };
}
