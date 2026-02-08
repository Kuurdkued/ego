
import React from 'react';
import { motion } from 'framer-motion';

const Withdraw: React.FC = () => {
  const methods = [
    { name: 'FastPay', logo: 'FP', color: '#1E1E1E' },
    { name: 'FIB', logo: 'FIB', color: '#1E1E1E' },
    { name: 'ZainCash', logo: 'ZC', color: '#1E1E1E' },
    { name: 'Qi Card', logo: 'QI', color: '#1E1E1E' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black font-futuristic uppercase">Withdraw <span className="text-ego-pink neon-text">Funds</span></h2>
        <p className="text-gray-400">Convert your EGO holdings into local currency. Our withdrawal network is expanding.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {methods.map((method, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="glass relative group p-8 rounded-[2.5rem] border-white/5 hover:border-ego-pink/30 overflow-hidden cursor-not-allowed"
          >
            <div className="absolute top-4 right-4 bg-ego-pink/10 text-ego-pink text-[10px] font-black uppercase px-3 py-1 rounded-full">Coming Soon</div>
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center font-futuristic font-black text-2xl group-hover:bg-ego-pink/10 group-hover:text-ego-pink transition-all">
                {method.logo}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black font-futuristic">{method.name}</h3>
                <p className="text-xs text-gray-500 font-medium">Standard Processing: 2-4 Hours</p>
              </div>
              <button disabled className="w-full bg-white/5 py-4 rounded-xl text-gray-500 font-bold uppercase text-xs tracking-widest cursor-not-allowed">
                Integration Pending
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-ego-pink/5 border border-ego-pink/20 p-8 rounded-[2rem] text-center">
        <h4 className="font-bold mb-2">Notice for Early Adopters</h4>
        <p className="text-sm text-gray-400 max-w-lg mx-auto italic">
          Withdrawals will be enabled once the EGO Token generation event is complete. Current balance is stored securely on the internal ledger.
        </p>
      </div>
    </div>
  );
};

export default Withdraw;
