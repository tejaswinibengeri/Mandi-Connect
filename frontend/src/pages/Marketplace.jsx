import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [orderModal, setOrderModal] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [search, setSearch] = useState('');
  const [editingCrop, setEditingCrop] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    const res = await api.get('crops/');
    setCrops(res.data);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) return alert('Enter valid quantity');
    setSubmitting(true);
    try {
      const res = await api.post('place-order/', {
        crop: orderModal.id,
        quantity: parseFloat(quantity),
        total_price: parseFloat(quantity) * parseFloat(orderModal.price),
      });

      alert('Order placed successfully! Redirecting to secure UPI gateway...');

      setOrderModal(null);
      setQuantity('');
      fetchCrops();

      // Send the user to the dedicated UPI QR/Redirect portal we just built!
      navigate('/payment', { state: { order: res.data } });

    } catch (err) {
      alert(err.response?.data?.error || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCrop = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`delete-crop/${id}/`);
      alert('Crop removed from marketplace.');
      fetchCrops();
    } catch (err) {
      alert('Failed to delete crop');
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`update-crop/${editingCrop.id}/`, {
        price: editingCrop.price,
        quantity: editingCrop.quantity,
        location: editingCrop.location
      });
      alert('Crop details updated successfully!');
      setEditingCrop(null);
      fetchCrops();
    } catch (err) {
      alert('Failed to update crop');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = crops.filter(c =>
    c.crop_name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ marginTop: '3rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>🌾 Fresh Marketplace</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>Discover and buy verified, high-quality crops directly from our network of skilled farmers.</p>
        
        {user?.role === 'farmer' && (
          <Link to="/add-crop" style={{ marginTop: '1.5rem' }}>
            <button className="btn-primary" style={{ background: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 2rem' }}>
              <PlusCircle size={20} /> Add New Crop Listing
            </button>
          </Link>
        )}

        <div style={{ position: 'relative', width: '100%', maxWidth: '500px', marginTop: '2rem' }}>
          <input
            type="text"
            placeholder="Search by crop name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              borderRadius: '999px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
              fontSize: '1rem',
              backgroundColor: 'rgba(255,255,255,0.9)'
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍃</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No crops found</h3>
          <p>We couldn't find any listings matching your search criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filtered.map(crop => (
            <div key={crop.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
              {crop.image ? (
                <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={`/media/${crop.image}`}
                    alt={crop.crop_name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              ) : (
                <div style={{ width: '100%', height: '220px', background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🌾</div>
              )}

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{crop.crop_name}</h3>
                  <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-dark)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Active</span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', gap: '0.25rem', alignItems: 'center', marginBottom: '0.25rem' }}>📍 {crop.location}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>👨‍🌾 {crop.farmer_name}</p>

                <div style={{ margin: '1.25rem 0', background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Available Stock</span>
                    <strong style={{ fontSize: '1.1rem' }}>{crop.quantity} kg</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>₹{crop.price}/kg</strong>
                  </div>
                </div>

                {user?.role === 'retailer' && (
                  <button
                    onClick={() => { setOrderModal(crop); setQuantity(''); }}
                    className="btn-primary"
                    style={{ marginTop: 'auto', width: '100%', padding: '0.875rem' }}
                  >
                    🛒 Purchase Now
                  </button>
                )}

                {user?.role === 'farmer' && user?.user_id === crop.farmer && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button
                      onClick={() => setEditingCrop(crop)}
                      className="btn-primary"
                      style={{ flex: 1, background: '#3b82f6', border: '1px solid #2563eb' }}
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteCrop(crop.id)}
                      className="btn-primary"
                      style={{ flex: 1, background: '#ef4444', border: '1px solid #dc2626' }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Edit Modal for Farmers */}
      {editingCrop && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Edit Listing: {editingCrop.crop_name}</h3>
            <form onSubmit={handleUpdatePrice}>
              <label>Price per kg (₹)</label>
              <input
                type="number"
                value={editingCrop.price}
                onChange={e => setEditingCrop({...editingCrop, price: e.target.value})}
                step="0.01"
                required
              />
              <label>Available Quantity (kg)</label>
              <input
                type="number"
                value={editingCrop.quantity}
                onChange={e => setEditingCrop({...editingCrop, quantity: e.target.value})}
                required
              />
              <label>Location</label>
              <input
                type="text"
                value={editingCrop.location}
                onChange={e => setEditingCrop({...editingCrop, location: e.target.value})}
                required
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Updating...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditingCrop(null)} style={{ flex: 1, background: '#e5e7eb', color: '#111' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {orderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '380px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Place Order</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {orderModal.crop_name} @ ₹{orderModal.price}/kg (available: {orderModal.quantity} kg)
            </p>
            <form onSubmit={placeOrder}>
              <label>Quantity (kg)</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                min="1"
                max={orderModal.quantity}
                required
              />
              {quantity && (
                <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem' }}>
                  Total: ₹{(parseFloat(quantity) * parseFloat(orderModal.price)).toFixed(2)}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Placing...' : 'Confirm Order'}
                </button>
                <button type="button" onClick={() => setOrderModal(null)} style={{ background: '#e5e7eb', color: '#111' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
