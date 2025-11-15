import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import api from '../api/axios';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    bio: '',
    profilePicture: null,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // 'available' | 'taken' | null

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Check if username is avaliable
  const checkUsernameUnique = useCallback(async (username) => {
    if (!username) {
      setUsernameStatus(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3001/api/users/check-username/${username}`);
      if (res.data.available) {
        setUsernameStatus('available');
      } else {
        setUsernameStatus('taken');
      }
    } catch (err) {
      console.error("Username check error:", err);
      setUsernameStatus(null);
    }
  }, []);

  // debounce when change username
  useEffect(() => {
    if (!formData.username) {
      setUsernameStatus(null);
      return;
    }
    const delay = setTimeout(() => {
      checkUsernameUnique(formData.username);
    }, 500); // wait 500ms after last symbol
    return () => clearTimeout(delay);
  }, [formData.username, checkUsernameUnique]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'Username is already taken';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('password', formData.password);
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('bio', formData.bio);
      data.append('email', formData.email);
      if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture);
      }

      await api.post('/users', data);
      navigate('/regsuccess');
    } catch (err) {
        if (err.response) {
          console.error('Registration error:', err.response.data);
          alert('Registration failed: ' + (err.response.data.error || JSON.stringify(err.response.data)));
        } else {
          console.error('Registration error:', err);
          alert('Registration failed. Please try again.');
        }
      }
    }
  

  return (
    <div className="register-container">
      <div className="reg-logo-section">
        <img src="/logo-smw-transparent.png" alt="Logo" className="reg-logo-image" />
        <h1>SOCIAL MEDIA WEBSITE</h1>
      </div>

      <form className="form-box" onSubmit={handleSubmit}>
        <div className="form-left">
          <label>
            Username:
            <input
              type="text"
              name="username"
              onChange={handleChange}
              autoComplete="off"
              className={
                usernameStatus === 'taken'
                  ? 'input-taken'
                  : usernameStatus === 'available'
                  ? 'input-available'
                  : ''
              }
            />
            {errors.username && <div className="error-text">{errors.username}</div>}
            {usernameStatus === 'taken' && <div className="error-text">Username is taken</div>}
            {usernameStatus === 'available' && <div className="success-text">Username is available</div>}
          </label>

          <label className="password-label">
            Password:
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={handleChange}
                autoComplete="off"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
            {errors.password && <div className="error-text">{errors.password}</div>}
          </label>

          <label>
            E-mail:
            <input type="text" name="email" onChange={handleChange} autoComplete="off" />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </label>

          <label>
            Bio:
            <textarea name="bio" rows="5" onChange={handleChange}></textarea>
          </label>
        </div>

        <div className="form-right">
          <label>
            First Name:
            <input type="text" name="firstName" onChange={handleChange} />
            {errors.firstName && <div className="error-text">{errors.firstName}</div>}
          </label>

          <label>
            Last Name:
            <input type="text" name="lastName" onChange={handleChange} />
            {errors.lastName && <div className="error-text">{errors.lastName}</div>}
          </label>

          <label>
            Profile picture:
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
          <div className="profile-preview-wrapper">
            <div className="profile-preview">
              <img
                src={
                  formData.profilePicture
                    ? URL.createObjectURL(formData.profilePicture)
                    : '/avatars/default-profile-icon.png'
                }
                alt="Profile Preview"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={usernameStatus === 'taken'}>
            Create new account
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
