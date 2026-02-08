
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { db } from '../services/mockDb';
// Import Icons from constants to fix "Cannot find name 'Icons'" error
import { Icons } from '../constants';

interface MiningProps {
  user: User;
  onUserUpdate: (updates: Partial<User>) => void;
}

const Mining: React.FC<MiningProps> = ({ user, onUserUpdate }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isMining, setIsMining] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (!user.lastMiningTimestamp) return null;
    const diff = (user.lastMiningTimestamp + 86400000) - Date.now();
    return diff > 0 ? diff : null;
  }, [user.lastMiningTimestamp]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartMining = () => {
    setIsMining(true);
    // Simulate mining animation
    setTimeout(() => {
      const now = Date.now();
      const amount = 1.0;
      
      const updates = {
        balance: user.balance + amount,
        totalMined: user.totalMined + amount,
        lastMiningTimestamp: now,
        rankingScore: user.rankingScore + (amount * 5)
      };

      db.updateUser(user.id, updates);
      db.addMiningLog({
        id: `ml_${now}`,
        userId: user.id,
        amount,
        timestamp: now
      });
      db.addTransaction({
        id: `tx_m_${now}`,
        senderId: 'SYSTEM',
        receiverId: user.id,
        amount,
        type: 'mining',
        timestamp: now
      });

      // Handle referral bonus for first mine
      if (user.totalMined === 0 && user.referredBy) {
        const referrer = db.getUsers().find(u => u.id === user.referredBy);
        if (referrer) {
          db.updateUser(referrer.id, { balance: referrer.balance + 1 });
          db.updateUser(user.id, { ...updates, balance: updates.balance + 1 });
          db.addTransaction({
            id: `tx_r_${now}`,
            senderId: 'SYSTEM',
            receiverId: referrer.id,
            amount: 1,
            type: 'referral',
            timestamp: now
          });
          onUserUpdate({ ...updates, balance: updates.balance + 1 });
        } else {
          onUserUpdate(updates);
        }
      } else {
        onUserUpdate(updates);
      }

      setIsMining(false);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }, 2500);
  };

  const isLocked = timeLeft !== null;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black font-futuristic text-white uppercase tracking-tighter">Mining <span className="text-ego-pink neon-text">Terminal</span></h2>
        <p className="text-gray-400 max-w-lg mx-auto">Access the EGO network and validate transactions to earn your daily rewards. 1 EGO is minted every 24 hours per node.</p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Particle Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-ego-pink/20 animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-ego-pink/10 animate-pulse-slow"></div>

        <motion.div
          animate={isMining ? { scale: [1, 1.1, 1], rotate: 360 } : {}}
          transition={{ duration: 2.5, repeat: isMining ? Infinity : 0 }}
          className="relative z-10 w-64 h-64 flex flex-col items-center justify-center rounded-full bg-ego-darker border-4 border-ego-pink shadow-[0_0_50px_rgba(255,0,122,0.3)]"
        >
          {isMining ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ delay: i * 0.2, repeat: Infinity }}
                    className="w-3 h-3 bg-ego-pink rounded-full"
                  />
                ))}
              </div>
              <span className="font-black font-futuristic text-xs tracking-widest text-ego-pink">MINING...</span>
            </div>
          ) : isLocked ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-gray-500 uppercase">Resets In</span>
              <span className="text-3xl font-black font-futuristic text-white">{formatTime(timeLeft!)}</span>
            </div>
          ) : (
            <button
              onClick={handleStartMining}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-20 h-20 rounded-full bg-ego-pink flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_#FF007A]">
                <Icons.Mining className="w-10 h-10 text-white" />
              </div>
              <span className="font-black font-futuristic tracking-widest text-white group-hover:text-ego-pink transition-colors">START MINING</span>
            </button>
          )}
        </motion.div>

        <AnimatePresence>
          {showReward && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, y: -100 }}
              exit={{ opacity: 0, y: -150 }}
              className="absolute top-1/2 z-20 pointer-events-none"
            >
              <div className="flex flex-col items-center bg-ego-pink px-8 py-3 rounded-full shadow-[0_0_30px_#FF007A]">
                <span className="font-black font-futuristic text-white text-2xl">+1.0 EGO</span>
                <span className="text-white/80 font-bold text-xs uppercase">Reward Collected</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        {[
          { label: 'Uptime', value: '99.9%', desc: 'Network Stability' },
          { label: 'Algorithm', value: 'Proof-of-Ego', desc: 'Secure Minting' },
          { label: 'Next Mint', value: isLocked ? 'Locked' : 'Available', desc: 'Minting Window' }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl text-center space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
            <div className="text-2xl font-black font-futuristic text-ego-pink">{stat.value}</div>
            <p className="text-[10px] text-gray-400">{stat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mining;
