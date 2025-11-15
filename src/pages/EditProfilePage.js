import Navbar from '../components/Navbar';
import EditModal from '../components/EditModal';
import DeleteModal from '../components/DeleteModal';
import ConfirmSaveModal from '../components/ConfirmSaveModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import '../styles/EditProfilePage.css';
import { useEditProfile } from '../hooks/useEditProfile';

const EditProfilePage = () => {
  const {
    usernamevar, firstNamevar, lastNamevar, biovar, avatarvar, password, usernameStatus,
    isEditing, showDeleteModal, showConfirmSaveModal, showChangePasswordModal,
    loading, error,
    setIsEditing, setShowDeleteModal, setShowConfirmSaveModal, setShowChangePasswordModal,
    handleEditField, handleImageChange, handleSave, handleDelete, handleChangePassword, handleBackToProfile,
    getFieldClass,
  } = useEditProfile();

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-profile-page">
      <Navbar />
      <div className="edit-card">

        {/* Left column */}
        <div className="edit-left">
          <label>Username:</label>
          <div className="input-with-icon">
            <input 
              value={usernamevar} 
              disabled 
              className={getFieldClass('usernamevar')} 
            />
            {usernameStatus === 'taken' && <span className="error-text">Username is already taken</span>}
            {usernameStatus === 'available' && <span className="available-text">Username is available</span>}
            <i className="bi bi-pencil edit-icon" onClick={() => setIsEditing('Username')}></i>
          </div>

          <label>Password:</label>
          <div className="input-with-icon">
            <input type="password" value={password} disabled className={getFieldClass('password')} />
            <i className="bi bi-pencil edit-icon" onClick={() => setShowChangePasswordModal(true)}></i>
          </div>

          <label>Bio:</label>
          <div className="textarea-with-icon">
            <textarea value={biovar} disabled className={getFieldClass('biovar')} />
            <i className="bi bi-pencil edit-icon text-icon" onClick={() => setIsEditing('Bio')}></i>
          </div>
        </div>

        {/* Right column */}
        <div className="edit-right">
          <label>First Name:</label>
          <div className="input-with-icon">
            <input value={firstNamevar} disabled className={getFieldClass('firstNamevar')} />
            <i className="bi bi-pencil edit-icon" onClick={() => setIsEditing('First Name')}></i>
          </div>

          <label>Last Name:</label>
          <div className="input-with-icon">
            <input value={lastNamevar} disabled className={getFieldClass('lastNamevar')} />
            <i className="bi bi-pencil edit-icon" onClick={() => setIsEditing('Last Name')}></i>
          </div>

          <label>Profile picture:</label>
            <div className="avatar-center">
              <div className={`avatar-wrapper ${getFieldClass('avatarvar') ? 'edited-avatar' : ''}`}>
                <img src={avatarvar || '/default-profile-icon.png'} alt="Profile" className="edit-avatar" />
                <label htmlFor="upload-avatar">
                  <i className="bi bi-pencil edit-avatar-icon"></i>
                </label>
              </div>
            </div>
            <input id="upload-avatar" type="file" accept="image/*" onChange={handleImageChange} hidden />
          </div>
        <div className="edit-buttons">
          <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>Delete profile</button>
          <button className="save-btn" onClick={() => setShowConfirmSaveModal(true)}>Save updates</button>
          <button className="back-btn" onClick={handleBackToProfile}>Back to My Profile</button>
        </div>
      </div>

      {isEditing && (
        <EditModal
          fieldName={isEditing}
          value={
            isEditing === 'Username' ? usernamevar :
            isEditing === 'First Name' ? firstNamevar :
            isEditing === 'Last Name' ? lastNamevar :
            isEditing === 'Bio' ? biovar :
            password
          }
          onClose={() => setIsEditing(null)}
          onSubmit={handleEditField}
        />
      )}

      {showDeleteModal && <DeleteModal onClose={() => setShowDeleteModal(false)} onDelete={handleDelete} />}
      {showConfirmSaveModal && <ConfirmSaveModal onClose={() => setShowConfirmSaveModal(false)} onSave={handleSave} />}
      {showChangePasswordModal && (
        <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} onSubmit={handleChangePassword} />
      )}
    </div>
  );
};

export default EditProfilePage;
