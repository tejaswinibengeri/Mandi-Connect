import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, LogOut, Home, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0, 255, 136, 0.2)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 30px rgba(0, 255, 136, 0.05)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(90deg, #00ff88, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
          MandiConnect.
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.95rem', fontWeight: '500' }}>
          {user ? (
            <>
              {user.role === 'farmer' ? (
                <>
                  <Link to="/farmer-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>
                    <LayoutDashboard size={18} /> Manage Crops
                  </Link>
                  <Link to="/add-crop" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>
                    <PlusCircle size={18} /> Add Crop
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/retailer-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link to="/marketplace" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>
                    <ShoppingCart size={18} /> Market
                  </Link>
                </>
              )}
              <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>
                Orders
              </Link>
              <Link to="/history" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>
                History
              </Link>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>
                Profile
              </Link>
              <button 
                onClick={logout} 
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-main)' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 1.25rem', borderRadius: '4px' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
