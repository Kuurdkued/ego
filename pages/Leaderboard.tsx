
import React from 'react';
import { motion } from 'framer-motion';
import { db } from '../services/mockDb';

const Leaderboard: React.FC = () => {
  const users = db.getUsers().sort((a, b) => b.rankingScore - a.rankingScore);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-black font-futuristic uppercase">World <span className="text-ego-pink neon-text">Ranking</span></h2>
        <p className="text-gray-400">The most influential EGO holders and miners across the network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {users.slice(0, 3).map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass p-8 rounded-[2rem] text-center space-y-4 relative overflow-hidden ${idx === 0 ? 'border-yellow-500/50 scale-105 z-10' : idx === 1 ? 'border-gray-400/50' : 'border-orange-500/50'}`}
          >
            {idx === 0 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500 shadow-[0_0_15px_#EAB308]"></div>
            )}
            <div className="text-4xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
            <div>
              <div className="font-futuristic font-black text-xl">{user.username}</div>
              <div className="text-ego-pink text-xs font-bold uppercase tracking-widest">{idx + 1}st Place</div>
            </div>
            <div className="bg-white/5 py-2 rounded-xl">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Power Score</span>
              <div className="text-xl font-black">{Math.floor(user.rankingScore)}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx < 3 ? 'bg-ego-pink text-white shadow-[0_0_10px_#FF007A]' : 'bg-white/10 text-gray-400'}`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold flex items-center gap-2">
                      {user.username}
                      {idx < 10 && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 rounded-full font-black uppercase">Verified</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {user.balance.toFixed(2)} <span className="text-xs text-gray-500">EGO</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-ego-pink">{Math.floor(user.rankingScore)}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
