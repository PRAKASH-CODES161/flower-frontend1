import React, { useState, useEffect } from 'react';
import { User, Store, Phone, MapPin } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState({
    shopName: '',
    ownerName: '',
    mobileNumber: '',
    address: '',
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const profiles = await profileService.getAll();
      if (profiles && profiles.length > 0) {
        setProfile(profiles[0]);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profile.id) {
      await profileService.update(profile.id, profile);
    } else {
      await profileService.create(profile);
    }
    setSaveMessage('Profile saved successfully!');
    setIsEditing(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{t.prof_title}</h1>
          <p className="text-sm text-white/90 drop-shadow-md mt-1">{t.prof_subtitle}</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="glass-button">
            {t.prof_edit}
          </button>
        )}
      </div>

      {saveMessage && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg border border-green-200">
          {saveMessage}
        </div>
      )}

      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 mb-8 border-b border-white/40 pb-8">
          <div className="flex-shrink-0">
            {profile.image ? (
              <img src={profile.image} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
            ) : (
              <div className="w-32 h-32 bg-mint-light rounded-full border-4 border-white shadow-lg flex items-center justify-center text-mint-primary">
                <Store className="w-16 h-16" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{profile.shopName || 'Your Shop Name'}</h2>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-mint-primary" />
                <span>{profile.ownerName || 'Owner Name'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-mint-primary" />
                <span>{profile.mobileNumber || 'Mobile Number'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-mint-primary" />
                <span>{profile.address || 'Shop Address'}</span>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Shop Name</label>
                <input required type="text" value={profile.shopName} onChange={e => setProfile({...profile, shopName: e.target.value})} className="glass-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                <input required type="text" value={profile.ownerName} onChange={e => setProfile({...profile, ownerName: e.target.value})} className="glass-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                <input required type="tel" value={profile.mobileNumber} onChange={e => setProfile({...profile, mobileNumber: e.target.value})} className="glass-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profile Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="glass-input p-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
                <textarea rows="3" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="glass-input resize-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-white/30">
              <button type="button" onClick={() => setIsEditing(false)} className="glass-button-secondary">Cancel</button>
              <button type="submit" className="glass-button">Save Changes</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
