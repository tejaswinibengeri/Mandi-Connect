import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    aadhaar_number: '',
    upi_id: '',
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    role: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [upiQrCode, setUpiQrCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('profile/');
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        location: res.data.location || '',
        aadhaar_number: res.data.aadhaar_number || '',
        upi_id: res.data.upi_id || '',
        account_holder_name: res.data.account_holder_name || '',
        bank_name: res.data.bank_name || '',
        account_number: res.data.account_number || '',
        ifsc_code: res.data.ifsc_code || '',
        role: res.data.role || '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (profilePhoto) data.append('profile_photo', profilePhoto);
      if (aadhaarImage) data.append('aadhaar_image', aadhaarImage);
      if (upiQrCode) data.append('upi_qr_code', upiQrCode);

      await api.put('profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      alert('Error updating profile: ' + JSON.stringify(err.response?.data));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: '600px', marginBottom: '4rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Basic Details</h3>
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          
          <label>Profile Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files[0])} />

          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Verification (Required for Security)</h3>
          <label>Aadhaar Number</label>
          <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} placeholder="12-digit number" />
          
          <label>Aadhaar Image (Front)</label>
          <input type="file" accept="image/*" onChange={(e) => setAadhaarImage(e.target.files[0])} />

          {formData.role === 'farmer' && (
            <>
              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Payment Details</h3>
              <label>UPI ID (Mandatory for Farmers)</label>
              <input type="text" name="upi_id" value={formData.upi_id} onChange={handleChange} placeholder="example@upi" />
              
              <label>Account Holder Name</label>
              <input type="text" name="account_holder_name" value={formData.account_holder_name} onChange={handleChange} />
              
              <label>Bank Name</label>
              <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} />
              
              <label>Account Number</label>
              <input type="text" name="account_number" value={formData.account_number} onChange={handleChange} />
              
              <label>IFSC Code</label>
              <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} />

              <label>UPI QR Code (Farmer Only)</label>
              <input type="file" accept="image/*" onChange={(e) => setUpiQrCode(e.target.files[0])} />
            </>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" onClick={() => navigate('/profile')} style={{ flex: 1, background: '#e5e7eb', color: '#111' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
