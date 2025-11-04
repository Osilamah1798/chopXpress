import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, Lock, AlertCircle, CheckCircle } from 'lucide-react';


const ProfileSettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');

  const [passwordForm, setPasswordForm] = useState({ new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [imagePreview, setImagePreview] = useState<string | null>(user?.avatarUrl || null);
  const [imageError, setImageError] = useState('');
  const [isUploading, setIsUploading] = useState(false);


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit for profile pics
          setImageError("File is too large. Max size is 1MB.");
          return;
      }
      setIsUploading(true);
      setImageError('');
      
      // Simulate upload and show local preview. This won't be persisted.
      const localImageUrl = URL.createObjectURL(file);
      setImagePreview(localImageUrl);
      
      setTimeout(async () => {
          await updateUser(user.id, { avatarUrl: localImageUrl });
          setIsUploading(false);
          alert("Profile picture updated locally. This change will not be saved.");
      }, 1000);
    }
  };


  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameSuccess('');
    if (!username.trim()) {
      setUsernameError('Username cannot be empty.');
      return;
    }
    if (username.trim() === user?.username) {
      setUsernameError('This is already your current username.');
      return;
    }
    if (user) {
        await updateUser(user.id, { username: username.trim() });
        setUsernameError('');
        setUsernameSuccess('Username updated successfully!');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.new || !passwordForm.confirm) {
        setPasswordError('All password fields are required.');
        return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
        setPasswordError('New passwords do not match.');
        return;
    }
    if (passwordForm.new.length < 6) {
        setPasswordError('New password must be at least 6 characters long.');
        return;
    }
    
    // Simulate API call
    setPasswordSuccess('Password change functionality is disabled.');
    setPasswordForm({ new: '', confirm: '' });
  };


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-secondary">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information and security settings.</p>
      </div>

       {/* Profile Picture Form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-secondary mb-1 flex items-center gap-2">
            <UserCircle size={22}/> Profile Picture
        </h2>
        <p className="text-sm text-gray-500 mb-6">Upload a new profile picture.</p>
        <div className="flex items-center gap-6">
            {imagePreview ? (
                <img src={imagePreview} alt="Profile Avatar" className="w-24 h-24 rounded-full object-cover" />
            ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserCircle size={48} className="text-gray-400" />
                </div>
            )}
            <div>
                <label htmlFor="avatar-upload" className={`cursor-pointer bg-secondary text-white font-bold py-2 px-5 rounded-full hover:bg-gray-700 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                </label>
                <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} disabled={isUploading}/>
                <p className="text-xs text-gray-500 mt-2">PNG or JPG, up to 1MB.</p>
                {imageError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{imageError}</p>}
            </div>
        </div>
      </div>

      {/* Personal Information Form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-secondary mb-1 flex items-center gap-2">
            <UserCircle size={22}/> Personal Information
        </h2>
        <p className="text-sm text-gray-500 mb-6">Update your public profile information.</p>
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setUsernameError(''); setUsernameSuccess(''); }}
              className={`w-full px-4 py-2 border ${usernameError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary focus:border-primary`}
            />
            {usernameError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{usernameError}</p>}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-secondary text-white font-bold py-2 px-5 rounded-full hover:bg-gray-700 transition-colors">
              Save Username
            </button>
          </div>
          {usernameSuccess && <p className="text-green-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/>{usernameSuccess}</p>}
        </form>
      </div>
      
      {/* Security Form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-secondary mb-1 flex items-center gap-2">
            <Lock size={22}/> Security
        </h2>
        <p className="text-sm text-gray-500 mb-6">Change your password.</p>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="new" className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
            <input type="password" id="new" value={passwordForm.new} onChange={(e) => setPasswordForm(p => ({...p, new: e.target.value}))} className={`w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg`}/>
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" id="confirm" value={passwordForm.confirm} onChange={(e) => setPasswordForm(p => ({...p, confirm: e.target.value}))} className={`w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg`}/>
          </div>
          {passwordError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{passwordError}</p>}

          <div className="flex justify-end">
             <button type="submit" className="bg-secondary text-white font-bold py-2 px-5 rounded-full hover:bg-gray-700 transition-colors">
              Change Password
            </button>
          </div>
           {passwordSuccess && <p className="text-green-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/>{passwordSuccess}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;