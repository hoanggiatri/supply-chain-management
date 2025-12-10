import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { BottomNav } from '../components/layout';
import MarketplaceHeader from '../components/layout/MarketplaceHeader';
import FloatingOrbs from '../components/ui/FloatingOrbs';
import { INVENTORY_MENU, PURCHASING_MENU, SALES_MENU } from '../config/navigation';
import { NotificationProvider } from '../context/NotificationContext';
import { ThemeProvider } from '../context/ThemeContext';
import { useWindowSize } from '../hooks';
import '../styles/index.css';

// Mobile Menu Item Component
const MobileMenuItem = ({ item, onClick }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 active:bg-blue-50 dark:active:bg-blue-900/20 rounded-xl transition-colors"
  >
    <item.icon size={20} className="text-gray-500 dark:text-gray-400" />
    <span className="font-medium">{item.label}</span>
  </Link>
);

const MobileMenuSection = ({ title, items, onItemClick }) => (
  <div className="mb-6">
    <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {title}
    </h3>
    <div className="space-y-1">
      {items.map((item) => (
        <MobileMenuItem key={item.path} item={item} onClick={onItemClick} />
      ))}
    </div>
  </div>
);

const MarketplaceV2Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDesktop } = useWindowSize();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get user from localStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
  }, []);

  // Determine department from user for Quick Actions (FAB)
  const department = user?.departmentName || 'Mua hàng';

  const handleCreateClick = () => {
    if (department === 'Mua hàng') {
      navigate('/marketplace-v2/create-rfq');
    } else {
      navigate('/marketplace-v2/create-quotation');
    }
  };

  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="mp-v2-root min-h-screen relative bg-gray-50/50 dark:bg-gray-900/50">
          <Toaster position="top-right" richColors />
          {/* Floating Background Orbs */}
          <FloatingOrbs />
          
          {/* New Header with Mega Menu */}
          <MarketplaceHeader
            onMenuClick={() => setIsMobileMenuOpen(true)}
            user={user}
          />

          {/* Mobile Menu Drawer */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                  style={{ zIndex: 'var(--mp-z-modal-backdrop)' }}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 left-0 h-full w-80 mp-glass-sidebar shadow-2xl overflow-y-auto"
                  style={{ zIndex: 'var(--mp-z-modal)' }}
                >
                  <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">Menu</span>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <MobileMenuSection 
                      title="Kho & Vận hành" 
                      items={INVENTORY_MENU} 
                      onItemClick={() => setIsMobileMenuOpen(false)} 
                    />
                    <MobileMenuSection 
                      title="Mua hàng" 
                      items={PURCHASING_MENU} 
                      onItemClick={() => setIsMobileMenuOpen(false)} 
                    />
                    <MobileMenuSection 
                      title="Bán hàng" 
                      items={SALES_MENU} 
                      onItemClick={() => setIsMobileMenuOpen(false)} 
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content - Full Width */}
          <motion.main
            className="min-h-screen mp-scrollbar"
            style={{
              paddingTop: 'var(--mp-header-height)',
              paddingBottom: isDesktop ? '2rem' : 'calc(var(--mp-bottom-nav-height) + 2rem)',
              marginLeft: 0, 
              width: '100%'
            }}
          >
            <div className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.main>

          {/* Bottom Navigation (Mobile) */}
          {!isDesktop && (
            <BottomNav onCreateClick={handleCreateClick} />
          )}
        </div>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default MarketplaceV2Layout;
