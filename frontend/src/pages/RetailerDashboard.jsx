import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RetailerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get('orders/');
    setOrders(res.data);
  };

  const statusColor = (status) => {
    if (status === 'Pending') return '#f59e0b';
    if (status === 'Accepted') return '#22c55e';
    return '#6366f1';
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Welcome, {user?.name} 🛒</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Browse the marketplace and manage your orders.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/marketplace">
          <button className="btn-primary">🌾 Browse Marketplace</button>
        </Link>
        <Link to="/orders">
          <button className="btn-primary" style={{ background: '#6366f1' }}>📦 My Orders</button>
        </Link>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Recent Orders</h3>
      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No orders placed yet. <Link to="/marketplace" style={{ color: 'var(--primary)' }}>Browse crops to order.</Link>
        </div>
      ) : (
        orders.slice(0, 5).map(order => (
          <div key={order.id} className="card" style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                <h4>Order #{order.id} — {order.crop_details?.crop_name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Farmer: {order.farmer_name}</p>
                <p>Qty: <strong>{order.quantity} kg</strong> | Total: <strong>₹{order.total_price}</strong></p>
              </div>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', background: statusColor(order.status) + '20', color: statusColor(order.status), fontWeight: 600, height: 'fit-content' }}>
                {order.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RetailerDashboard;
