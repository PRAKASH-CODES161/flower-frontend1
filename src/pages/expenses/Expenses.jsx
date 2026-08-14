import React, { useState, useEffect } from 'react';
import { Receipt, Search, Plus, Trash2 } from 'lucide-react';
import { expenseService } from '../../services/expenseService';
import { useLanguage } from '../../context/LanguageContext';

export default function Expenses() {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    expenseType: 'Tea',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setExpenses(await expenseService.getAll());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await expenseService.create({
        expenseType: formData.expenseType,
        description: formData.description,
        amount: Number(formData.amount) || 0,
        date: new Date(formData.date).toISOString()
      });
      await loadData();
      setShowModal(false);
      setFormData({ ...formData, description: '', amount: '' });
      alert("Expense saved successfully!");
    } catch (error) {
      alert(error.message || "Failed to save expense");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await expenseService.delete(id);
      await loadData();
    }
  };

  const filtered = expenses.filter(e => 
    e.expenseType?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const monthStr = todayStr.slice(0, 7); // YYYY-MM

  const dailyTotal = expenses
    .filter(e => e.date.startsWith(todayStr))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const monthlyTotal = expenses
    .filter(e => e.date.startsWith(monthStr))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{t.exp_title}</h1>
          <p className="text-sm text-white/90 drop-shadow-md mt-1">{t.exp_subtitle}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="glass-button flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.exp_add}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 flex justify-between items-center bg-white/40 border-l-4 border-l-mint-primary">
          <div>
            <p className="text-sm font-medium text-slate-500">{t.exp_todayTotal}</p>
            <p className="text-2xl font-bold text-slate-800">₹{dailyTotal.toFixed(2)}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex justify-between items-center bg-white/40 border-l-4 border-l-blue-400">
          <div>
            <p className="text-sm font-medium text-slate-500">{t.exp_monthTotal}</p>
            <p className="text-2xl font-bold text-slate-800">₹{monthlyTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/40">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t.search_expenses} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input !pl-10 py-1.5 text-sm w-full"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50/50 text-slate-500 border-b border-white/50">
              <tr>
                <th className="px-6 py-4 font-medium">{t.date}</th>
                <th className="px-6 py-4 font-medium">{t.exp_category}</th>
                <th className="px-6 py-4 font-medium">{t.exp_description}</th>
                <th className="px-6 py-4 font-medium text-right">{t.amount}</th>
                <th className="px-6 py-4 font-medium text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{t[item.expenseType] || item.expenseType}</td>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4 text-right font-bold text-red-500">₹{item.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">{t.exp_noData}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{t.exp_add_new}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.date}</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="glass-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.exp_type}</label>
                <select value={formData.expenseType} onChange={e => setFormData({...formData, expenseType: e.target.value})} className="glass-input">
                  <option value="Tea">{t.Tea}</option>
                  <option value="Meals">{t.Meals}</option>
                  <option value="Transport">{t.Transport}</option>
                  <option value="Electricity">{t.Electricity}</option>
                  <option value="Rent">{t.Rent}</option>
                  <option value="Miscellaneous">{t.Miscellaneous}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.exp_description}</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="glass-input" placeholder={t.exp_description} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.amount} (₹)</label>
                <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="glass-input" />
              </div>

              <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-white/30">
                <button type="button" onClick={() => setShowModal(false)} className="glass-button-secondary">{t.cancel}</button>
                <button type="submit" className="glass-button">{t.exp_save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
