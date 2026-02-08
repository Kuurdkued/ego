
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Mining from './pages/Mining';
import Wallet from './pages/Wallet';
import Leaderboard from './pages/Leaderboard';
import Referral from './pages/Referral';
import Withdraw from './pages/Withdraw';
import Login from './pages/Login';
import Register from './pages/Register';
import { User } from './types';
import { db } from './services/mockDb';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local session
    const session = localStorage.getItem('ego_session');
    if (session) {
      const users = db.getUsers();
      const found = users.find(u => u.id === session);
      if (found) setUser(found);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userId: string) => {
    const found = db.getUsers().find(u => u.id === userId);
    if (found) {
      localStorage.setItem('ego_session', found.id);
      setUser(found);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ego_session');
    setUser(null);
  };

  const handleUserUpdate = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      db.updateUser(user.id, updates);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ego-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ego-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onRegister={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/mining" element={<Mining user={user} onUserUpdate={handleUserUpdate} />} />
              <Route path="/wallet" element={<Wallet user={user} onUserUpdate={handleUserUpdate} />} />
              <Route path="/ranking" element={<Leaderboard />} />
              <Route path="/referral" element={<Referral user={user} />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
