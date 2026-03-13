import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Wheat, ClipboardList, PlusCircle, Edit, Trash2 } from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('crops');
  const [editingCrop, setEditingCrop] = useState(null);

  useEffect(() => {
    fetchCrops();
    fetchOrders();
  }, []);

  const fetchCrops = async () => {
    const res = await api.get('farmer-crops/');
    setCrops(res.data);
  };

  const fetchOrders = async () => {
    const res = await api.get('orders/');
    setOrders(res.data);
  };

  const deleteCrop = async (id) => {
    if (!window.confirm('Delete this crop?')) return;
    await api.delete(`delete-crop/${id}/`);
    fetchCrops();
  };

  const handleUpdateCrop = async (e) => {
    e.preventDefault();
    await api.put(`update-crop/${editingCrop.id}/`, editingCrop);
    setEditingCrop(null);
    fetchCrops();
    alert('Crop updated!');
  };

  const updateOrderStatus = async (orderId, status) => {
    await api.post(`update-order-status/${orderId}/`, { status });
    fetchOrders();
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', borderRadius: '1.5rem', padding: '3rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '10rem', opacity: 0.1 }}>🚜</div>
        <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#fff', position: 'relative', zIndex: 1 }}>Jai Jawan, Jai Kisan! 🌾</h2>
        <p style={{ color: '#d1fae5', fontSize: '1.2rem', marginTop: '0.5rem', opacity: 0.9, position: 'relative', zIndex: 1 }}>Welcome back, {user?.name}. Your hard work keeps the nation thriving.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setTab('crops')} className="btn-primary" style={{ opacity: tab === 'crops' ? 1 : 0.5 }}>
          <Wheat size={16} style={{ marginRight: 6 }} /> My Crops
        </button>
        <button onClick={() => setTab('orders')} className="btn-primary" style={{ opacity: tab === 'orders' ? 1 : 0.5 }}>
          <ClipboardList size={16} style={{ marginRight: 6 }} /> Orders Received
        </button>
        <Link to="/add-crop">
          <button className="btn-primary" style={{ background: 'var(--secondary)' }}>
            <PlusCircle size={16} style={{ marginRight: 6 }} /> Add Crop
          </button>
        </Link>
      </div>

      {tab === 'crops' && (
        <div>
          {crops.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No crops listed yet. Click "Add Crop" to get started.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {crops.map(crop => (
                <div key={crop.id} className="card">
                  {crop.image && <img src={`/media/${crop.image}`} alt={crop.crop_name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }} loading="lazy" />}
                  <h3>{crop.crop_name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>📍 {crop.location}</p>
                  <p>Qty: <strong>{crop.quantity} kg</strong></p>
                  <p>Price: <strong>₹{crop.price}/kg</strong></p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Listed: {new Date(crop.created_at).toLocaleDateString()}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button onClick={() => setEditingCrop(crop)} style={{ padding: '0.4rem 0.8rem', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => deleteCrop(crop.id)} style={{ padding: '0.4rem 0.8rem', background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingCrop && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div className="card" style={{ width: '400px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Edit Crop</h3>
                <form onSubmit={handleUpdateCrop}>
                  <input type="text" value={editingCrop.crop_name} onChange={e => setEditingCrop({...editingCrop, crop_name: e.target.value})} placeholder="Crop Name" />
                  <input type="number" value={editingCrop.quantity} onChange={e => setEditingCrop({...editingCrop, quantity: e.target.value})} placeholder="Quantity (kg)" step="0.01" min="0.01" />
                  <input type="number" value={editingCrop.price} onChange={e => setEditingCrop({...editingCrop, price: e.target.value})} placeholder="Price per kg (₹)" step="0.01" min="0.01" />
                  <input type="text" value={editingCrop.location} onChange={e => setEditingCrop({...editingCrop, location: e.target.value})} placeholder="Location" />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" onClick={() => setEditingCrop(null)} style={{ background: '#e5e7eb', color: '#111' }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No orders received yet.
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4>Order #{order.id} — {order.crop_details?.crop_name}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Retailer: {order.retailer_name}</p>
                    <p>Qty: <strong>{order.quantity} kg</strong> | Total: <strong>₹{order.total_price}</strong></p>
                    <p>Status: <strong style={{ color: order.status === 'Pending' ? '#f59e0b' : order.status === 'Accepted' ? '#22c55e' : '#6366f1' }}>{order.status}</strong></p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {order.status === 'Pending' && (
                      <button onClick={() => updateOrderStatus(order.id, 'Accepted')} style={{ background: '#22c55e', color: 'white', padding: '0.4rem 0.8rem' }}>Accept</button>
                    )}
                    {order.status === 'Accepted' && (
                      <button onClick={() => updateOrderStatus(order.id, 'Delivered')} style={{ background: '#6366f1', color: 'white', padding: '0.4rem 0.8rem' }}>Mark Delivered</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
