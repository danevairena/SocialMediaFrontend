import { useNavigate } from 'react-router-dom';
import '../styles/RegistrationSuccess.css';

function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="logo-image-home">
        <img src="/logo-smw-transparent.png" alt="Logo" className="logo-image-home" />
        <h1 className='logo-text'>SOCIAL MEDIA WEBSITE</h1>
      </div>

      <div className="form-box success-box">
        <h2>Registration<br />successful</h2>
        <button
          className="success-btn"
          onClick={() => navigate('/')}
        >
          Log in
        </button>
      </div>
    </div>
  );
}

export default RegistrationSuccess;