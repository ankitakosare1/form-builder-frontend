import React, { useEffect, useState } from "react";
import { getProfile } from "../../api/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./SettingsPageStyle.css";

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getProfile(token);
        if (res.success) {
          setProfile(res.user);
        } else toast.error("Failed to fetch profile");
      } catch (err) {
        toast.error("Error fetching profile");
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-profile">
          <img src="/default-avatar.png" alt="Avatar" className="sidebar-avatar" />
          <h3>{profile.name}</h3>
          <p>{profile.email}</p>
        </div>
        <div className="sidebar-menu">
          <button onClick={() => navigate("/profile")}>My Profile</button>
          <button className="active">Settings</button>
          <button className="logout" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="settings-main">
        <h2>Settings</h2>
        <div className="settings-card">
          <div className="settings-section">
            <h3>Preferences</h3>
            <div className="settings-row">
              <label>Theme</label>
              <select>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <div className="settings-row">
              <label>Language</label>
              <select>
                <option>Eng</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

