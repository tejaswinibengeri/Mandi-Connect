import React, { useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddCrop = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    crop_name: '',
    quantity: '',
    price: '',
    location: '',
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('crop_name', formData.crop_name);
      data.append('quantity', formData.quantity);
      data.append('price', formData.price);
      data.append('location', formData.location);
      if (image) data.append('image', image);

      await api.post('add-crop/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Crop listed successfully!');
      navigate('/farmer-dashboard');
    } catch (err) {
      alert('Error: ' + JSON.stringify(err.response?.data));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '2rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>🌾 Add New Crop</h2>
        <form onSubmit={handleSubmit}>
          <label>Crop Name</label>
          <input type="text" value={formData.crop_name} onChange={e => setFormData({...formData, crop_name: e.target.value})} placeholder="e.g. Tomatoes, Wheat" required />
          
          <label>Quantity Available (kg)</label>
          <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="500" required min="1" />
          
          <label>Price per kg (₹)</label>
          <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="25" required min="0.01" step="0.01" />
          
          <label>Location</label>
          <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Village, District" required />
          
          <label>Crop Image (optional)</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ marginBottom: '1rem' }} />
          
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Saving...' : 'List Crop'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCrop;
