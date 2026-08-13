import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Receipt, DollarSign, ChevronRight } from 'lucide-react';
import { salesService } from '../../services/salesService';
import { purchaseService } from '../../services/purchaseService';
import { expenseService } from '../../services/expenseService';
import { useLanguage } from '../../context/LanguageContext';

export default function Reports() {
  const { t } = useLanguage();
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  const currentLocale = localStorage.getItem('language') === 'ta' ? 'ta-IN' : 'en-US';

  useEffect(() => {
    const fetchData = async () => {
      const sales = await salesService.getAll();
      const purchases = await purchaseService.getAll();
      const expenses = await expenseService.getAll();

      // Group data by YYYY-MM
    const grouped = {};

    const processRecord = (records, type, amountField) => {
      records.forEach(r => {
        if (!r.date) return;
        const monthKey = r.date.slice(0, 7); // YYYY-MM
        if (!grouped[monthKey]) {
          grouped[monthKey] = { monthKey, sales: 0, purchases: 0, expenses: 0, profit: 0 };
        }
        grouped[monthKey][type] += Number(r[amountField] || 0);
      });
    };

    processRecord(sales, 'sales', 'totalAmount');
    processRecord(purchases, 'purchases', 'totalAmount');
    processRecord(expenses, 'expenses', 'amount');

    // Calculate profit and format for array
    const result = Object.values(grouped).map(data => ({
      ...data,
      profit: data.sales - data.purchases - data.expenses,
      formattedMonth: new Date(data.monthKey + '-01').toLocaleDateString(currentLocale, { month: 'long', year: 'numeric' })
    })).sort((a, b) => b.monthKey.localeCompare(a.monthKey)); // Sort newest first

      setMonthlyData(result);
      if (result.length > 0) {
        setSelectedMonth(result[0]); // Select latest month by default
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white drop-shadow-md">{t.rep_title}</h1>
        <p className="text-white/90 text-sm mt-1 drop-shadow-md">{t.rep_subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar: Month List */}
        <div className="w-full lg:w-1/3 space-y-3">
          <h2 className="text-lg font-bold text-slate-800 bg-white/70 backdrop-blur-md p-4 rounded-xl border border-white/30 shadow-sm">
            {t.rep_selectMonth}
          </h2>
          <div className="mb-4 bg-white/50 p-4 rounded-xl border border-white/30 backdrop-blur-md">
            <label className="block text-sm font-medium text-slate-700 mb-2">{t.rep_pickMonth}</label>
            <input 
              type="month" 
              className="glass-input !bg-white/80" 
              onChange={(e) => {
                const val = e.target.value; // YYYY-MM
                if (val) {
                  const existing = monthlyData.find(d => d.monthKey === val);
                  if (existing) {
                    setSelectedMonth(existing);
                  } else {
                    // Create empty data for that month
                    setSelectedMonth({
                      monthKey: val,
                      formattedMonth: new Date(val + '-01').toLocaleDateString(currentLocale, { month: 'long', year: 'numeric' }),
                      sales: 0, purchases: 0, expenses: 0, profit: 0
                    });
                  }
                }
              }}
            />
          </div>
          <div className="space-y-2">
            {monthlyData.map((data) => (
              <button
                key={data.monthKey}
                onClick={() => setSelectedMonth(data)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 border ${
                  selectedMonth?.monthKey === data.monthKey 
                    ? 'bg-mint-primary text-white border-mint-primary shadow-lg shadow-mint-primary/30 transform scale-[1.02]' 
                    : 'bg-white/60 text-slate-700 border-white/40 hover:bg-white/80 backdrop-blur-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">{data.formattedMonth}</span>
                </div>
                <ChevronRight className={`w-5 h-5 ${selectedMonth?.monthKey === data.monthKey ? 'text-white' : 'text-slate-400'}`} />
              </button>
            ))}
            {monthlyData.length === 0 && (
              <div className="p-4 text-slate-500 bg-white/40 rounded-xl backdrop-blur-md border border-white/30 text-center">
                {t.rep_noData}
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Month Details */}
        <div className="w-full lg:w-2/3">
          {selectedMonth ? (
            <div className="glass-card p-6 md:p-8">
              <div className="flex justify-between items-center mb-8 border-b border-white/30 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedMonth.formattedMonth} {t.rep_report}
                </h2>
                <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                  selectedMonth.profit >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedMonth.profit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {selectedMonth.profit >= 0 ? t.rep_profit : t.rep_loss}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Sales */}
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/50 hover:bg-white/60 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-green-500/10 text-green-600 rounded-xl">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                    <h3 className="text-slate-500 font-medium">{t.rep_totalSales}</h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">₹{selectedMonth.sales.toFixed(2)}</p>
                </div>

                {/* Total Purchases */}
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/50 hover:bg-white/60 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <h3 className="text-slate-500 font-medium">{t.rep_totalPurchase}</h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">₹{selectedMonth.purchases.toFixed(2)}</p>
                </div>

                {/* Total Expenses / Salary */}
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/50 hover:bg-white/60 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-orange-500/10 text-orange-600 rounded-xl">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <h3 className="text-slate-500 font-medium">{t.rep_totalExpense}</h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">₹{selectedMonth.expenses.toFixed(2)}</p>
                </div>

                {/* Net Profit/Loss */}
                <div className={`backdrop-blur-sm p-6 rounded-2xl border transition-colors ${
                  selectedMonth.profit >= 0 
                    ? 'bg-mint-primary/10 border-mint-primary/20 hover:bg-mint-primary/20' 
                    : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-xl ${
                      selectedMonth.profit >= 0 ? 'bg-mint-primary text-white' : 'bg-red-500 text-white'
                    }`}>
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <h3 className={`font-medium ${selectedMonth.profit >= 0 ? 'text-mint-dark' : 'text-red-700'}`}>
                      {selectedMonth.profit >= 0 ? t.rep_netProfit : t.rep_netLoss}
                    </h3>
                  </div>
                  <p className={`text-3xl font-bold ${selectedMonth.profit >= 0 ? 'text-mint-dark' : 'text-red-700'}`}>
                    {selectedMonth.profit < 0 ? '-' : ''}₹{Math.abs(selectedMonth.profit).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card h-full min-h-[400px] flex items-center justify-center p-8">
              <div className="text-center text-slate-400">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">{t.rep_selectMonth}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
