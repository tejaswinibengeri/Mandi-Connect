import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    location: '',
    role: 'farmer'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('register/', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed. ' + JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '3rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          
          <label>Phone Number</label>
          <input type="text" onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
          
          <label>Password</label>
          <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          
          <label>Location</label>
          <input type="text" onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          
          <label>Role</label>
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="farmer">Farmer</option>
            <option value="retailer">Retailer</option>
          </select>
          
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
