import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../../api/user';
import './ProfileStyle.css';
import { useNavigate } from 'react-router-dom';
import SidebarHeader from '../../Components/SidebarHeader/SidebarHeader';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [editable, setEditable] = useState({ name: '', mobile: '', location: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getProfile(token);
                if (res.success) {
                    setProfile(res.user);
                    setEditable({
                        name: res.user.name || '',
                        mobile: res.user.mobile || '',
                        location: res.user.location || '',
                    });
                } else toast.error('Failed to fetch profile');
            } catch (err) {
                toast.error('Error fetching profile');
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await updateProfile(editable, token);
            if (res.success) {
                setProfile(res.user);
                toast.success('Profile updated successfully');
            } else toast.error('Failed to update profile');
        } catch (err) {
            toast.error('Error updating profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!profile) return <p>Loading...</p>;

    return (
    <div className="profile-page">
        {/* Sidebar Section */}
        <div className="sidebar">
            <div className="sidebar-profile">
                <SidebarHeader />
                <img src="/default-avatar.png" alt="Avatar" className="sidebar-avatar" />
                <h3>{profile.name}</h3>
                <p>{profile.email}</p>
            </div>
            <div className="sidebar-menu">
                <button className="active"  onClick={() => navigate('/profile')}>My Profile</button>
                <button onClick={() => navigate('/settings')}>Settings</button>
                <button className="logout" onClick={handleLogout}>Log Out</button>
            </div>
        </div>

        {/* Main Content Section */}
        <div className="profile-main">
            <h2>My Profile</h2>
            <div className="profile-card">
                <div className="profile-header">
                    <img src="/default-avatar.png" alt="Avatar" className="profile-avatar" />
                    <div>
                        <h3>{profile.name}</h3>
                        <p>{profile.email}</p>
                    </div>
                </div>

                <div className="profile-fields">
                    <div>
                        <label>Name</label>
                        <input value={editable.name} onChange={(e) => setEditable({ ...editable, name: e.target.value })} />
                    </div>
                    <div>
                        <label>Email account</label>
                        <input value={profile.email} disabled />
                    </div>
                    <div>
                        <label>Mobile number</label>
                        <input value={editable.mobile} onChange={(e) => setEditable({ ...editable, mobile: e.target.value })} placeholder="Add number" />
                    </div>
                    <div>
                        <label>Location</label>
                        <input value={editable.location} onChange={(e) => setEditable({ ...editable, location: e.target.value })} />
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="save-btn" onClick={handleSave}>Save Change</button>
                    <button className="discard-btn" onClick={() => setEditable(profile)}>Discard Change</button>
                </div>
            </div>
        </div>
    </div>
);

};

export default Profile;

