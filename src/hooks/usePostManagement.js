import { useState } from "react";
import api from "../api/axios";

export function usePostManagement(posts, setPosts) {
  const [editModalPost, setEditModalPost] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteModalPost, setDeleteModalPost] = useState(null);

  // Edit Post
  // Open edit modal
  const handleEditClick = (post) => {
    setEditModalPost(post);
    setEditText(post.Text || post.text || "");
  };

    // Confirm edit and save to db
    const handleSubmitEdit = async () => {
        if (!editText.trim() || !editModalPost) return;

        try {
            const imageUrl = editModalPost.Image || editModalPost.image || null;

            await api.put(`/posts/${editModalPost.ID}`, { 
            content: editText,
            imageUrl, 
            });

            const updated = posts.map((p) =>
            p.ID === editModalPost.ID
                ? { ...p, Text: editText, text: editText, Image: imageUrl, image: imageUrl }
                : p
            );

            setPosts(updated);
            setEditModalPost(null);
            setEditText("");
        } catch (err) {
            console.error("Error updating post:", err);
        }
    };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditModalPost(null);
    setEditText("");
  };

  // Delete Post
  // Open delete modal
  const handleDeleteClick = (post) => {
    setDeleteModalPost(post);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteModalPost?.ID) return;

    try {
      await api.delete(`/posts/${deleteModalPost.ID}`);
      setPosts(posts.filter((p) => p.ID !== deleteModalPost.ID));
      setDeleteModalPost(null);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteModalPost(null);
  };

  return {
    editModalPost,
    editText,
    setEditText,
    deleteModalPost,
    handleEditClick,
    handleSubmitEdit,
    handleCancelEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
