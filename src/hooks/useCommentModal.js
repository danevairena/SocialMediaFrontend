import { useState } from "react";

export function useCommentModal() {
  const [activePost, setActivePost] = useState(null);
  const [newComment, setNewComment] = useState("");

  const openModal = (post) => {
    setActivePost(post);
  };

  const closeModal = () => {
    setActivePost(null);
    setNewComment("");
  };

  return {
    activePost,
    newComment,
    setNewComment,
    openModal,
    closeModal,
    isOpen: !!activePost,
  };
}
