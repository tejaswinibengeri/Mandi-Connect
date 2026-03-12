import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import AddCrop from './pages/AddCrop';
import Marketplace from './pages/Marketplace';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import History from './pages/History';
import UPIPayment from './pages/UPIPayment';
import ChatbotWidget from './components/ChatbotWidget';
import './index.css';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/farmer-dashboard" element={
        <ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>
      } />
      <Route path="/add-crop" element={
        <ProtectedRoute role="farmer"><AddCrop /></ProtectedRoute>
      } />
      <Route path="/retailer-dashboard" element={
        <ProtectedRoute role="retailer"><RetailerDashboard /></ProtectedRoute>
      } />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/orders" element={
        <ProtectedRoute><Orders /></ProtectedRoute>
      } />
      <Route path="/payment" element={
        <ProtectedRoute><UPIPayment /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />
      <Route path="/edit-profile" element={
        <ProtectedRoute><EditProfile /></ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute><History /></ProtectedRoute>
      } />
    </Routes>
    <ChatbotWidget />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
