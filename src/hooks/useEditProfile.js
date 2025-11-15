import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileContext } from '../context/ProfileContext';
import axios from 'axios';
import { getToken } from '../data/auth';

export function useEditProfile() {
  const navigate = useNavigate();
  const { profile, fetchProfile, updateProfile, deleteProfile, loading, error } = useProfileContext();

  const [usernamevar, setUsername] = useState('');
  const [firstNamevar, setFirstName] = useState('');
  const [lastNamevar, setLastName] = useState('');
  const [biovar, setBio] = useState('');
  const [avatarvar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [password, setPassword] = useState('********');

  const [editedFields, setEditedFields] = useState({
    usernamevar: false,
    firstNamevar: false,
    lastNamevar: false,
    biovar: false,
    avatarvar: false,
    password: false,
  });

  const [usernameStatus, setUsernameStatus] = useState(null); // 'available' | 'taken'

  const [isEditing, setIsEditing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // preload profile
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setBio(profile.bio || '');
      setAvatar(
        profile.profilePicture
          ? `http://localhost:3001/uploads/profile_pics/${profile.profilePicture}`
          : ''
      );
    }
  }, [profile]);

  const handleBackToProfile = () => navigate('/me');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const imageURL = URL.createObjectURL(file);
      setAvatar(imageURL);
      setEditedFields(prev => ({ ...prev, avatarvar: true }));
    }
  };

  const handleEditField = (fieldName, value) => {
    switch (fieldName) {
      case 'Username': setUsername(value); setEditedFields(prev => ({ ...prev, usernamevar: true })); break;
      case 'First Name': setFirstName(value); setEditedFields(prev => ({ ...prev, firstNamevar: true })); break;
      case 'Last Name': setLastName(value); setEditedFields(prev => ({ ...prev, lastNamevar: true })); break;
      case 'Bio': setBio(value); setEditedFields(prev => ({ ...prev, biovar: true })); break;
      case 'Password': setPassword(value); setEditedFields(prev => ({ ...prev, password: true })); break;
      default: break;
    }
    setIsEditing(null);
  };

  const getFieldClass = (fieldName) => {
    if (fieldName === 'usernamevar' && usernameStatus) {
      if (usernameStatus === 'taken') return 'edited error';      
      if (usernameStatus === 'available') return 'edited available'; 
    }

    return editedFields[fieldName] ? 'edited available' : '';
  };

  const checkUsernameUnique = useCallback(async (username) => {
    if (!username) return;
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`http://localhost:3001/api/users/username/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        setUsernameStatus('taken'); 
      } else {
        setUsernameStatus('available'); 
      }
    } catch (err) {
      console.error(err);
      setUsernameStatus(null);
    }
  }, []);

  useEffect(() => {
    if (editedFields.usernamevar && usernamevar.trim() !== '') {
      const timeout = setTimeout(() => checkUsernameUnique(usernamevar), 500);
      return () => clearTimeout(timeout);
    }
  }, [usernamevar, checkUsernameUnique, editedFields.usernamevar]);

  const handleSave = async () => {
    if (usernameStatus === 'taken') {
      alert('Username is already taken!');
      return;
    }

    let updatedData = {};

    if (editedFields.usernamevar && usernamevar.trim() !== "") updatedData.username = usernamevar;
    if (editedFields.firstNamevar && firstNamevar.trim() !== "") updatedData.firstName = firstNamevar;
    if (editedFields.lastNamevar && lastNamevar.trim() !== "") updatedData.lastName = lastNamevar;
    if (editedFields.biovar) updatedData.bio = biovar;
    if (editedFields.avatarvar && avatarFile) updatedData.avatar = avatarFile;

    if (Object.keys(updatedData).length === 0) {
      alert("No changes to save.");
      return;
    }

    try {
      await updateProfile(updatedData);
      await fetchProfile();
      navigate("/me");
    } catch (err) {
      console.error(err);
      alert("Error saving profile.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfile();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error deleting profile.');
    }
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    const token = getToken();
    if (!token) return alert('Not authenticated');
    try {
      await axios.put('http://localhost:3001/api/users/change-password', { oldPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` }});
      alert('Password changed successfully');
      setShowChangePasswordModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to change password');
    }
  };

  return {
    usernamevar, firstNamevar, lastNamevar, biovar, avatarvar, avatarFile, password,
    isEditing, showDeleteModal, showConfirmSaveModal, showChangePasswordModal,
    usernameStatus,
    loading, error,
    setIsEditing, setShowDeleteModal, setShowConfirmSaveModal, setShowChangePasswordModal,
    handleEditField, handleImageChange, handleSave, handleDelete, handleChangePassword, handleBackToProfile,
    getFieldClass
  };
}
