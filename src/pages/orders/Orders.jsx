import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Plus, CheckCircle, Clock } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { stockService } from '../../services/stockService';
import { useLanguage } from '../../context/LanguageContext';

export default function Orders() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    flowerDetails: '',
    garlandType: 'Custom',
    quantity: '1',
    orderTotal: '',
    advanceAmount: '',
    deliveryDate: '',
    status: 'Pending'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setOrders(await orderService.getAll());
    setStockItems(await stockService.getAll());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = Number(formData.orderTotal) || 0;
    const advance = Number(formData.advanceAmount) || 0;
    
    await orderService.create({
      ...formData,
      quantity: Number(formData.quantity) || 1,
      orderTotal: total,
      advanceAmount: advance,
      balanceAmount: Math.max(0, total - advance),
    });
    
    await loadData();
    setShowModal(false);
    setFormData({ customerName: '', mobileNumber: '', flowerDetails: '', garlandType: 'Custom', quantity: '1', orderTotal: '', advanceAmount: '', deliveryDate: '', status: 'Pending' });
  };

  const updateStatus = async (id, newStatus) => {
    const ordersList = await orderService.getAll();
    const order = ordersList.find(o => o.id === id);
    if (order) {
      order.status = newStatus;
      await orderService.update(id, order);
      await loadData();
    }
  };

  const filtered = orders.filter(o => 
    o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    o.mobileNumber?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{t.ord_title}</h1>
          <p className="text-sm text-white/90 drop-shadow-md mt-1">{t.ord_subtitle}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="glass-button flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.ord_create}
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/40">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t.searchCustomer} 
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
                <th className="px-6 py-4 font-medium">{t.ord_deliveryDate}</th>
                <th className="px-6 py-4 font-medium">{t.sales_customer}</th>
                <th className="px-6 py-4 font-medium">{t.ord_details}</th>
                <th className="px-6 py-4 font-medium text-right">{t.balance}</th>
                <th className="px-6 py-4 font-medium text-center">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {new Date(item.deliveryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div>{t[item.customerName] || item.customerName}</div>
                    <div className="text-xs text-slate-400">{item.mobileNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{t[item.garlandType] || item.garlandType} ({item.quantity})</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{item.flowerDetails}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-slate-700">₹{item.orderTotal}</div>
                    <div className="text-xs text-red-500 font-medium">Due: ₹{item.balanceAmount}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === 'Pending' ? (
                      <button onClick={() => updateStatus(item.id, 'Confirmed')} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold hover:bg-yellow-200">{t.ord_status_pending}</button>
                    ) : item.status === 'Confirmed' ? (
                      <button onClick={() => updateStatus(item.id, 'Delivered')} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-200">{t.ord_status_confirmed}</button>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{t.ord_status_delivered}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">{t.ord_noData}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{t.ord_create}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_customerName}</label>
                  <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_mobileNumber}</label>
                  <input required type="tel" value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} className="glass-input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Garland / Decoration Type</label>
                <select required value={formData.garlandType} onChange={e => setFormData({...formData, garlandType: e.target.value})} className="glass-input">
                  <option value="">-- Choose Garland --</option>
                  {stockItems.filter(s => s.flowerName.toLowerCase().includes('garland')).map(g => (
                    <option key={g.id} value={g.flowerName}>{t[g.flowerName] || g.flowerName}</option>
                  ))}
                  <option value="Custom Decoration">{t['Custom Decoration (Other)'] || 'Custom Decoration (Other)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.ord_flowerDetails}</label>
                <textarea rows="2" value={formData.flowerDetails} onChange={e => setFormData({...formData, flowerDetails: e.target.value})} className="glass-input resize-none" placeholder={t.ord_flowerDetails} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_quantity}</label>
                  <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.ord_deliveryDate}</label>
                  <input required type="datetime-local" value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} className="glass-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.ord_orderTotal} (₹)</label>
                  <input required type="number" step="0.01" value={formData.orderTotal} onChange={e => setFormData({...formData, orderTotal: e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.ord_advancePaid} (₹)</label>
                  <input type="number" step="0.01" value={formData.advanceAmount} onChange={e => setFormData({...formData, advanceAmount: e.target.value})} className="glass-input" />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-white/30">
                <button type="button" onClick={() => setShowModal(false)} className="glass-button-secondary">{t.cancel}</button>
                <button type="submit" className="glass-button">{t.ord_create}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
