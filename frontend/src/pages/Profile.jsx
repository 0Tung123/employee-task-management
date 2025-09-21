import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Save, Edit3 } from 'lucide-react';
import { getEmployeeProfile, updateEmployeeProfile } from '../API/employee';
import { getUserData, getUserRole } from '../API/auth';
import { NotificationContainer } from '../components/Notification';
import useNotification from '../hooks/useNotification';
import Button from '../components/Button';
import Input from '../components/Input';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { notifications, removeNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const userRole = getUserRole();
        const userData = getUserData();
        
        if (!userRole || !userData) {
          navigate('/login-email');
          return;
        }

        // Chỉ employee mới có thể truy cập profile
        if (userData.role !== 'employee') {
          navigate('/dashboard');
          return;
        }

        // Lấy thông tin profile từ API
        const response = await getEmployeeProfile();
        if (response.success) {
          setProfile(response.profile);
          setFormData({
            name: response.profile.name || '',
            email: response.profile.email || '',
            phone: response.profile.phone || ''
          });
        } else {
          showError('Failed to load profile');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        showError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [navigate, showError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || ''
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      showError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Please enter a valid email address');
      return;
    }

    setSaving(true);
    try {
      const response = await updateEmployeeProfile(formData);
      if (response.success) {
        setProfile(response.profile);
        setIsEditing(false);
        showSuccess('Profile updated successfully');
      } else {
        showError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <p>Failed to load profile</p>
          <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{background: '#f8fafc'}}>
      <div className="main-content" style={{padding: 0}}>
        <div className="dashboard-header" style={{borderBottom: '1px solid #e5e7eb'}}>
          <div className="header-content">
            <div>
              <h1 className="page-title">Profile</h1>
              <p className="page-subtitle">View and update your personal information</p>
            </div>
            <button className="header-btn" onClick={handleBackToDashboard}>
              Back to Dashboard
            </button>
          </div>
        </div>
        <div className="content" style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '32px 0'}}>
          <div className="profile-card" style={{maxWidth: 480, width: '100%', borderRadius: 16, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.08)'}}>
            <div className="profile-avatar" style={{padding: '2.5rem 1.5rem', textAlign: 'center', color: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16}}>
              <div className="avatar-circle" style={{width: 80, height: 80, margin: '0 auto 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.3)'}}>
                <span style={{fontSize: 36, fontWeight: 700, color: '#fff'}}>{profile.name?.charAt(0)?.toUpperCase() || <User size={36} />}</span>
              </div>
              <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>{profile.name}</h2>
              <div style={{margin: '0.25rem 0 0 0'}}>
                <span className="profile-role" style={{background: 'rgba(255,255,255,0.2)', padding: '0.25rem 1rem', borderRadius: 20, fontSize: 14, fontWeight: 500}}>
                  {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Employee'}
                </span>
                {profile.status && (
                  <span style={{marginLeft: 8, fontSize: 13, color: profile.status === 'active' ? '#22c55e' : '#f59e42', fontWeight: 500}}>
                    ● {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
            <div className="profile-form" style={{padding: '2rem'}}>
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="name" style={{fontWeight: 500, color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6}}>
                    <User size={16} /> Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" style={{fontWeight: 500, color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6}}>
                    <Mail size={16} /> Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled={true}
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" style={{fontWeight: 500, color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6}}>
                    <Phone size={16} /> Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="form-actions" style={{marginTop: 32, borderTop: '1px solid #e5e7eb', paddingTop: 24}}>
                {!isEditing ? (
                  <Button onClick={handleEdit} className="edit-button" style={{minWidth: 120}}>
                    <Edit3 size={16} /> Edit Profile
                  </Button>
                ) : (
                  <div className="edit-actions" style={{display: 'flex', gap: 16, justifyContent: 'flex-end'}}>
                    <Button 
                      onClick={handleCancel} 
                      className="cancel-button"
                      style={{minWidth: 120, background: '#f3f4f6', color: '#374151'}}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      className="save-button"
                      style={{minWidth: 120}}
                      disabled={saving}
                    >
                      <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer 
          notifications={notifications} 
          removeNotification={removeNotification} 
        />
      </div>
    </div>
  );
};

export default Profile;