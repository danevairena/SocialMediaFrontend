import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../data/auth";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load profile from backend
  const fetchProfile = async () => {
    const token = getToken();
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // reset before fetch to avoid showing old data
    setProfile(null);
    setError(null);
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:3001/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const d = res.data;
      const normalized = {
        id: d.ID,
        username: d.Username,
        email: d.Email,
        firstName: d.FirstName,
        lastName: d.LastName,
        bio: d.Bio,
        profilePicture: d.ProfilePicture,
        createdAt: d.CreatedAt,
      };

      setProfile(normalized);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updatedData) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    if (!profile?.id) throw new Error("Profile not loaded");

    const hasFile = updatedData.avatar && updatedData.avatar instanceof File;
    let payload;
    let headers = { Authorization: `Bearer ${token}` };

    if (hasFile) {
      payload = new FormData();
      Object.entries(updatedData).forEach(([k, v]) => {
        if (!v) return;
        if (k === "avatar") payload.append("profilePicture", v);
        else payload.append(k, v);
      });
      headers["Content-Type"] = "multipart/form-data";
    } else {
      payload = {};
      Object.entries(updatedData).forEach(([k, v]) => {
        if (!v) return;
        payload[k] = v;
      });
      headers["Content-Type"] = "application/json";
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:3001/api/users/${profile.id}`, payload, { headers });
      await fetchProfile();
    } catch (err) {
      console.error("Error updating profile (context):", err.response || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete profile
  const deleteProfile = async () => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    if (!profile?.id) throw new Error("Profile not loaded");

    try {
      setLoading(true);
      await axios.delete(`http://localhost:3001/api/users/${profile.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(null);
    } catch (err) {
      console.error("Error deleting profile:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Listen for changes (login/logout)
  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      if (token) {
        fetchProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  return useContext(ProfileContext);
}
