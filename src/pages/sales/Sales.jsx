import React, { useState, useEffect } from 'react';
import { IndianRupee, Search, Plus } from 'lucide-react';
import { salesService } from '../../services/salesService';
import { stockService } from '../../services/stockService';
import { useLanguage } from '../../context/LanguageContext';

export default function Sales() {
  const { t } = useLanguage();
  const [sales, setSales] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerMobile: '',
    flowerId: '',
    quantity: '',
    discount: '',
    paidAmount: '',
    paymentMethod: 'Cash'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [salesData, stockData] = await Promise.all([
      salesService.getAll(),
      stockService.getAll()
    ]);
    setSales(salesData);
    setStockItems(stockData);
  };

  const getSelectedFlower = () => stockItems.find(s => (s._id || s.id) === formData.flowerId) || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const flower = getSelectedFlower();
      if (!flower) return alert('Select a flower');

      const qty = Number(formData.quantity) || 0;
      if (qty > flower.availableQuantity) {
        return alert(`Insufficient stock! Only ${flower.availableQuantity} ${flower.unit} available.`);
      }

      const subtotal = qty * flower.sellingPrice;
      const discount = Number(formData.discount) || 0;
      const totalAmount = subtotal;
      const finalAmount = subtotal - discount;
      const paidAmount = Number(formData.paidAmount) || 0;

      // Record sale matching backend expectation
      await salesService.create({
        customerName: formData.customerName || 'Walk-in Customer',
        mobileNumber: formData.customerMobile, 
        date: new Date().toISOString(),
        totalAmount,
        discount,
        finalAmount, 
        paidAmount,
        balanceAmount: finalAmount - paidAmount,
        paymentMethod: formData.paymentMethod || 'Cash',
        items: [{
          flowerId: flower.flowerId?._id || flower.flowerId, 
          quantity: qty,
          sellingPrice: flower.sellingPrice
        }]
      });

      await loadData();
      setShowModal(false);
      setFormData({ customerName: '', customerMobile: '', flowerId: '', quantity: '', discount: '', paidAmount: '', paymentMethod: 'Cash' });
      alert("Sale saved successfully!");
    } catch (error) {
      alert(error.message || "Failed to save sale");
    }
  };

  const filtered = sales.filter(s => 
    s.billNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{t.sales_title}</h1>
          <p className="text-sm text-white/90 drop-shadow-md mt-1">{t.sales_subtitle}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="glass-button flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.sales_newSale}
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/40">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t.search} 
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
                <th className="px-6 py-4 font-medium">{t.sales_billNo}</th>
                <th className="px-6 py-4 font-medium">{t.sales_customer}</th>
                <th className="px-6 py-4 font-medium text-right">{t.sales_totalAmount}</th>
                <th className="px-6 py-4 font-medium text-right">{t.sales_paidAmount}</th>
                <th className="px-6 py-4 font-medium text-right">{t.balance}</th>
                <th className="px-6 py-4 font-medium text-center">{t.paymentMethod}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50">
              {filtered.map((item) => (
                <tr key={item._id || item.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.billNumber}</td>
                  <td className="px-6 py-4">{t[item.customerName] || item.customerName}</td>
                  <td className="px-6 py-4 text-right font-medium">₹{item.totalAmount}</td>
                  <td className="px-6 py-4 text-right font-medium text-green-600">₹{item.paidAmount}</td>
                  <td className="px-6 py-4 text-right text-red-500 font-medium">₹{item.balanceAmount || 0}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">{t.sales_noSales}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-mint-primary" /> Point of Sale
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_customerName}</label>
                  <input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_mobileNumber}</label>
                  <input type="tel" value={formData.customerMobile} onChange={e => setFormData({...formData, customerMobile: e.target.value})} className="glass-input" />
                </div>
              </div>

              <div className="border-t border-white/50 my-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_selectFlower}</label>
                  <select required value={formData.flowerId} onChange={e => setFormData({...formData, flowerId: e.target.value})} className="glass-input">
                    <option value="">-- {t.sales_selectFlower} --</option>
                    {stockItems.filter(s => s.availableQuantity > 0).map(s => {
                      const fName = s.flowerId?.flowerName || s.flowerName || 'Unknown';
                      return (
                        <option key={s._id || s.id} value={s._id || s.id}>{t[fName] || fName} (₹{s.sellingPrice}/{t[s.unit] || s.unit}) - {s.availableQuantity} available</option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_quantity}</label>
                  <input required type="number" step="0.01" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_discount}</label>
                  <input type="number" step="0.01" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="glass-input" />
                </div>
              </div>

              {getSelectedFlower() && (
                <div className="bg-white/40 p-4 rounded-xl border border-white/50 mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{t.sales_subtotal}:</span>
                    <span>₹{((Number(formData.quantity) || 0) * getSelectedFlower().sellingPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-500">
                    <span>{t.sales_discount}:</span>
                    <span>- ₹{(Number(formData.discount) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-white/60">
                    <span>{t.sales_totalAmount}:</span>
                    <span>₹{(((Number(formData.quantity) || 0) * getSelectedFlower().sellingPrice) - (Number(formData.discount) || 0)).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.amount} (₹)</label>
                  <input required type="number" step="0.01" value={formData.paidAmount} onChange={e => setFormData({...formData, paidAmount: e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.paymentMethod}</label>
                  <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="glass-input">
                    <option value="Cash">{t.cash}</option>
                    <option value="UPI">{t.upi}</option>
                    <option value="Card">{t.card}</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-white/30">
                <button type="button" onClick={() => setShowModal(false)} className="glass-button-secondary">{t.cancel}</button>
                <button type="submit" className="glass-button">{t.sales_completeSale}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
