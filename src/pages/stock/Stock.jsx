import React, { useState, useEffect } from 'react';
import { Package, Search, Plus } from 'lucide-react';
import { stockService } from '../../services/stockService';
import { useLanguage } from '../../context/LanguageContext';

export default function Stock() {
  const { t } = useLanguage();
  const [stockItems, setStockItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    flowerName: '',
    availableQuantity: '',
    unit: 'Kg',
    purchasePrice: '',
    sellingPrice: '',
    minimumStockLevel: '10'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setStockItems(await stockService.getAll());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newItem = {
        flowerName: formData.flowerName,
        availableQuantity: Number(formData.availableQuantity) || 0,
        unit: formData.unit,
        purchasePrice: Number(formData.purchasePrice) || 0,
        sellingPrice: Number(formData.sellingPrice) || 0,
        minimumStockLevel: Number(formData.minimumStockLevel) || 10
      };
      
      // Check if flower already exists
      const existingStock = stockItems.find(s => s.flowerName.toLowerCase() === newItem.flowerName.toLowerCase());
      if (existingStock) {
        existingStock.availableQuantity = (Number(existingStock.availableQuantity) || 0) + newItem.availableQuantity;
        existingStock.purchasePrice = newItem.purchasePrice || existingStock.purchasePrice;
        existingStock.sellingPrice = newItem.sellingPrice || existingStock.sellingPrice;
        await stockService.update(existingStock.id || existingStock._id, existingStock);
      } else {
        await stockService.create(newItem);
      }

      await loadData();
      setShowModal(false);
      setFormData({ flowerName: '', availableQuantity: '', unit: 'Kg', purchasePrice: '', sellingPrice: '', minimumStockLevel: '10' });
      alert("Stock saved successfully!");
    } catch (error) {
      alert(error.message || "Failed to save stock");
    }
  };

  const filtered = stockItems.filter(s => s.flowerName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{t.stock_title}</h1>
          <p className="text-sm text-white/90 drop-shadow-md mt-1">{t.stock_subtitle}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="glass-button flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.stock_addStock}
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/40">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t.search_stock} 
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
                <th className="px-6 py-4 font-medium">{t.stock_flowerName}</th>
                <th className="px-6 py-4 font-medium text-right">{t.stock_availableQty}</th>
                <th className="px-6 py-4 font-medium">{t.stock_unit}</th>
                <th className="px-6 py-4 font-medium text-right">{t.stock_buyPrice}</th>
                <th className="px-6 py-4 font-medium text-right">{t.stock_sellPrice}</th>
                <th className="px-6 py-4 font-medium text-center">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50">
              {filtered.map((item) => {
                const qty = Number(item.availableQuantity) || 0;
                const minQty = Number(item.minimumStockLevel) || 10;
                let status = "In Stock";
                let statusClass = "bg-green-100 text-green-700 border-green-200";
                
                if (qty === 0) {
                  status = t.status_outOfStock;
                  statusClass = "bg-red-100 text-red-700 border-red-200";
                } else if (qty <= minQty) {
                  status = t.status_lowStock;
                  statusClass = "bg-orange-100 text-orange-700 border-orange-200";
                } else {
                  status = t.status_inStock;
                }

                return (
                  <tr key={item.id} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{t[item.flowerName] || item.flowerName}</td>
                    <td className="px-6 py-4 text-right font-medium text-mint-dark">{item.availableQuantity}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {t[item.unit] || item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">₹{item.purchasePrice}</td>
                    <td className="px-6 py-4 text-right">₹{item.sellingPrice}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500">{t.stock_noStock}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{t.stock_addStock}</h2>
            <p className="text-xs text-slate-500 mb-4 bg-white/50 p-2 rounded border border-white">
              {t.stock_note}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock_flowerName}</label>
                <input required type="text" value={formData.flowerName} onChange={e => setFormData({...formData, flowerName: e.target.value})} className="glass-input" placeholder={t.stock_flowerName} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.sales_quantity}</label>
                  <input required type="number" step="0.01" value={formData.availableQuantity} onChange={e => setFormData({...formData, availableQuantity: e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock_unit}</label>
                  <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="glass-input">
                    <option value="Kg">{t['Kg']}</option>
                    <option value="Pieces">{t['Pieces']}</option>
                    <option value="Bundles">{t['Bundles']}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock_buyPrice} (₹)</label>
                  <input required type="number" step="0.01" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock_sellPrice} (₹)</label>
                  <input required type="number" step="0.01" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} className="glass-input" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock_minAlert}</label>
                <input required type="number" step="0.01" value={formData.minimumStockLevel} onChange={e => setFormData({...formData, minimumStockLevel: e.target.value})} className="glass-input" />
              </div>

              <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-white/30">
                <button type="button" onClick={() => setShowModal(false)} className="glass-button-secondary">{t.cancel}</button>
                <button type="submit" className="glass-button">{t.stock_save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
