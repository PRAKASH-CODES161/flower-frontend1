import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, IndianRupee, 
  ClipboardList, Receipt, Users, BarChart3, User, LogOut, Flower2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind class merging
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const getMenuItems = (t) => [
  { name: t.nav_dashboard, path: '/dashboard', icon: LayoutDashboard },
  { name: t.nav_purchases, path: '/purchase', icon: ShoppingCart },
  { name: t.nav_stock, path: '/stock', icon: Package },
  { name: t.nav_sales, path: '/sales', icon: IndianRupee },
  { name: t.nav_orders, path: '/orders', icon: ClipboardList },
  { name: t.nav_expenses, path: '/expenses', icon: Receipt },
  { name: t.nav_wholesalers, path: '/wholesalers', icon: Users },
  { name: t.nav_reports, path: '/reports', icon: BarChart3 },
  { name: t.nav_profile, path: '/profile', icon: User },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();
  const menuItems = getMenuItems(t);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-800/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 sidebar-glass z-30 transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3">
          <img src="/floral.jpg" alt="Floral Logo" className="w-10 h-10 object-cover rounded-xl shadow-md bg-white p-1" />
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Floral</h2>
            <p className="text-xs text-mint-primary font-medium">Management System</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-mint-primary/15 text-mint-dark shadow-sm border border-mint-primary/20" 
                    : "text-slate-600 hover:bg-white/60 hover:text-mint-primary"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-mint-primary" : "text-slate-400")} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/40">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-medium text-red-600 hover:bg-red-50/80 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t.nav_logout}
          </button>
        </div>
      </aside>
    </>
  );
}
