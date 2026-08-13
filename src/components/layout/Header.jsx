import React from 'react';
import { Menu, User, Languages } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function Header({ setIsSidebarOpen }) {
  const { user } = useAuth();
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white/40 backdrop-blur-md border-b border-white/40 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-white/60 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 sm:gap-2 mr-2 bg-white/50 px-3 py-1.5 rounded-xl border border-white/60 shadow-sm">
          <Languages className="w-4 h-4 text-blue-500 hidden sm:block" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent border-none outline-none cursor-pointer font-bold text-sm text-slate-700"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        <Link to="/profile" className="flex items-center gap-3 hover:bg-white/50 p-1 pr-3 rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-mint-primary/20 flex items-center justify-center text-mint-dark font-medium shadow-sm">
            {user?.name?.charAt(0) || <User className="w-4 h-4" />}
          </div>
          <div className="hidden md:block text-sm text-left">
            <p className="font-semibold text-slate-700 leading-tight">{user?.name || t.adminUser}</p>
            <p className="text-xs text-slate-500">{t.administrator}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
