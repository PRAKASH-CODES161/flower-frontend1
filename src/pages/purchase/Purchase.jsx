import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus } from 'lucide-react';
import { purchaseService } from '../../services/purchaseService';
import { wholesalerService } from '../../services/wholesalerService';
import { stockService } from '../../services/stockService';
import { useLanguage } from '../../context/LanguageContext';

export default function Purchase() {
  const { t } = useLanguage();
  const [purchases, setPurchases] = useState([]);
  const [wholesalers, setWholesalers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    wholesalerId: '',
    flowerName: '',
    quantity: '',
    unit: 'Kg',
    pricePerUnit: '',
    paidAmount: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setPurchases(await purchaseService.getAll());
    setWholesalers(await wholesalerService.getAll());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = Number(formData.quantity) || 0;
    const price = Number(formData.pricePerUnit) || 0;
    const totalAmount = qty * price;
    try {
      if (!formData.flowerName || !formData.wholesalerId) {
        return alert("Please enter a flower name and select a wholesaler");
      }

      await purchaseService.create({
        flowerName: formData.flowerName,
        wholesalerId: formData.wholesalerId,
        quantity: qty,
        unit: formData.unit,
        purchasePrice: price,
        sellingPrice: price * 1.5, // Auto-generate a selling price if not provided
        totalAmount: totalAmount,
        paidAmount: Number(formData.paidAmount) || 0,
        date: new Date().toISOString()
      });
      await loadData();
      setShowModal(false);
      setFormData({
        flowerName: '', wholesalerId: '', quantity: '', unit: 'Kg',
        pricePerUnit: '', paidAmount: ''
      });
      alert("Purchase saved successfully!");
    } catch (error) {
      alert(error.message || "Failed to save purchase");
    }
  };

  const filtered = purchases.filter(p => 
    p.wholesalerName?.toLowerCase().includes(search.toLowerCase()) ||
    p.flowerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{t.pur_title}</h1>
          <p className="text-sm text-white/90 drop-shadow-md mt-1">{t.pur_subtitle}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="glass-button flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.pur_addPurchase}
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/40">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search wholesaler or flower..." 
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
                <th className="px-6 py-4 font-medium">{t.pur_wholesaler}</th>
                <th className="px-6 py-4 font-medium">{t.stock_flowerName}</th>
                <th className="px-6 py-4 font-medium text-right">{t.sales_quantity}</th>
                <th className="px-6 py-4 font-medium text-right">{t.sales_totalAmount}</th>
                <th className="px-6 py-4 font-medium text-right">{t.whole_pending}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{t[item.wholesalerName] || item.wholesalerName || 'Unknown'}</td>
                  <td className="px-6 py-4">{t[item.flowerName] || item.flowerName}</td>
                  <td className="px-6 py-4 text-right font-medium text-mint-dark">{item.quantity} {t[item.unit] || item.unit}</td>
                  <td className="px-6 py-4 text-right">₹{item.totalAmount}</td>
                  <td className="px-6 py-4 text-right text-red-500 font-medium">₹{item.pendingAmount || 0}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500">{t.pur_noPurchases}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Purchase</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.pur_wholesaler}</label>
                <select 
                  required
                  value={formData.wholesalerId}
                  onChange={e => setFormData({...formData, wholesalerId: e.target.value})}
                  className="glass-input"
                >
                  <option value="">-- {t.pur_wholesaler} --</option>
                  {wholesalers.map(w => (
                    <option key={w._id || w.id} value={w._id || w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock_flowerName}</label>
                <input required type="text" value={formData.flowerName} onChange={e => setFormData({...formData, flowerName: e.target.value})} className="glass-input" placeholder={t.stock_flowerName} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_quantity}</label>
                  <input required type="number" step="0.01" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock_unit}</label>
                  <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="glass-input">
                    <option value="Kg">Kg</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Bundles">Bundles</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock_buyPrice} (₹)</label>
                <input required type="number" step="0.01" value={formData.pricePerUnit} onChange={e => setFormData({...formData, pricePerUnit: e.target.value})} className="glass-input" />
              </div>

              <div className="bg-white/40 p-4 rounded-xl border border-white/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">{t.sales_totalAmount}:</span>
                  <span className="text-lg font-bold text-mint-dark">
                    ₹{((Number(formData.quantity) || 0) * (Number(formData.pricePerUnit) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_paidAmount} (₹)</label>
                <input type="number" step="0.01" value={formData.paidAmount} onChange={e => setFormData({...formData, paidAmount: e.target.value})} className="glass-input" />
              </div>

              <div className="flex justify-between items-center bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <span className="text-sm font-medium text-red-600">{t.whole_pending}:</span>
                  <span className="text-md font-bold text-red-600">
                    ₹{Math.max(0, (((Number(formData.quantity) || 0) * (Number(formData.pricePerUnit) || 0)) - (Number(formData.paidAmount) || 0))).toFixed(2)}
                  </span>
              </div>

              <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-white/30">
                <button type="button" onClick={() => setShowModal(false)} className="glass-button-secondary">{t.cancel}</button>
                <button type="submit" className="glass-button">{t.pur_completePurchase}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
