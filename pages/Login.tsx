
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../services/mockDb';

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = db.getUsers();
    const user = users.find(u => u.email === identifier || u.username === identifier);

    if (user && password === 'password') { // Simplified for demo
      onLogin(user.id);
    } else {
      setError('Invalid credentials (use any seed user email with password "password")');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ego-black overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ego-pink/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ego-pink/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md glass p-10 rounded-[3rem] space-y-8 border-ego-pink/30 shadow-[0_0_50px_rgba(255,0,122,0.1)]"
      >
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-futuristic font-black tracking-tighter italic text-ego-pink neon-text">EGO</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Enter your consciousness</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-2">Username or Email</label>
            <input
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-ego-pink focus:shadow-[0_0_15px_rgba(255,0,122,0.2)] rounded-2xl p-4 outline-none transition-all"
              placeholder="alex@ego.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-2">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-ego-pink focus:shadow-[0_0_15px_rgba(255,0,122,0.2)] rounded-2xl p-4 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center font-bold bg-red-400/10 p-2 rounded-xl">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-ego-pink rounded-2xl font-black font-futuristic uppercase tracking-widest shadow-[0_0_30px_#FF007A] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Access Node
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            New explorer? <Link to="/register" className="text-ego-pink font-bold hover:underline">Register Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
