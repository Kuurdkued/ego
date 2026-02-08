
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../services/mockDb';
import { User } from '../types';

interface RegisterProps {
  onRegister: (userId: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    refCode: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = db.getUsers();
    if (users.some(u => u.username === formData.username)) return setError('Username already taken');
    if (users.some(u => u.email === formData.email)) return setError('Email already in use');

    let referredById: string | undefined;
    if (formData.refCode) {
      const referrer = users.find(u => u.referralCode === formData.refCode);
      if (referrer) referredById = referrer.id;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      balance: 0,
      totalMined: 0,
      referralCode: formData.username.toUpperCase() + Math.floor(100 + Math.random() * 900),
      referredBy: referredById,
      rankingScore: 10,
      createdAt: Date.now()
    };

    db.addUser(newUser);
    onRegister(newUser.id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ego-black overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ego-pink/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ego-pink/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl glass p-10 rounded-[3rem] space-y-8 border-ego-pink/30"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-futuristic font-black tracking-tighter text-ego-pink neon-text">Genesis Phase</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Create your digital presence</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Username</label>
            <input
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-ego-pink rounded-2xl p-4 outline-none transition-all"
              placeholder="ego_explorer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Email</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-ego-pink rounded-2xl p-4 outline-none transition-all"
              placeholder="explorer@ego.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">First Name</label>
            <input
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-ego-pink rounded-2xl p-4 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Last Name</label>
            <input
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-ego-pink rounded-2xl p-4 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Password</label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-ego-pink rounded-2xl p-4 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Referral Code (Optional)</label>
            <input
              value={formData.refCode}
              onChange={(e) => setFormData({ ...formData, refCode: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-ego-pink rounded-2xl p-4 outline-none transition-all"
              placeholder="ALEX123"
            />
          </div>

          <div className="md:col-span-2">
            {error && <p className="text-red-400 text-xs text-center font-bold bg-red-400/10 p-3 rounded-xl mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full py-4 bg-ego-pink rounded-2xl font-black font-futuristic uppercase tracking-widest shadow-[0_0_30px_#FF007A]"
            >
              Initialize Node
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Already registered? <Link to="/login" className="text-ego-pink font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
