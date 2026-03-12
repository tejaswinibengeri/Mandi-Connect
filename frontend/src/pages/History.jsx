import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { History as HistoryIcon, BadgeIndianRupee, Wheat, CheckCircle2 } from 'lucide-react';

const History = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState('crops');
  const [cropsHistory, setCropsHistory] = useState([]);
  const [paymentsHistory, setPaymentsHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [cropsRes, paymentsRes] = await Promise.all([
        api.get('history/crops/'),
        api.get('payments/')
      ]);
      setCropsHistory(cropsRes.data);
      setPaymentsHistory(paymentsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <HistoryIcon /> History Dashboard
      </h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setTab('crops')} 
          className="btn-primary" 
          style={{ opacity: tab === 'crops' ? 1 : 0.5, flex: 1, maxWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Wheat size={18} /> Crops History
        </button>
        <button 
          onClick={() => setTab('payments')} 
          className="btn-primary" 
          style={{ background: '#0284c7', opacity: tab === 'payments' ? 1 : 0.5, flex: 1, maxWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <BadgeIndianRupee size={18} /> UPI Payments
        </button>
      </div>

      {tab === 'crops' && (
        <div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            {user?.role === 'farmer' ? 'Crops Listed by You' : 'Crops Purchased by You'}
          </h3>
          {cropsHistory.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No crops history found.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {cropsHistory.map((item, idx) => (
                <div key={idx} className="card">
                  {item.image && <img src={item.image.startsWith('http') ? item.image : `http://localhost:8000${item.image}`} alt={item.crop_name} loading="lazy" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }} />}
                  <h4 style={{ marginBottom: '0.25rem' }}>{item.crop_name}</h4>
                  {user?.role === 'retailer' ? (
                    <>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Farmer: {item.farmer_name} | {item.location}</p>
                      <p>Qty: <strong>{item.quantity_ordered} kg</strong></p>
                      <p>Total Paid: <strong>₹{item.total_price}</strong></p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.location}</p>
                      <p>Listed Qty: <strong>{item.quantity} kg</strong></p>
                      <p>Price: <strong>₹{item.price}/kg</strong></p>
                    </>
                  )}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Date: {new Date(item.created_at).toLocaleDateString()}</p>
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.2rem 0.6rem', background: (item.status === 'sold' || item.order_status !== 'Pending') ? '#dcfce7' : '#f3f4f6', color: (item.status === 'sold' || item.order_status !== 'Pending') ? '#16a34a' : '#4b5563', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 600 }}>
                    {user?.role === 'farmer' ? item.status.toUpperCase() : item.order_status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'payments' && (
        <div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>UPI Payment History</h3>
          {paymentsHistory.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No payments found.
            </div>
          ) : (
            <div>
              {paymentsHistory.map(payment => (
                <div key={payment.id} className="card" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderLeft: payment.payment_status === 'Paid' ? '4px solid #16a34a' : '4px solid #f59e0b' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{payment.crop_name} (Order #{payment.order})</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {user?.role === 'farmer' ? `From: ${payment.retailer_name}` : `To: ${payment.farmer_name}`}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(payment.payment_date).toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₹{payment.amount_paid}</p>
                    {payment.payment_status === 'Paid' ? (
                      <span style={{ color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}><CheckCircle2 size={16} /> Paid</span>
                    ) : (
                      <span style={{ color: '#f59e0b', fontWeight: 600 }}>Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
