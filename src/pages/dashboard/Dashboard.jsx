import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, IndianRupee, ShoppingCart, 
  Package, Receipt, AlertCircle, Calendar, Languages 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { salesService } from '../../services/salesService';
import { purchaseService } from '../../services/purchaseService';
import { expenseService } from '../../services/expenseService';
import { wholesalerService } from '../../services/wholesalerService';
import { stockService } from '../../services/stockService';
import { useLanguage } from '../../context/LanguageContext';



const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass, langLabel }) => (
  <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${colorClass}/10 text-${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      {trendValue && (
        <p className="text-xs text-slate-500 mt-2 border-t border-slate-200/50 pt-2">
          {langLabel}: <span className="font-semibold text-slate-700">{trendValue}</span>
        </p>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const { t, lang } = useLanguage();

  const [stats, setStats] = useState({
    todaySales: 0,
    monthlySales: 0,
    todayPurchase: 0,
    monthlyPurchase: 0,
    todayExpense: 0,
    monthlyExpense: 0,
    todayProfit: 0,
    monthlyProfit: 0,
    availableStock: 0,
    pendingWholesaler: 0
  });

  const [salesData, setSalesData] = useState([
    { name: t['Mon'] || 'Mon', sales: 4000, purchase: 2400 },
    { name: t['Tue'] || 'Tue', sales: 3000, purchase: 1398 },
    { name: t['Wed'] || 'Wed', sales: 2000, purchase: 9800 },
    { name: t['Thu'] || 'Thu', sales: 2780, purchase: 3908 },
    { name: t['Fri'] || 'Fri', sales: 1890, purchase: 4800 },
    { name: t['Sat'] || 'Sat', sales: 2390, purchase: 3800 },
    { name: t['Sun'] || 'Sun', sales: 3490, purchase: 4300 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const sales = await salesService.getAll();
      const purchases = await purchaseService.getAll();
      const expenses = await expenseService.getAll();
      const wholesalers = await wholesalerService.getAll();
      const stock = await stockService.getAll();

      const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = todayStr.slice(0, 7);

    // Today's Totals
    const todaySales = sales.filter(s => s.date.startsWith(todayStr)).reduce((sum, s) => sum + s.totalAmount, 0);
    const todayPurchase = purchases.filter(p => p.date.startsWith(todayStr)).reduce((sum, p) => sum + p.totalAmount, 0);
    const todayExpense = expenses.filter(e => e.date.startsWith(todayStr)).reduce((sum, e) => sum + e.amount, 0);
    const todayProfit = todaySales - todayPurchase - todayExpense;

    // Monthly Totals
    const monthlySales = sales.filter(s => s.date.startsWith(monthStr)).reduce((sum, s) => sum + s.totalAmount, 0);
    const monthlyPurchase = purchases.filter(p => p.date.startsWith(monthStr)).reduce((sum, p) => sum + p.totalAmount, 0);
    const monthlyExpense = expenses.filter(e => e.date.startsWith(monthStr)).reduce((sum, e) => sum + e.amount, 0);
    const monthlyProfit = monthlySales - monthlyPurchase - monthlyExpense;
    
    const pendingWholesaler = wholesalers.reduce((sum, w) => sum + w.pendingAmount, 0);
    const availableStock = stock.reduce((sum, s) => sum + s.availableQuantity, 0);

      setStats({
        todaySales, monthlySales,
        todayPurchase, monthlyPurchase,
        todayExpense, monthlyExpense,
        todayProfit, monthlyProfit,
        availableStock,
        pendingWholesaler
      });
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{t.dash_title}</h1>
          <p className="text-white/90 text-sm mt-1 drop-shadow-md">{t.dash_subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-slate-600 font-medium hidden sm:flex">
            <Calendar className="w-4 h-4 text-mint-primary" />
            {new Date().toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t.dash_todaySales} 
          value={`₹${stats.todaySales.toFixed(2)}`} 
          icon={IndianRupee} 
          trendValue={`₹${stats.monthlySales.toFixed(2)}`} 
          colorClass="green-500"
          langLabel={t.dash_thisMonth}
        />
        <StatCard 
          title={t.dash_todayPurchase} 
          value={`₹${stats.todayPurchase.toFixed(2)}`} 
          icon={ShoppingCart} 
          trendValue={`₹${stats.monthlyPurchase.toFixed(2)}`} 
          colorClass="blue-500" 
          langLabel={t.dash_thisMonth}
        />
        <StatCard 
          title={t.dash_todayExpense} 
          value={`₹${stats.todayExpense.toFixed(2)}`} 
          icon={Receipt} 
          trendValue={`₹${stats.monthlyExpense.toFixed(2)}`} 
          colorClass="orange-500" 
          langLabel={t.dash_thisMonth}
        />
        <StatCard 
          title={t.dash_todayProfit} 
          value={`₹${stats.todayProfit.toFixed(2)}`} 
          icon={TrendingUp} 
          trendValue={`₹${stats.monthlyProfit.toFixed(2)}`} 
          colorClass="mint-primary" 
          langLabel={t.dash_thisMonth}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t.dash_availableStock} 
          value={stats.availableStock} 
          icon={Package} 
          colorClass="indigo-500" 
        />
        <StatCard 
          title={t.dash_pendingWholesaler} 
          value={`₹${stats.pendingWholesaler}`} 
          icon={AlertCircle} 
          colorClass="red-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">{t.dash_salesVsPurchase}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" name={t.dash_salesLabel} stroke="#9370DB" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="purchase" name={t.dash_purchaseLabel} stroke="#cbd5e1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">{t.dash_weeklyRevenue}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="sales" name={t.dash_revenueLabel} fill="#9370DB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
