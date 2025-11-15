import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUser } from '../data/auth';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredUsers([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Response is not JSON, ignoring:', await res.text());
        setFilteredUsers([]);
        return;
      }

      const data = await res.json();

      setFilteredUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Search error (frontend):', err);
      setFilteredUsers([]);
    }
  };

  return (
    <div className="search-page">
      <Navbar />
      <div className="search-container">
        <input
          type="text"
          placeholder="Type username ..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />

        <div className="search-results">
          {filteredUsers.length === 0 ? (
            <p>No results</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.Username || user.username} // fallback
                className="user-result"
                onClick={() =>
                  navigate(
                    (user.Username || user.username) === currentUser
                      ? '/me'
                      : `/profile/${user.Username || user.username}`
                  )
                }
              >
                <img
                  src={user.ProfilePicture || user.profilePicture || '/default-avatar.png'}
                  alt={user.Username || user.username}
                  className="user-avatar-result"
                />
                <span>{user.Username || user.username}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
