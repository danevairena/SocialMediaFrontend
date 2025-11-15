import { useState, useRef } from 'react';
import '../styles/CreatePost.css';
import { useProfileContext } from '../context/ProfileContext';

function CreatePost({ onCreate }) {
  const { profile } = useProfileContext();

  const currentUserAvatar = profile?.profilePicture
    ? `http://localhost:3001/uploads/profile_pics/${profile.profilePicture}`
    : `http://localhost:3001/uploads/profile_pics/default-profile-icon.png`;

  const currentFirstName = profile?.firstName || 'User';

  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    if (!text.trim() && !imageFile) return;

    await onCreate({ text, image: imageFile });

    setText('');
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setExpanded(false);
  };

  const handleCancel = () => {
    setText('');
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setExpanded(false);
  };

  return (
    <div className="create-post">
      {!expanded ? (
        <div className="create-post-collapsed" onClick={() => setExpanded(true)}>
          <img src={currentUserAvatar} alt="Your avatar" className="create-post-avatar" />
          <div className="create-post-placeholder">
            What's on your mind, {currentFirstName}?
          </div>
        </div>
      ) : (
        <>
          <div className="create-post-header">
            <img src={currentUserAvatar} alt="Your avatar" className="create-post-avatar" />
            <textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
            <button
              className="upload-icon"
              onClick={() => fileInputRef.current?.click()}
              title="Add image"
            >
              <i className="bi bi-image"></i>
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>

          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="create-post-image-preview" />
          )}

          <div className="create-post-actions">
            <div className="create-post-buttons">
              <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
              <button className="btn-confirm" onClick={handleConfirm}>Post</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CreatePost;
