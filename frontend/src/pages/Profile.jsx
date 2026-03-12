import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { User, ShieldCheck, AlertCircle, Edit } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('profile/');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: '600px' }}>
      <div className="card" style={{ position: 'relative' }}>
        <Link to="/edit-profile" style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Edit size={16} /> Edit Profile
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {profile.profile_photo ? (
            <img src={`/media/${profile.profile_photo}`} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={40} color="#9ca3af" />
            </div>
          )}
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>{profile.name} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({profile.role})</span></h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {profile.is_verified ? (
                <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <ShieldCheck size={16} /> Aadhaar Verified
                </span>
              ) : (
                <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <AlertCircle size={16} /> Aadhaar Not Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Basic Details</h3>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Email:</strong> {profile.email || 'Not provided'}</p>
          <p><strong>Location:</strong> {profile.location}</p>
        </div>

        <div>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Account & Payment Details</h3>
          <p><strong>UPI ID:</strong> {profile.upi_id || 'Not provided'}</p>
          <p><strong>Account Holder:</strong> {profile.account_holder_name || 'Not provided'}</p>
          <p><strong>Bank Name:</strong> {profile.bank_name || 'Not provided'}</p>
          <p><strong>Account Number:</strong> {profile.account_number || 'Not provided'}</p>
          <p><strong>IFSC Code:</strong> {profile.ifsc_code || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
