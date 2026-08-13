import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, IndianRupee } from 'lucide-react';
import { wholesalerService } from '../../services/wholesalerService';
import { useLanguage } from '../../context/LanguageContext';

export default function Wholesalers() {
  const { t } = useLanguage();
  const [wholesalers, setWholesalers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    address: ''
  });

  useEffect(() => {
    loadWholesalers();
  }, []);

  const loadWholesalers = async () => {
    setWholesalers(await wholesalerService.getAll());
  };

  const handleOpenModal = (wholesaler = null) => {
    if (wholesaler) {
      setEditingId(wholesaler.id);
      setFormData({
        name: wholesaler.name,
        mobileNumber: wholesaler.mobileNumber,
        address: wholesaler.address
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', mobileNumber: '', address: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await wholesalerService.update(editingId, formData);
    } else {
      await wholesalerService.create(formData);
    }
    await loadWholesalers();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this wholesaler?')) {
      await wholesalerService.delete(id);
      await loadWholesalers();
    }
  };

  const filteredWholesalers = wholesalers.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.mobileNumber.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{t.whole_title}</h1>
          <p className="text-sm text-white/90 drop-shadow-md mt-1">{t.whole_subtitle}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="glass-button flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {t.whole_add}
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/40">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t.searchName} 
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
                <th className="px-6 py-4 font-medium">{t.whole_name}</th>
                <th className="px-6 py-4 font-medium">{t.contact}</th>
                <th className="px-6 py-4 font-medium text-right">{t.rep_totalPurchase}</th>
                <th className="px-6 py-4 font-medium text-right">{t.whole_pending}</th>
                <th className="px-6 py-4 font-medium text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50">
              {filteredWholesalers.length > 0 ? (
                filteredWholesalers.map((w) => (
                  <tr key={w.id} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{w.name}</td>
                    <td className="px-6 py-4">
                      <div>{w.mobileNumber}</div>
                      <div className="text-xs text-slate-400">{w.address}</div>
                    </td>
                    <td className="px-6 py-4 text-right">₹{w.totalPurchase || 0}</td>
                    <td className="px-6 py-4 text-right font-medium text-red-500">₹{w.pendingAmount || 0}</td>
                    <td className="px-6 py-4 flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenModal(w)} className="text-blue-500 hover:text-blue-700 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(w.id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    {t.whole_noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingId ? t.whole_edit : t.whole_add}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.whole_name}</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="glass-input" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.whole_mobile}</label>
                <input 
                  required
                  type="tel" 
                  value={formData.mobileNumber}
                  onChange={e => setFormData({...formData, mobileNumber: e.target.value})}
                  className="glass-input" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.prof_address}</label>
                <textarea 
                  rows="2"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="glass-input resize-none" 
                />
              </div>
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/30">
                <button type="button" onClick={handleCloseModal} className="glass-button-secondary">{t.cancel}</button>
                <button type="submit" className="glass-button">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
