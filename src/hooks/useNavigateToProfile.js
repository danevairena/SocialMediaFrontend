import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../data/auth';

export function useNavigateToProfile() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const goToProfile = (username) => {
    if (currentUser && username === currentUser.username) {
      navigate('/me');
    } else {
      navigate(`/profile/${username}`);
    }
  };

  return goToProfile;
}
