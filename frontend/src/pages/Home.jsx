import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, LayoutDashboard } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Premium Hero Section */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#050505', color: 'white', padding: '10rem 1rem 8rem', textAlign: 'center', borderBottom: '1px solid rgba(0, 255, 136, 0.1)' }}>
        
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--primary)', filter: 'blur(200px)', opacity: 0.25, zIndex: 0, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'var(--secondary)', filter: 'blur(200px)', opacity: 0.2, zIndex: 0, borderRadius: '50%' }}></div>
        
        {/* Farmer Hero Image Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url("/hero-farmer.png")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent 0%, #050505 100%)', zIndex: 0 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1, animation: 'fadeIn 0.8s ease-out' }}>
          <span style={{ display: 'inline-block', padding: '0.4rem 1.25rem', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', color: 'var(--primary)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '2rem', boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)' }}>
            ⚡ Next-Gen Cyber-AgTech
          </span>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 50%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 40px rgba(0,255,136,0.3)' }}>
            Farm To Retail.<br />Zero Middlemen.
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 400 }}>
            Empowering farmers with ultra-fast direct market access, securing transparent, fresh, and zero-latency supply chains for a decentralized future.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user?.role === 'farmer' && (
              <>
                <Link to="/add-crop">
                  <button style={{ 
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
                    color: '#fff', 
                    padding: '1rem 2.5rem', 
                    fontWeight: 700, 
                    fontSize: '1.1rem', 
                    borderRadius: '999px',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.6)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.4)'; }}
                  >
                    <PlusCircle size={20} /> Add New Crop
                  </button>
                </Link>
                <Link to="/farmer-dashboard">
                  <button style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    color: '#fff', 
                    padding: '1rem 2.5rem', 
                    fontWeight: 700, 
                    fontSize: '1.1rem', 
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                  >
                    <LayoutDashboard size={20} /> Manage My Crops
                  </button>
                </Link>
              </>
            )}
            <Link to="/register">
              <button style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', 
                color: '#000', 
                padding: '1rem 3rem', 
                fontWeight: 700, 
                fontSize: '1.1rem', 
                borderRadius: '999px',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.4)'; }}
              >
                Launch Platform
              </button>
            </Link>
            <Link to="/marketplace">
              <button style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                color: 'var(--white)', 
                padding: '1rem 3rem', 
                fontWeight: 600, 
                fontSize: '1.1rem', 
                borderRadius: '999px', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.color = 'var(--white)'; }}
              >
                Access Deep Market
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Layered Section */}
      <div className="container" style={{ paddingTop: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, #00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>Architecture & Flow</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>A seamless pipeline engineered to maximize profits and completely eliminate infrastructural friction.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {[
            { icon: '🌾', title: '1. Asset Mapping', desc: 'Securely register and list agricultural assets with end-to-end encrypted identity modules.' },
            { icon: '🔎', title: '2. Node Discovery', desc: 'Explore deeply verified, fresh marketplace ledgers using blazing-fast search indexing.' },
            { icon: '⚡', title: '3. Quantum Escrow', desc: 'Execute contracts instantly. Cash settles cross-nodes natively via zero-fee transparent UPI handshakes.' },
            { icon: '🚚', title: '4. Chain Tracking', desc: 'Schedule payloads. Monitor transport nodes sequentially from origin to final destination.' },
          ].map((step, i) => (
            <div key={i} style={{ 
              background: 'rgba(20, 20, 20, 0.6)', 
              backdropFilter: 'blur(20px)', 
              borderRadius: '1.5rem', 
              padding: '3rem 2rem', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={e => { 
              e.currentTarget.style.transform = 'translateY(-10px)'; 
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; 
              e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.4)'; 
              e.currentTarget.style.background = 'rgba(20, 20, 20, 0.8)';
            }}
            onMouseOut={e => { 
              e.currentTarget.style.transform = 'translateY(0)'; 
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)'; 
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.background = 'rgba(20, 20, 20, 0.6)';
            }}
            >
              <div style={{ width: '80px', height: '80px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 229, 255, 0.1))', borderRadius: '50%', border: '1px solid rgba(0, 255, 136, 0.3)', boxShadow: 'inset 0 0 20px rgba(0,255,136,0.1)' }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: '#fff', letterSpacing: '-0.01em' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Farmer Pride Section */}
        <div style={{ marginTop: '10rem', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)', borderRadius: '2rem', padding: '5rem 3rem', border: '1px solid rgba(34, 197, 94, 0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', fontSize: '15rem', opacity: 0.05 }}>🚜</div>
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#fff' }}>Empowering the Hands That Feed Us</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                MandiConnect isn't just a marketplace; it's a digital revolution for the Indian Farmer. We provide the tools, the network, and the security to ensure your hard work results in the maximum profit you deserve.
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '2rem', color: 'var(--primary)', margin: 0 }}>100%</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct Profit</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '2rem', color: 'var(--secondary)', margin: 0 }}>Verified</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Retail Buyers</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Instant</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UPI Payment</p>
                </div>
              </div>
            </div>
            <div style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <img src="/hero-farmer.png" alt="Happy Farmer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
