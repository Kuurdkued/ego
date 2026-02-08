
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons, COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Icons.Dashboard },
    { path: '/mining', label: 'Mining', icon: Icons.Mining },
    { path: '/wallet', label: 'Wallet', icon: Icons.Wallet },
    { path: '/ranking', label: 'Ranking', icon: Icons.Ranking },
    { path: '/referral', label: 'Referral', icon: Icons.Referral },
  ];

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-ego-black text-white flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-ego-darker border-r border-ego-border flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h1 className="text-3xl font-futuristic font-black tracking-tighter italic flex items-center gap-2">
            <span className="text-ego-pink neon-text">EGO</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-ego-pink text-white shadow-[0_0_20px_rgba(255,0,122,0.4)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-ego-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
          >
            <Icons.Logout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-ego-darker/80 backdrop-blur-xl border-t border-ego-border z-50 flex justify-around items-center py-3 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-ego-pink' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 overflow-x-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
