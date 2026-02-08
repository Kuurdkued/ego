
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, PricePoint } from '../types';
import { db } from '../services/mockDb';
import PriceChart from '../components/PriceChart';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [currentPrice, setCurrentPrice] = useState(21.45);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [priceTrend, setPriceTrend] = useState<'up' | 'down'>('up');

  // Price engine simulation
  useEffect(() => {
    const history = db.getPriceHistory();
    if (history.length === 0) {
      const initial = Array.from({ length: 20 }, (_, i) => ({
        price: 15.3 + Math.random() * 13.9,
        timestamp: Date.now() - (20 - i) * 10000
      }));
      initial.forEach(p => db.addPricePoint(p));
      setPriceHistory(initial);
      setCurrentPrice(initial[initial.length - 1].price);
    } else {
      setPriceHistory(history);
      setCurrentPrice(history[history.length - 1].price);
    }

    const interval = setInterval(() => {
      const lastPrice = db.getPriceHistory().slice(-1)[0]?.price || 21.45;
      const change = (Math.random() - 0.48) * 0.5; // Slight upward bias
      let newPrice = lastPrice + change;
      
      // Clamp between $15.3 and $29.2
      if (newPrice < 15.3) newPrice = 15.3 + Math.random();
      if (newPrice > 29.2) newPrice = 29.2 - Math.random();

      setPriceTrend(newPrice > lastPrice ? 'up' : 'down');
      setCurrentPrice(newPrice);
      const point = { price: newPrice, timestamp: Date.now() };
      db.addPricePoint(point);
      setPriceHistory(prev => [...prev.slice(-19), point]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-futuristic text-white">Welcome back, <span className="text-ego-pink">{user.firstName}</span></h2>
          <p className="text-gray-400 mt-1">Mining performance is stable. Continue your journey.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-6 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Balance</span>
            <span className="text-2xl font-futuristic font-black text-ego-pink neon-text">{user.balance.toFixed(2)} EGO</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Price Chart Card */}
        <div className="lg:col-span-2 glass p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ego-pink/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-ego-pink animate-ping"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">EGO Live Price</h3>
                <span className="text-xs text-gray-500">Updating every 5 seconds</span>
              </div>
            </div>
            <div className="text-right">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPrice}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-2xl font-black font-futuristic ${priceTrend === 'up' ? 'text-green-400' : 'text-red-400'}`}
                >
                  ${currentPrice.toFixed(2)}
                </motion.div>
              </AnimatePresence>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {priceTrend === 'up' ? '▲ Bullish' : '▼ Bearish'}
              </div>
            </div>
          </div>
          <PriceChart history={priceHistory} />
          <div className="bg-ego-pink/10 border border-ego-pink/20 p-3 rounded-xl text-center">
            <p className="text-ego-pink text-xs font-bold uppercase tracking-wider">COMING SOON — EGO will be listed in real markets</p>
          </div>
        </div>

        {/* Mining Status Sidebar */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-[2rem] border-ego-pink/30 shadow-[0_0_30px_rgba(255,0,122,0.1)]">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ego-pink"></span>
              Mining Activity
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                <span className="text-gray-400">Daily Reward</span>
                <span className="font-bold">1.0 EGO</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                <span className="text-gray-400">Total Mined</span>
                <span className="font-bold">{user.totalMined} EGO</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.hash = '/mining'}
                className="w-full py-4 bg-ego-pink rounded-2xl font-black font-futuristic uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,122,0.4)]"
              >
                Go to Mining
              </motion.button>
            </div>
          </div>

          <div className="glass p-6 rounded-[2rem]">
            <h3 className="font-bold mb-4">Quick Referral</h3>
            <div className="bg-ego-darker border border-ego-border p-4 rounded-xl flex items-center justify-between">
              <code className="text-ego-pink font-bold">{user.referralCode}</code>
              <button className="text-xs uppercase font-bold text-gray-400 hover:text-white transition-colors">Copy Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
