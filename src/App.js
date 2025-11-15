import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import RegisterPage from './pages/RegisterPage';
import RegistrationSuccess from './pages/RegistrationSuccess';
import FeedPage from './pages/FeedPage';
import UserProfilePage from './pages/UserProfilePage';
import MyProfile from './pages/MyProfile';
import SearchPage from './pages/SearchPage';
import EditProfilePage from './pages/EditProfilePage';
import ViewNotifications from './pages/ViewNotifications';
import ShowPost from './pages/ShowPost';
import ProtectedRoute from './components/ProtectedRoute';
import { ProfileProvider } from './context/ProfileContext';
import { NotificationProvider } from './context/NotificationContext';
import MessagePage from './pages/MessagePage';

function App() {
  return (
    <ProfileProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/regsuccess" element={<RegistrationSuccess />} />

            {/* Protected routes */}
            <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
            <Route path="/profile/:username" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/me" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/viewnotifications" element={<ProtectedRoute><ViewNotifications /></ProtectedRoute>} />
            <Route path="/post/:postId" element={<ProtectedRoute><ShowPost /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagePage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </NotificationProvider>
    </ProfileProvider>
  );
}

export default App;
