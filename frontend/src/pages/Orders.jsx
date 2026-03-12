import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Truck, BadgeIndianRupee } from 'lucide-react';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transportModal, setTransportModal] = useState(null);
  const [transportData, setTransportData] = useState({
    retailer_name: '', pickup_location: '', delivery_address: '',
    driver_name: '', vehicle_number: '', driver_contact: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get('orders/');
    setOrders(res.data);
    setLoading(false);
  };

  const handleTransportSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`transport/${transportModal.id}/`, transportData);
      alert('Transport details saved successfully!');
      setTransportModal(null);
      fetchOrders();
    } catch (err) {
      alert('Error saving transport details');
    }
  };

  const markAsPaid = async (paymentId) => {
    try {
      await api.post(`payments/paid/${paymentId}/`);
      alert('Payment marked as paid locally. Please ensure the UPI transaction was successful.');
      fetchOrders();
    } catch (err) {
      alert('Error updating payment status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order? The quantity will be returned to the farmer's listing.")) {
      try {
        await api.delete(`delete-order/${orderId}/`);
        alert('Order cancelled successfully.');
        fetchOrders();
      } catch (err) {
        alert('Error cancelling order: ' + JSON.stringify(err.response?.data || err.message));
      }
    }
  };

  const statusColor = (status) => {
    if (status === 'Pending') return '#f59e0b';
    if (status === 'Accepted' || status === 'Paid' || status === 'Delivered') return '#16a34a';
    return '#6366f1';
  };

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading orders...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>
        {user?.role === 'farmer' ? '📋 Orders Received' : '📦 My Orders'}
      </h2>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No orders found.
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h4 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>Order #{order.id} — {order.crop_details?.crop_name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {user?.role === 'farmer' ? `Retailer: ${order.retailer_name}` : `Farmer: ${order.farmer_name}`}
                </p>
                <div style={{ marginTop: '0.5rem', background: '#f9fafb', padding: '0.75rem', borderRadius: '6px' }}>
                  <p>Quantity: <strong>{order.quantity} kg</strong></p>
                  <p>Price per kg: <strong>₹{order.crop_details?.price}</strong></p>
                  <p>Total Amount: <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>₹{order.total_price}</strong></p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end', minWidth: '200px' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Status:</span>
                  <span style={{ padding: '0.3rem 0.9rem', borderRadius: '999px', background: statusColor(order.status) + '20', color: statusColor(order.status), fontWeight: 700, border: `1px solid ${statusColor(order.status)}40` }}>
                    {order.status}
                  </span>
                </div>
                
                {/* Payment Section */}
                {order.payment && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment:</span>
                    <span style={{ padding: '0.3rem 0.9rem', borderRadius: '999px', background: statusColor(order.payment.payment_status) + '20', color: statusColor(order.payment.payment_status), fontWeight: 700 }}>
                      {order.payment.payment_status}
                    </span>
                  </div>
                )}
                
                {user?.role === 'retailer' && order.payment && order.payment.payment_status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {order.payment.upi_link && (
                      <a href={order.payment.upi_link} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#0284c7', textDecoration: 'none' }}>
                        <BadgeIndianRupee size={16} /> Pay with UPI
                      </a>
                    )}
                    <button onClick={() => markAsPaid(order.payment.id)} style={{ background: '#e5e7eb', color: '#111', padding: '0.5rem 1rem' }}>
                      Mark as Paid
                    </button>
                  </div>
                )}
                
                {/* Cancel Order Button */}
                {order.status !== 'Delivered' && (
                  <button 
                    onClick={() => handleDeleteOrder(order.id)} 
                    style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.3rem 0.8rem', marginTop: '0.5rem', fontSize: '0.85rem' }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <hr style={{ margin: '1rem 0', borderColor: 'var(--border)', opacity: 0.5 }} />

            {/* Transport Section */}
            <div>
              <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Truck size={16} /> Transportation Details</h5>
              {order.transport ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.9rem', background: '#f3f4f6', padding: '0.75rem', borderRadius: '6px' }}>
                  <p><strong>Status:</strong> <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{order.transport.delivery_status}</span></p>
                  <p><strong>Driver:</strong> {order.transport.driver_name} ({order.transport.driver_contact})</p>
                  <p><strong>Vehicle:</strong> {order.transport.vehicle_number}</p>
                  <p><strong>Pickup:</strong> {order.transport.pickup_location}</p>
                  <p><strong>Delivery:</strong> {order.transport.delivery_address}</p>
                  
                  {user?.role === 'farmer' && order.transport.delivery_status !== 'Delivered' && (
                    <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={async () => {
                        const status = prompt('Enter new status (Pickup Scheduled, In Transit, Delivered):');
                        if (status) {
                          try {
                            await api.patch(`transport/status/${order.transport.id}/`, { delivery_status: status });
                            fetchOrders();
                          } catch (e) { alert('Failed to update status'); }
                        }
                      }} style={{ background: 'var(--primary)', color: 'white', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                        Update Status
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  No transportation details provided yet.
                  {user?.role === 'retailer' && (
                    <button onClick={() => setTransportModal(order)} className="btn-primary" style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>
                      + Add Transport Details
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        ))
      )}

      {/* Transport Modal */}
      {transportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add Transport Details</h3>
            <form onSubmit={handleTransportSubmit}>
              <label>Retailer Name (Receiver)</label>
              <input type="text" value={transportData.retailer_name} onChange={e => setTransportData({...transportData, retailer_name: e.target.value})} required />
              
              <label>Pickup Location</label>
              <input type="text" value={transportData.pickup_location} onChange={e => setTransportData({...transportData, pickup_location: e.target.value})} required />
              
              <label>Delivery Address</label>
              <input type="text" value={transportData.delivery_address} onChange={e => setTransportData({...transportData, delivery_address: e.target.value})} required />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Driver Name</label>
                  <input type="text" value={transportData.driver_name} onChange={e => setTransportData({...transportData, driver_name: e.target.value})} required />
                </div>
                <div>
                  <label>Driver Contact</label>
                  <input type="text" value={transportData.driver_contact} onChange={e => setTransportData({...transportData, driver_contact: e.target.value})} required />
                </div>
              </div>

              <label>Vehicle Number</label>
              <input type="text" value={transportData.vehicle_number} onChange={e => setTransportData({...transportData, vehicle_number: e.target.value})} required />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Details</button>
                <button type="button" onClick={() => setTransportModal(null)} style={{ flex: 1, background: '#e5e7eb', color: '#111' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
