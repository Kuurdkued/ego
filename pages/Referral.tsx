
import React from 'react';
import { User } from '../types';
import { db } from '../services/mockDb';

interface ReferralProps {
  user: User;
}

const Referral: React.FC<ReferralProps> = ({ user }) => {
  const referrals = db.getUsers().filter(u => u.referredBy === user.id);
  const successfulReferrals = referrals.filter(u => u.totalMined > 0);
  const earnedRewards = successfulReferrals.length * 1.0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black font-futuristic uppercase">Grow Your <span className="text-ego-pink neon-text">Network</span></h2>
        <p className="text-gray-400">Invite friends to join the EGO ecosystem. Both of you receive 1.0 EGO when your referral completes their first mining session.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2rem] space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-xl">My Referral Link</h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Share this link</label>
              <div className="flex items-center gap-2 bg-ego-darker border border-ego-border p-4 rounded-xl">
                <code className="flex-1 text-ego-pink font-bold text-sm truncate">ego.app/ref/{user.referralCode}</code>
                <button
                  onClick={() => copyToClipboard(`https://ego.app/ref/${user.referralCode}`)}
                  className="px-4 py-2 bg-ego-pink/10 text-ego-pink hover:bg-ego-pink/20 rounded-lg text-xs font-bold uppercase transition-all"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Unique Code</label>
              <div className="flex items-center gap-2 bg-ego-darker border border-ego-border p-4 rounded-xl">
                <code className="flex-1 text-white font-black font-futuristic text-lg">{user.referralCode}</code>
                <button
                  onClick={() => copyToClipboard(user.referralCode)}
                  className="px-4 py-2 bg-white/5 text-gray-400 hover:text-white rounded-lg text-xs font-bold uppercase transition-all"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] flex flex-col justify-center gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-6 rounded-3xl text-center space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Invited</span>
              <div className="text-3xl font-black font-futuristic">{referrals.length}</div>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl text-center space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Active</span>
              <div className="text-3xl font-black font-futuristic text-green-400">{successfulReferrals.length}</div>
            </div>
          </div>
          <div className="bg-ego-pink shadow-[0_0_30px_rgba(255,0,122,0.3)] p-6 rounded-3xl text-center space-y-1">
            <span className="text-xs font-bold text-white/80 uppercase">Total Rewards Earned</span>
            <div className="text-4xl font-black font-futuristic text-white">{earnedRewards.toFixed(1)} EGO</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Referral Log</h3>
        <div className="glass rounded-[2rem] overflow-hidden">
          {referrals.length === 0 ? (
            <div className="p-12 text-center text-gray-500 italic">No referrals yet. Start inviting!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Username</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date Joined</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {referrals.map((ref) => (
                    <tr key={ref.id}>
                      <td className="px-6 py-4 font-bold">{ref.username}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{new Date(ref.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${ref.totalMined > 0 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                          {ref.totalMined > 0 ? 'Active & Paid' : 'Pending Mint'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referral;
