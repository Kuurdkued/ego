
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Transaction } from '../types';
import { db } from '../services/mockDb';

interface WalletProps {
  user: User;
  onUserUpdate: (updates: Partial<User>) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, onUserUpdate }) => {
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const transactions = db.getTransactions().filter(tx => tx.senderId === user.id || tx.receiverId === user.id);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) return setError('Invalid amount');
    if (amount > user.balance) return setError('Insufficient balance');

    const users = db.getUsers();
    const targetUser = users.find(u => u.username === transferTarget || u.referralCode === transferTarget);

    if (!targetUser) return setError('Receiver not found');
    if (targetUser.id === user.id) return setError('Cannot send to yourself');

    // Process transaction
    const now = Date.now();
    const tx: Transaction = {
      id: `tx_${now}`,
      senderId: user.id,
      receiverId: targetUser.id,
      amount,
      note: transferNote,
      timestamp: now,
      type: 'transfer'
    };

    db.addTransaction(tx);
    db.updateUser(user.id, { balance: user.balance - amount });
    db.updateUser(targetUser.id, { balance: targetUser.balance + amount });

    onUserUpdate({ balance: user.balance - amount });
    setSuccess(`Successfully sent ${amount} EGO to ${targetUser.username}`);
    setTransferTarget('');
    setTransferAmount('');
    setTransferNote('');
    setTimeout(() => setShowTransfer(false), 2000);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black font-futuristic uppercase">My <span className="text-ego-pink neon-text">Wallet</span></h2>
        <button
          onClick={() => setShowTransfer(true)}
          className="bg-ego-pink hover:bg-ego-pinkGlow px-6 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_#FF007A]"
        >
          Send EGO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="lg:col-span-1 glass p-8 rounded-[2.5rem] bg-gradient-to-br from-ego-pink/10 to-transparent border-ego-pink/20">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Available Balance</span>
              <div className="text-5xl font-black font-futuristic text-white break-all">{user.balance.toFixed(2)} <span className="text-ego-pink text-3xl">EGO</span></div>
              <div className="text-gray-400 font-bold">≈ ${(user.balance * 21.45).toFixed(2)} USD</div>
            </div>
            
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Mined</span>
                <div className="font-bold">{user.totalMined} EGO</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Transferred</span>
                <div className="font-bold">{(transactions.filter(t => t.senderId === user.id && t.type === 'transfer').reduce((acc, t) => acc + t.amount, 0)).toFixed(1)} EGO</div>
              </div>
            </div>
          </div>
        </div>

        {/* History Card */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-bold">Transaction History</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic">No transactions yet</div>
            ) : (
              transactions.map((tx) => {
                const isReceived = tx.receiverId === user.id;
                const isMining = tx.type === 'mining';
                return (
                  <div key={tx.id} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isMining ? 'bg-yellow-500/20 text-yellow-500' : isReceived ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {isMining ? '⛏️' : isReceived ? '↙' : '↗'}
                      </div>
                      <div>
                        <div className="font-bold">{isMining ? 'Mining Reward' : tx.type === 'referral' ? 'Referral Bonus' : isReceived ? 'Received EGO' : 'Sent EGO'}</div>
                        <div className="text-[10px] text-gray-500 uppercase">{new Date(tx.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className={`font-futuristic font-black ${isReceived || isMining ? 'text-green-400' : 'text-red-400'}`}>
                      {isReceived || isMining ? '+' : '-'}{tx.amount.toFixed(2)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransfer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTransfer(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass p-8 rounded-[2.5rem] space-y-6 border-ego-pink/50"
            >
              <h3 className="text-2xl font-black font-futuristic text-white text-center">Transfer <span className="text-ego-pink">EGO</span></h3>
              
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Username or Referral Code</label>
                  <input
                    required
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    placeholder="Enter recipient..."
                    className="w-full bg-ego-darker border border-ego-border focus:border-ego-pink rounded-xl p-4 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Amount (EGO)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-ego-darker border border-ego-border focus:border-ego-pink rounded-xl p-4 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Note (Optional)</label>
                  <input
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    placeholder="Reason for transfer..."
                    className="w-full bg-ego-darker border border-ego-border focus:border-ego-pink rounded-xl p-4 outline-none transition-all"
                  />
                </div>

                {error && <p className="text-red-400 text-xs font-bold bg-red-400/10 p-2 rounded-lg text-center">{error}</p>}
                {success && <p className="text-green-400 text-xs font-bold bg-green-400/10 p-2 rounded-lg text-center">{success}</p>}

                <button
                  type="submit"
                  className="w-full bg-ego-pink py-4 rounded-xl font-black font-futuristic uppercase shadow-[0_0_20px_#FF007A]"
                >
                  Confirm Send
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
