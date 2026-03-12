import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../api';

const UPIPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h3>Order details not found</h3>
        <button className="btn-primary" onClick={() => navigate('/orders')}>Go to Orders</button>
      </div>
    );
  }

  const { payment, crop_details, total_price, quantity } = order;
  const upiLink = payment?.upi_link || '';

  const handleMarkAsPaid = async () => {
    try {
      if (payment?.id) {
        await api.post(`payments/paid/${payment.id}/`);
      }
      alert('Payment confirmed! Redirecting to orders.');
      navigate('/orders');
    } catch (err) {
      alert('Failed to update payment status. You can mark it as paid later from the Orders page.');
      navigate('/orders');
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: '500px' }}>
      <button 
        onClick={() => navigate('/orders')} 
        style={{ background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}
      >
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div className="card" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>UPI Payment Gateway</h2>
        
        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'left' }}>
          <h4 style={{ marginBottom: '0.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Order Summary</h4>
          <p><strong>Crop:</strong> {crop_details?.crop_name}</p>
          <p><strong>Quantity:</strong> {quantity} kg</p>
          <p><strong>Total Amount:</strong> <span style={{ fontSize: '1.25rem', color: '#16a34a', fontWeight: 'bold' }}>₹{total_price}</span></p>
          <p><strong>Paying to Farmer:</strong> {order.farmer_name}</p>
        </div>

        {upiLink ? (
          <div>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              Scan the QR code below with any UPI app (GPay, PhonePe, Paytm) to securely pay the exact amount.
            </p>
            <div style={{ background: 'white', padding: '1rem', display: 'inline-block', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
              {payment.farmer_qr_code ? (
                <img 
                  src={payment.farmer_qr_code} 
                  alt="Farmer UPI QR" 
                  style={{ width: '200px', height: '200px', objectFit: 'contain' }} 
                />
              ) : (
                <QRCodeSVG value={upiLink} size={200} />
              )}
            </div>

            <p style={{ marginBottom: '1rem', fontWeight: 600 }}>OR</p>

            <a 
              href={upiLink} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-primary" 
              style={{ display: 'block', width: '100%', marginBottom: '1rem', background: '#0284c7', textDecoration: 'none', padding: '0.75rem' }}
            >
              🚀 Open App & Pay via UPI
            </a>
          </div>
        ) : (
          <p style={{ color: '#dc2626', marginBottom: '1.5rem' }}>
            Warning: The farmer has not provided a valid UPI ID for automatic payment generation.
          </p>
        )}

        <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)', opacity: 0.5 }} />

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          After completing the payment on your mobile app, click the confirmation button below.
        </p>

        <button 
          onClick={handleMarkAsPaid} 
          className="btn-primary" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#16a34a', padding: '0.75rem', fontSize: '1rem' }}
        >
          <CheckCircle size={20} /> I Have Completed Payment
        </button>
      </div>
    </div>
  );
};

export default UPIPayment;
