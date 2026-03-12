import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Marketplace = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [orderModal, setOrderModal] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [search, setSearch] = useState('');
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

  const filtered = crops.filter(c =>
    c.crop_name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ marginTop: '3rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>🌾 Fresh Marketplace</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>Discover and buy verified, high-quality crops directly from our network of skilled farmers.</p>
        
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
              </div>
            </div>
          ))}
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
