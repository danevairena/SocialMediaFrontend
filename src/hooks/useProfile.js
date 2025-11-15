import { useProfileContext } from "../context/ProfileContext";

export function useProfile() {
  const { profile, loading, error, fetchProfile, updateProfile, deleteProfile } = useProfileContext();

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    deleteProfile,
  };
}
