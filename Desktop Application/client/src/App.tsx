import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoomSetup from './pages/RoomSetup';
import Designer from './pages/Designer';
import CustomerView from './pages/CustomerView';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ARViewer from './pages/ARViewer';

// ── Protected Route ─────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="bg-[#06080f] min-h-screen text-slate-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/room-setup" element={<ProtectedRoute><RoomSetup /></ProtectedRoute>} />
          <Route path="/designer" element={<ProtectedRoute><Designer /></ProtectedRoute>} />
          <Route path="/customer-view" element={<ProtectedRoute><CustomerView /></ProtectedRoute>} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/ar-viewer/:id" element={<ARViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
